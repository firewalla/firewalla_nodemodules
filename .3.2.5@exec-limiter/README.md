
# exec-limiter

 [![Patreon](https://img.shields.io/badge/Support%20me%20on-Patreon-%23e6461a.svg)][patreon] [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Travis](https://img.shields.io/travis/IonicaBizau/node-exec-limiter.svg)](https://travis-ci.org/IonicaBizau/node-exec-limiter/) [![Version](https://img.shields.io/npm/v/exec-limiter.svg)](https://www.npmjs.com/package/exec-limiter) [![Downloads](https://img.shields.io/npm/dt/exec-limiter.svg)](https://www.npmjs.com/package/exec-limiter) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Limit the shell execution commands to <x> calls same time.

## :cloud: Installation

```sh
$ npm i --save exec-limiter
```


## :clipboard: Example



```js
// Dependencies
var ExecLimiter = require("exec-limiter");

// Constants
const COMMAND = "sleep 5; date;";

// Create an instance of exec limiter
var el = new ExecLimiter(2);

// #1
el.add("sleep 5", function (err) {
    console.log(err || "Waited 5 seconds for the first time.");
});

// #2
el.add("sleep", ["7"], function (err) {
    console.log(err || "Waited another 7 seconds but probably I was ran in parallel with the other process.");
});

// #3
el.add("sleep 5", function (err) {
    console.log(err || "I was ran in parallel with the second process and finished fine.");
});

// #4
el.add("ls", ["-l"], { ignoreStdout: false }, function (err, stdout) {
    console.log(err || "The spawned 'ls -l' returned:\n" + stdout);
});

// These will be executed like below:
//
// Timeline: 0-1-2-3-4-5-6-7-8-9-10-11
//
//       #1: ==========
//       #2: ==============
//       #3:            ============
//       #4:               ==
//
// Notice how they run in parallel, but not more than 2 in the same time.
```

## :memo: Documentation


### `ExecLimiter(limit)`
Creates a new instance of `ExecLimiter`.

#### Params
- **Number** `limit`: The limit of commands to run same time.

#### Return
- **ExecLimiter** The `ExecLimiter` instance.

### `add(command, args, options, callback)`
Adds a new command to run in the buffer.

Usage:

```js
el.add(command, fn); // exec
el.add(command, args, fn); // spawn
el.add(command, options, fn); // exec
el.add(command, args, options, fn); // spawn
```

#### Params
- **String** `command`: The command to run as string.
- **Object** `args`: The command arguments as array of strings (optional).
- **Object** `options`: The options passed to the spawn/exec function, but extended with the following fields:
 - `ignoreStdout` (Boolean): If `false`, then the stdout output will be stored ant called back.
- **Function** `callback`: The callback function.

#### Return
- **ExecLimiter** The `ExecLimiter` instance.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :moneybag: Donations

Another way to support the development of my open-source modules is
to [set up a recurring donation, via Patreon][patreon]. :rocket:

[PayPal donations][paypal-donations] are appreciated too! Each dollar helps.

Thanks! :heart:

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`engine-tools`](https://github.com/jillix/engine-tools) (by jillix)—Engine Tools library and CLI app.
 - [`git-stat`](https://github.com/maxdeviant/git-stat#readme) (by Marshall Bowers)—Statistic generation for Git.
 - [`gpm`](https://github.com/IonicaBizau/gpm)—npm + git = gpm - Install NPM packages and dependencies from git repositories.
 - [`gry`](https://github.com/IonicaBizau/node-gry)—A minimalist NodeJS wrapper for the `git` commands. `gry` stands for the Git RepositorY.
 - [`npmreserve`](https://github.com/IonicaBizau/npmreserve)—Reserve package names on NPM.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[patreon]: https://www.patreon.com/ionicabizau
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
