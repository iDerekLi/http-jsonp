# httpJsonp

[![Build Status](https://travis-ci.org/iDerekLi/http-jsonp.svg?branch=master)](https://travis-ci.org/iDerekLi/http-jsonp)
[![npm version](https://img.shields.io/npm/v/http-jsonp.svg?style=flat-square)](https://www.npmjs.com/package/http-jsonp)
[![npm downloads](https://img.shields.io/npm/dm/http-jsonp.svg?style=flat-square)](https://www.npmjs.com/package/http-jsonp)
[![npm license](https://img.shields.io/npm/l/http-jsonp.svg?style=flat-square)](https://github.com/iderekli/http-jsonp)

A JSONP cross-origin request library

## Features

- Supports the Requests the Script
- State callback
- Cancel requests

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 7+ ✔ |

## Installation

Using npm:

```shell
$ npm install http-jsonp
```

or Yarn:

```shell
$ yarn add http-jsonp
```

Using cdn:

```html
<script type="text/javascript" src="https://unpkg.com/http-jsonp/dist/http-jsonp.min.js"></script>
```

## Example

Performing a `JsonpCallbck` request

```javascript
import httpJsonp from "http-jsonp";

httpJsonp({
  url: "/user",
  params: {
    ID: 123456
  },
  callback: function(data) {
    console.log("callback", data);
  },
  load: function() {
    console.log("load");
  },
  error: function(err) {
    console.log(err);
  }
});
```

Performing a `script` request

```javascript
import httpJsonp from "http-jsonp";

httpJsonp({
  url: "/lodash.js",
  params: {
    v: "3.8.0"
  },
  callbackProp: false,
  load: function() {
    console.log("load", window._);
  },
  error: function(err) {
    console.log(err);
  }
});
```

## httpJsonp API

Requests can be made by passing the relevant options to `httpJsonp`.

##### httpJsonp(options)

## Request Options

```javascript
{
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  baseURL: "", // baseURL: "https://example.com/api/"

  // `url` is the server URL that will be used for the request.
  url: "", // url: "/jsonpdata"

  // `params` are the URL parameters to be sent with the request.(Includes Callback behavior)
  params: {},

  // `callbackProp` Specify which key in `params` is the callback behavior interface.
  // If a key value in `params` is specified, the specified value overrides the default random name of `httpJsonp`
  callbackProp: "callback", // default

  // Callback name prefix.
  prefix: "__httpJsonp",

  // Callback name. (Default callback name = `prefix`+`name`+random number)
  name: "Callback",

  // `timeout` specifies the number of milliseconds before the request times out.
  timeout: 60000, // default

  // script attribute
  scriptAttr: {
    type: "",
    charset: "",
    crossOrigin: null,
    async: true,
    defer: false
  },

  // Does the script tag remain when the request is completed.
  keepScriptTag: false,

  // A function to be called if the callback is triggered.
  callback: null,

  // A function to be called if the request load complete.
  load: null,

  // A function to be called if the request fails.
  error: null
}
```

## License

MIT
