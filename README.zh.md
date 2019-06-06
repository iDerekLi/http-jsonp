# httpJsonp

[![Build Status](https://travis-ci.org/iDerekLi/http-jsonp.svg?branch=master)](https://travis-ci.org/iDerekLi/http-jsonp)
[![npm version](https://img.shields.io/npm/v/http-jsonp.svg?style=flat-square)](https://www.npmjs.com/package/http-jsonp)
[![npm downloads](https://img.shields.io/npm/dm/http-jsonp.svg?style=flat-square)](https://www.npmjs.com/package/http-jsonp)
[![npm license](https://img.shields.io/npm/l/http-jsonp.svg?style=flat-square)](https://github.com/iderekli/http-jsonp)

* [English](./README.md)

JSONP跨域请求库

## 特征

- 支持请求script js
- 状态回调
- 取消请求

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 7+ ✔ |

## 安装

使用npm：

```shell
$ npm install --save http-jsonp
```

使用Yarn：

```shell
$ yarn add http-jsonp
```

CDN：

```html
<script type="text/javascript" src="https://unpkg.com/http-jsonp/dist/http-jsonp.min.js"></script>
```

## 示例

一个 `JsonpCallbck` 请求：

```javascript
import httpJsonp from "http-jsonp";

httpJsonp({
  url: "/user",
  params: {
    ID: 123456
  },
  callbackProp: "callback",
  callback: function(data) {
    console.log("callback", data);
  },
  error: function(err) {
    console.log(err);
  },
  complete: function() {
    console.log("complete");
  }
});
```

一个 `script` 请求：

```javascript
import httpJsonp from "http-jsonp";

httpJsonp({
  url: "/lodash.js",
  params: {
    v: "3.8.0"
  },
  load: function() {
    console.log("load", window._);
  },
  error: function(err) {
    console.log("error");
  },
  complete: function() {
    console.log("complete");
  }
});
```

## httpJsonp API

可以通过将相关选项传递给 `httpJsonp` 来进行请求

##### httpJsonp(options)

## Request Options

```javascript
{
  // `baseURL`将被添加到`url`，除非`url`是绝对的。
  baseURL: "", // baseURL: "https://example.com/api/"

  // `url`是将用于请求的服务器URL。
  url: "", // url: "/jsonpdata"

  // `params`是随请求一起发送的URL参数。（包括回调行为）
  params: {},

  // `callbackProp` 指定 `params` 中的哪个键作为Callback接口。
  // 如果指定了 `params` 中一个存在的键值，则指定的值将覆盖默认的随机名称 `callbackName`
  callbackProp: false, // default [false, callbackProp]

  // `callbackNamespase` Callback名称前的命名空间
  // exmaple：
  //   "__httpJsonpCallback" = window.__httpJsonpCallback = {}
  callbackNamespase: "__httpJsonpCallback", // default

  // `callbackName` Callback名称。 （如果未指定，则随机生成名称）
  callbackName: "",

  // `timeout` 指定请求超时时间（毫秒）。
  timeout: 60000, // default

  // 脚本属性
  scriptAttr: {
    type: "",
    charset: "",
    crossOrigin: null,
    async: true,
    defer: false
  },

  // 无痕请求（请求完成后脚本标记是否保留）。
  keepScriptTag: false,

  // callbackProp = "callback"
  // 当 callbackProp 存在时，如果请求加载完成则要调用的函数。
  callback: null,

  // callbackProp = false
  // 当callbackProp为false时，如果请求加载完成则要调用的函数。
  load: null,

  // 请求失败时要调用的函数。
  error: null,
  
  // 无论请求成功或者失败都调用都函数。
  complete: null
}
```

## License

MIT
