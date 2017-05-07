"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var state = {
  awaiting: 0,
  resolved: 1,
  rejected: 2
};

var Promise = function () {
  function Promise(cb) {
    _classCallCheck(this, Promise);

    this.callbacks = [];
    this.state = state.awaiting;
    this.resolvedTo = null;
    this.rejectedTo = null;
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this._next = this._next.bind(this);
    this.then = this.then.bind(this);
    cb(this.resolve, this.reject);
  }

  _createClass(Promise, [{
    key: "resolve",
    value: function resolve(result) {
      this.state = state.resolved;
      this.resolvedTo = result;
      this._next(result);
    }
  }, {
    key: "reject",
    value: function reject(err) {
      this.state = state.rejected;
      this.rejectedTo = err;
      this._next(null, err);
    }
  }, {
    key: "_unwrap",
    value: function _unwrap(promise, resolve) {
      var _this = this;

      if (promise instanceof Promise) {
        promise.then(function (result) {
          _this._unwrap(result, resolve);
        });
        return;
      }
      resolve(promise);
    }
    //open up all callbacks that were waiting on this given promise. (.thened on it)

  }, {
    key: "_next",
    value: function _next() {
      var resolution = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var rejection = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      //return a new promise...
      while (this.callbacks.length > 0) {
        var deferred = this.callbacks.shift();
        if (deferred) {
          var didResolve = deferred.didResolve;
          var didReject = deferred.didReject;
          var reject = deferred.reject;
          var resolve = deferred.resolve;

          switch (this.state) {
            case state.resolved:
              var promise = didResolve(resolution); //TODO: unwrap potential promise promise being returned from cb.
              this._unwrap(promise, resolve);
              break;
            case state.rejected:
              reject(didReject(rejection));
              break;
          }
        }
      }
    }
  }, {
    key: "then",
    value: function then(didResolve, didReject) {
      var _this2 = this;

      //only go forward with .then once we've finished up with the previous promise.
      //the callback inside of .thens can also be async.
      //if the returned callback has a promise.. we continue down the chain. and provide it as the resolution or rejection to the next then statement.
      // console.log('about to handle ', didResolve, this.state, this.resolvedTo)
      return new Promise(function (resolve, reject) {
        if (_this2.state == state.resolved) {
          var promise = didResolve(_this2.resolvedTo);
          _this2._unwrap(promise, resolve);
        } else if (_this2.state == state.rejected) {
          // console.log('rejecting')
          reject(didReject(_this2.rejectedTo)); //TODO: need?
        } else {
          //defer this wrapped promise.
          // console.log('deferring ', didResolve)
          var defer = {
            didResolve: didResolve,
            didReject: didReject,
            resolve: resolve,
            reject: reject
          };
          _this2.callbacks = [].concat(_toConsumableArray(_this2.callbacks), [defer]);
        }
      });
    }
  }]);

  return Promise;
}();

exports.default = Promise;