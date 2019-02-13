/*!
 * httpJsonp v1.0.1
 * 
 * Copyright (c) 2019-present Derek Li
 * Released under the MIT License - https://choosealicense.com/licenses/mit/
 * 
 * https://github.com/iDerekLi/http-jsonp
 */
/* eslint-disable */
function _extends() {
    return (_extends = Object.assign || function(e) {
        for (var r = 1; r < arguments.length; r++) {
            var n = arguments[r];
            for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
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
*/ function deepMerge(e) {
    function assignItem(r, n) {
        if ("object" == typeof e[n] && "object" == typeof r) e[n] = deepMerge(e[n], r); else if ("object" == typeof r && null !== r) {
            var o = "[object Array]" === Object.prototype.toString.call(r) ? [] : {};
            e[n] = deepMerge(o, r);
        } else e[n] = r;
    }
    for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++) n[o - 1] = arguments[o];
    for (var t = 0, a = n.length; t < a; t++) for (var c in n[t]) assignItem(n[t][c], c);
    return e;
}

/**
 * 对象转url参数
 * @param data 格式化对象
 * @param prefix 前缀 ["?" | "&" | "" | true | false]
 * @returns {string}
 */ function includes(e, r) {
    for (var n in r) if (e === r[n]) return !0;
    return !1;
}

function queryParams(e, r) {
    void 0 === r && (r = ""), r = "boolean" == typeof r ? "?" : r;
    var n = [], o = function _loop(r) {
        var o = e[r];
 // 去掉为空的参数
                if (includes(o, [ "", undefined, null ])) return "continue";
        o.constructor === Array ? o.forEach(function(e) {
            n.push(encodeURIComponent(r) + "[]=" + encodeURIComponent(e));
        }) : n.push(encodeURIComponent(r) + "=" + encodeURIComponent(o));
    };
    for (var t in e) o(t);
    return n.length ? r + n.join("&") : "";
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
}, r = Date.now();

/**
 * Callback nonce.
 */
/**
 * Noop function.
 */
function noop() {}

/**
 * Script event
 */ var n = function script_oncallback(e, r) {
    if (!r) return window[e];
    window[e] = r;
}, o = function script_onload(e, r) {
    e.onload !== undefined ? e.onload = function() {
        r();
    } : e.onreadystatechange = function() {
        "loaded" != e.readyState && "complete" != e.readyState || (e.onreadystatechange = null, 
        r());
    };
}, t = function script_onerror(e, r) {
    e.onerror = r;
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
    }, c), d = u.params, s = "", f = "", m = u.callbackProp;
    function cleanup() {
        u.keepScriptTag || l.parentNode && l.parentNode.removeChild(l), f && n(f, noop), 
        o(l, noop), t(l, noop), i && clearTimeout(i);
    }
    function cancel() {
        s = "cancel", n(f) && cleanup();
    }
    m && "" !== d[m] && (
    // create callback
    d[m] ? f = d[m] : (f = u.callbackName || u.prefix + u.name + r++, d[m] = f));
    var b = u.timeout;
    b && (i = setTimeout(function() {
        s = "error", cleanup(), p.error && p.error(new Error("Request Timeout"));
    }, b));
 // qs
        var g = u.baseURL + u.url;
    g = (g += queryParams(d, ~g.indexOf("?") ? "&" : "?")).replace("?&", "?"), // create script
    l = document.createElement("script");
    var y = u.scriptAttr;
    for (var v in delete y.text, delete y.src, y) l[v] = y[v];
    f && n(f, function(e) {
        s = "callback", p.callback && p.callback(e);
    }), o(l, function() {
        cleanup(), "error" !== s && (s = "load", p.load && p.load());
    }), t(l, function() {
        s = "error", cleanup(), p.error && p.error(new Error("script error"));
    }), l.src = g;
    var h = document.getElementsByTagName("script")[0] || document.head || document.getElementsByTagName("head")[0];
    return h.parentNode.insertBefore(l, h), {
        cancel: cancel
    };
}

export default httpJsonp;
