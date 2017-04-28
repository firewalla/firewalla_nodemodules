'use strict';

var _Promise = require('../Promise');

var _Promise2 = _interopRequireDefault(_Promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var P = new _Promise2.default(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 2000);
}).then(function (result) {
  //this should append to the new promise.
  console.log('result 1 ', result);
  return result + 1;
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(2)
  //   }, 2000)
  // })
  //note that the final .then is called once the prior promise chain actually completes.
}).then(function (result) {
  console.log('final then ', result);
  //if we return a new promise here.... p will get set
  return new _Promise2.default(function (resolve, reject) {
    resolve(4);
  });
}).then(function (promise) {
  console.log('promise ', promise);
  return new _Promise2.default(function (resolve, reject) {
    // resolve('hi')
    setTimeout(function () {
      console.log('resolving hi');
      resolve('hi');
    }, 1000);
  });
}).then(function (d) {
  console.log('d ', d);
}); // import Promise from '../Promise'
//
// const P = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     Math.random() > .0 ? resolve('yay') : reject('nah')
//   }, 1000)
// }).then(function(resolve) {
//   console.log('resolve callback ', resolve)
//   //if we return here. it should go back into the promise chain. and it can be async here.
//   // return new Promise((resolve, reject) => {
//   //   setTimeout(() => {
//   //     Math.random() > .5 ? resolve('yay2') : reject('nah2')
//   //   }, 1000)
//   // })
//   return 5
// }, function(reject) {
//   console.log('reject callback ', reject)
//
// }).then(function(resolve) {
//   console.log('resolve callback ', resolve)
// }, function(reject) {
//   console.log('reject callback ', reject)
// })
//
//

//
// import Promise from '../Promise';
// const P = new Promise((res, rej) => {
//     res(123);
// });
// let testsPassed = 0;
// const P2 = P.then((value) => {
//     console.log('P resolved.  Value is ' + value);
//     testsPassed += (value === 123);
// });
// const P3 = P.then((value) => {
//     console.log('P resolved.  Value is ' + value);
//     testsPassed += (value === 123);
//     return 5
// }).then((value2) => {
//   console.log('running after p3', value2)
//   return 7
// }).then((value) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('fin executing async')
//       resolve(1000)
//     }, 1000)
//     console.log('start executing async')
//   })
// });
//
// P3.then((last) => {
//   console.log('last ', last)
// })
// setTimeout(() => {
//     const total = 2;
//     console.log(`${testsPassed} / ${total} tests passed.`);
// }, 4000);


//TODO: test 3
// import Promise from '../Promise'
// const P = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1)
//   }, 2000)
// }).then(result => {  //this should append to the new promise.
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(2)
//     }, 2000)
//   }).then(result => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(3)
//       }, 2000)
//     })
//   })
//   //note that the final .then is called once the prior promise chain actually completes.
// }).then(result => {
//   console.log('final then ', result)
//   //if we return a new promise here.... p will get set
//   return new Promise((resolve, reject) => {
//     resolve(4)
//   })
// })
//
// //all the .thens on the same promise reference do get calls in order on it's resolution.
// //so we do need an array of then callbacks.
// P.then(result => {
//   console.log('result ', result)
//   return new Promise((resolve, reject) => {
//     resolve(5)
//   })
// }).then(console.log)
// P.then(result => {
//   console.log('result ', result)
// })