
# package-json-path

 [![Patreon](https://img.shields.io/badge/Support%20me%20on-Patreon-%23e6461a.svg)][patreon] [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/package-json-path.svg)](https://www.npmjs.com/package/package-json-path) [![Downloads](https://img.shields.io/npm/dt/package-json-path.svg)](https://www.npmjs.com/package/package-json-path) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Get the package.json path in a specific directory.

## :cloud: Installation

```sh
$ npm i --save package-json-path
```


## :clipboard: Example



```js
const packPath = require("package-json-path");

console.log(packPath("~/path/to/my/module"));
// => /home/ionicabizau/path/to/my/module/package.json

console.log(packPath("relative/path/to/module"));
// => /home/ionicabizau/Documents/.../relative/path/to/module/package.json
```

## :memo: Documentation


### `packageJsonPath(dir)`
Finds the absolute path to the `package.json` path.

#### Params
- **String** `dir`: The path to the directory.

#### Return
- **String** The absolute path to the `package.json` file.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :moneybag: Donations

Another way to support the development of my open-source modules is
to [set up a recurring donation, via Patreon][patreon]. :rocket:

[PayPal donations][paypal-donations] are appreciated too! Each dollar helps.

Thanks! :heart:

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`made-in-brazil`](https://github.com/IonicaBizau/made-in-brazil#readme)—A list of neat projects made in Brazil.
 - [`made-in-india`](https://github.com/IonicaBizau/made-in-india#readme)—A list of neat projects made in India.
 - [`made-in-romania`](https://github.com/IonicaBizau/made-in-romania#readme)—A list of cool projects made in Romania.
 - [`np-init`](https://github.com/IonicaBizau/np-init#readme)—Easily start a npm package from scratch.
 - [`packy`](https://github.com/IonicaBizau/packy#readme)—Set default fields in your package.json files.
 - [`r-package-json`](https://github.com/IonicaBizau/r-package-json#readme)—Read package.json files.
 - [`ship-release`](https://github.com/IonicaBizau/ship-release#readme)—Publish new versions on GitHub and npm with ease.
 - [`w-package-json`](https://github.com/IonicaBizau/w-package-json#readme)—Write package.json files.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[patreon]: https://www.patreon.com/ionicabizau
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
