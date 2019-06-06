/*!
 * httpJsonp v1.1.1
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
            var t = arguments[r];
            for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        }
        return e;
    }).apply(this, arguments);
}

var e = "1.1.1";

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
    function assignItem(r, t) {
        if ("object" == typeof e[t] && "object" == typeof r) e[t] = deepMerge(e[t], r); else if ("object" == typeof r && null !== r) {
            var n = "[object Array]" === Object.prototype.toString.call(r) ? [] : {};
            e[t] = deepMerge(n, r);
        } else e[t] = r;
    }
    for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++) t[n - 1] = arguments[n];
    for (var o = 0, a = t.length; o < a; o++) for (var c in t[o]) assignItem(t[o][c], c);
    return e;
}

/**
 * treeAttribute
 * @param obj
 * @param attrPath
 * @param value
 * @returns {*}
 */ function treeAttribute(e, r, t) {
    if ("object" != typeof e || null === e) throw Error("obj is not an Object type");
    if (!r) return e;
    var n = "string" == typeof r ? r.split(".") : r, o = n.length, a = n.shift();
    if ("string" != typeof a || "" === a) throw Error("error attribute path");
    return o > 1 ? treeAttribute(e[a], n, t) : t !== undefined ? e[a] = t : e[a];
}

/**
 * 对象转url参数
 * @param data 格式化对象
 * @param prefix 前缀 ["?" | "&" | "" | true | false]
 * @returns {string}
 */ function includes(e, r) {
    for (var t in r) if (e === r[t]) return !0;
    return !1;
}

function queryParams(e, r) {
    void 0 === r && (r = ""), r = "boolean" == typeof r ? "?" : r;
    var t = [], n = function _loop(r) {
        var n = e[r];
 // 去掉为空的参数
                if (includes(n, [ "", undefined, null ])) return "continue";
        n.constructor === Array ? n.forEach(function(e) {
            t.push(encodeURIComponent(r) + "[]=" + encodeURIComponent(e));
        }) : t.push(encodeURIComponent(r) + "=" + encodeURIComponent(n));
    };
    for (var o in e) n(o);
    return t.length ? r + t.join("&") : "";
}

var r = {
    baseURL: "",
    // 将被添加到`url`
    url: "",
    // 是将用于请求的服务器URL
    params: {},
    // 请求服务器url所带参数（包括callback行为）
    callbackProp: !1,
    // [false | callbackProp], 当为false时只作为脚本请求 // 指定`params`中哪一个键是callback行为接口，（如果指定`params`中的键值存在则指定的值覆盖httpJsonp默认随机名称）
    callbackNamespase: "__httpJsonpCallback",
    // window.callbackNamespase
    callbackName: "",
    // callback名称，（callbackName=jp随机数）
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
    error: null,
    // 请求失败时调用的函数。
    complete: null,
    // 无论请求成功或失败均调用
    then: null,
    "catch": null,
    "finally": null
}, t = Date.now();

/**
 * Callback nonce.
 */
/**
 * Noop function.
 */
function noop() {}

/**
 * Script event
 */ var n = function script_oncallback(e, r, t) {
    var n = treeAttribute(window, e);
    if (n = e && !n ? treeAttribute(window, e, {}) : n || window, !t) return n[r];
    n[r] = t;
}, o = function script_onload(e, r) {
    e.onload !== undefined ? e.onload = function() {
        r();
    } : e.onreadystatechange = function() {
        "loaded" != e.readyState && "complete" != e.readyState || (e.onreadystatechange = null, 
        r());
    };
}, a = function script_onerror(e, r) {
    e.onerror = r;
};

/**
 * httpJsonp
 * @param options {Object}
 * @param [receive]
 * @returns {{cancel: cancel}}
 */
function httpJsonp(e, c) {
    "string" == typeof e && (e = {
        url: e
    }), c || (c = {});
    var l, i, p = deepMerge({}, r, e || {}), u = _extends({
        callback: p.callback,
        load: p.load,
        error: p.error,
        complete: p.complete
    }, c), s = p.params, f = "", d = "", m = p.callbackNamespase, b = p.callbackProp;
    function cleanup() {
        p.keepScriptTag || l.parentNode && l.parentNode.removeChild(l), d && n(m, d, noop), 
        o(l, noop), a(l, noop), i && clearTimeout(i);
    }
    function cancel() {
        f = "cancel", n(m, d) && cleanup();
    }
    b && "" !== s[b] && (
    // create callback
    d = s[b] ? s[b] : p.callbackName || "jp" + t++, s[b] = m ? m + "." + d : d);
    var y = p.timeout;
    y && (i = setTimeout(function() {
        f = "error", cleanup(), u.error && u.error(new Error("Request Timeout")), u.complete && u.complete();
    }, y));
 // qs
        var h = p.baseURL + p.url;
    h = (h += queryParams(s, ~h.indexOf("?") ? "&" : "?")).replace("?&", "?"), // create script
    l = document.createElement("script");
    var g = p.scriptAttr;
    for (var v in delete g.text, delete g.src, g) l[v] = g[v];
    d ? n(m, d, function(e) {
        cleanup(), "error" !== f && (f = "callback", u.callback && u.callback(e), u.complete && u.complete());
    }) : o(l, function() {
        cleanup(), "error" !== f && (f = "load", u.load && u.load(), u.complete && u.complete());
    }), a(l, function() {
        f = "error", cleanup(), u.error && u.error(new Error("script error")), u.complete && u.complete();
    }), l.src = h;
    var k = document.getElementsByTagName("script")[0] || document.head || document.getElementsByTagName("head")[0];
    return k.parentNode.insertBefore(l, k), {
        cancel: cancel
    };
}

httpJsonp.version = e;

export default httpJsonp;
