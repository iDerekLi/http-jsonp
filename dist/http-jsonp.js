/*!
 * httpJsonp v1.0.0
 * 
 * Copyright (c) 2019-present Derek Li
 * Released under the MIT License - https://choosealicense.com/licenses/mit/
 * 
 * https://github.com/iDerekLi/http-jsonp
 */
!function(e, n) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (e = e || self).httpJsonp = n();
}(this, function() {
    "use strict";
    function _extends() {
        return (_extends = Object.assign || function(e) {
            for (var n = 1; n < arguments.length; n++) {
                var r = arguments[n];
                for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o]);
            }
            return e;
        }).apply(this, arguments);
    }
    /**
   * deepMerge
   * @param target  {Object|Array}  merge target
   * @param objN    {Object|Array}  obj1, obj2, obj3...
   * @returns target
   */
    /*
  // example
  var obj = {};
  var obj1 = {
    str: "hello",
    o: { a: 2 },
    arr: [0],
    arr2: [{ a: 1 }]
  };
  var obj2 = {
    o: { a: 1, b: 2 },
    arr: [1, 2],
    arr2: [{ a: 1, b: 2 }],
    varUndefined: undefined,
    varNull: null,
    varNaN: NaN
  };
  console.log(deepMerge(obj, obj1, obj2));
  */    function deepMerge(e) {
        function assignItem(n, r) {
            if ("object" == typeof e[r] && "object" == typeof n) e[r] = deepMerge(e[r], n); else if ("object" == typeof n && null !== n) {
                var o = "[object Array]" === Object.prototype.toString.call(n) ? [] : {};
                e[r] = deepMerge(o, n);
            } else e[r] = n;
        }
        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) r[o - 1] = arguments[o];
        for (var t = 0, a = r.length; t < a; t++) for (var c in r[t]) assignItem(r[t][c], c);
        return e;
    }
    /**
   * 对象转url参数
   * @param data 格式化对象
   * @param prefix 前缀 ["?" | "&" | "" | true | false]
   * @returns {string}
   */    function includes(e, n) {
        for (var r in n) if (e === n[r]) return !0;
        return !1;
    }
    function queryParams(e, n) {
        void 0 === n && (n = ""), n = "boolean" == typeof n ? "?" : n;
        var r = [], o = function _loop(n) {
            var o = e[n];
 // 去掉为空的参数
                        if (includes(o, [ "", undefined, null ])) return "continue";
            o.constructor === Array ? o.forEach(function(e) {
                r.push(encodeURIComponent(n) + "[]=" + encodeURIComponent(e));
            }) : r.push(encodeURIComponent(n) + "=" + encodeURIComponent(o));
        };
        for (var t in e) o(t);
        return r.length ? n + r.join("&") : "";
    }
    var e = {
        baseURL: "",
        // 将被添加到`url`
        url: "",
        // 是将用于请求的服务器URL
        params: {},
        // 请求服务器url所带参数（包括callback行为）
        callbackProp: "callback",
        // 指定`params`中哪一个键是callback行为接口，（如果指定`params`中的键值存在则指定的值覆盖httpJsonp默认随机名称）
        prefix: "__httpJsonp",
        // callback名称的前缀
        name: "Callback",
        // callback名称，（callbackName=`prefix`+`name`+`随机数`）
        timeout: 6e4,
        // 指定请求超时之前的毫秒数。
        // 脚本属性参数
        scriptAttr: {
            type: "",
            charset: "",
            crossOrigin: null,
            async: !0,
            defer: !1
        },
        keepScriptTag: !1,
        // 请求完成时是否保留脚本标记
        callback: null,
        // 当callback被触发时要调用的函数。
        load: null,
        // 请求加载完成时调用的函数。
        error: null
    }, n = Date.now();
    /**
   * Callback nonce.
   */    
    /**
   * Noop function.
   */
    function noop() {}
    /**
   * Script event
   */    var r = function script_oncallback(e, n) {
        if (!n) return window[e];
        window[e] = n;
    }, o = function script_onload(e, n) {
        e.onload !== undefined ? e.onload = function() {
            n();
        } : e.onreadystatechange = function() {
            "loaded" != e.readyState && "complete" != e.readyState || (e.onreadystatechange = null, 
            n());
        };
    }, t = function script_onerror(e, n) {
        e.onerror = n;
    };
    /**
   * httpJsonp
   * @param options {Object}
   * @param [receive]
   * @returns {{cancel: cancel}}
   */
    function httpJsonp(a, c) {
        "string" == typeof a && (a = {
            url: a
        }), c || (c = {});
        var l, i, u = deepMerge({}, e, a || {}), p = _extends({
            callback: u.callback,
            load: u.load,
            error: u.error
        }, c), f = u.params, d = "", s = "", m = u.callbackProp;
        function cleanup() {
            u.keepScriptTag || l.parentNode && l.parentNode.removeChild(l), s && r(s, noop), 
            o(l, noop), t(l, noop), i && clearTimeout(i);
        }
        function cancel() {
            d = "cancel", r(s) && cleanup();
        }
        m && "" !== f[m] && (
        // create callback
        f[m] ? s = f[m] : (s = u.callbackName || u.prefix + u.name + n++, f[m] = s));
        var y = u.timeout;
        y && (i = setTimeout(function() {
            d = "error", cleanup(), p.error && p.error(new Error("Request Timeout"));
        }, y));
 // qs
                var b = u.baseURL + u.url;
        b = (b += queryParams(f, ~b.indexOf("?") ? "&" : "?")).replace("?&", "?"), // create script
        l = document.createElement("script");
        var g = u.scriptAttr;
        for (var v in delete g.text, delete g.src, g) l[v] = g[v];
        s && r(s, function(e) {
            d = "callback", p.callback && p.callback(e);
        }), o(l, function() {
            cleanup(), "error" !== d && (d = "load", p.load && p.load());
        }), t(l, function() {
            d = "error", cleanup(), p.error && p.error(new Error("script error"));
        }), l.src = b;
        var h = document.getElementsByTagName("script")[0] || document.head || document.getElementsByTagName("head")[0];
        return h.parentNode.insertBefore(l, h), {
            cancel: cancel
        };
    }
    return httpJsonp;
});
