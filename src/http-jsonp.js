import { version } from "../package.json";
import { deepMerge, treeAttribute, queryParams } from "./utils";

const DEFAULT_OPTS = {
  baseURL: "", // 将被添加到`url`
  url: "", // 是将用于请求的服务器URL
  params: {}, // 请求服务器url所带参数（包括callback行为）
  callbackProp: false, // [false | callbackProp], 当为false时只作为脚本请求 // 指定`params`中哪一个键是callback行为接口，（如果指定`params`中的键值存在则指定的值覆盖httpJsonp默认随机名称）
  callbackNamespase: "__httpJsonpCallback", // window.callbackNamespase
  callbackName: "", // callback名称，（callbackName=jp随机数）
  timeout: 60000, // 指定请求超时之前的毫秒数。
  // 脚本属性参数
  scriptAttr: {
    type: "",
    charset: "",
    crossOrigin: null,
    async: true,
    defer: false
  },
  keepScriptTag: false, // 请求完成时是否保留脚本标记
  callback: null, // 当callback被触发时要调用的函数。
  load: null, // 请求加载完成时调用的函数。
  error: null, // 请求失败时调用的函数。
  complete: null, // 无论请求成功或失败均调用
  then: null,
  catch: null,
  finally: null
};

/**
 * Callback nonce.
 */
let nonce = Date.now();

/**
 * Noop function.
 */
function noop() {}

/**
 * Script event
 */
const script_oncallback = function(namespase, funName, cb) {
  let target = treeAttribute(window, namespase);
  if (!!namespase && !target) {
    target = treeAttribute(window, namespase, {});
  } else {
    target = target || window;
  }
  if (!cb) return target[funName];
  target[funName] = cb;
};
const script_onload = function(script, cb) {
  if (script.onload !== undefined) {
    script.onload = function() {
      cb();
    };
  } else {
    script.onreadystatechange = function() {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        cb();
      }
    };
  }
};
const script_onerror = function(script, cb) {
  script.onerror = cb;
};

/**
 * httpJsonp
 * @param options {Object}
 * @param [receive]
 * @returns {{cancel: cancel}}
 */
function httpJsonp(options, receive) {
  if (typeof options === "string") options = { url: options };
  if (!receive) receive = {};

  const opts = deepMerge({}, DEFAULT_OPTS, options || {});

  const rec = {
    callback: opts.callback,
    load: opts.load,
    error: opts.error,
    complete: opts.complete,
    ...receive
  };
  let params = opts.params;

  let state = "";

  let callbackName = "";
  const callbackNamespase = opts.callbackNamespase;
  const callbackProp = opts.callbackProp;
  if (!!callbackProp && params[callbackProp] !== "") {
    // create callback
    if (!params[callbackProp]) {
      callbackName = opts.callbackName || "jp" + nonce++;
    } else {
      callbackName = params[callbackProp];
    }
    params[callbackProp] = !!callbackNamespase
      ? `${callbackNamespase}.${callbackName}`
      : callbackName;
  }

  let script;
  let timer;

  function cleanup() {
    if (!opts.keepScriptTag) {
      if (script.parentNode) script.parentNode.removeChild(script);
    }
    if (callbackName) script_oncallback(callbackNamespase, callbackName, noop);
    script_onload(script, noop);
    script_onerror(script, noop);
    if (timer) clearTimeout(timer);
  }

  function cancel() {
    state = "cancel";
    if (script_oncallback(callbackNamespase, callbackName)) cleanup();
  }

  const timeout = opts.timeout;
  if (timeout) {
    timer = setTimeout(function() {
      state = "error";
      cleanup();
      rec.error && rec.error(new Error("Request Timeout"));
      rec.complete && rec.complete();
    }, timeout);
  }

  // qs
  let _url = opts.baseURL + opts.url;
  _url += queryParams(params, ~_url.indexOf("?") ? "&" : "?");
  _url = _url.replace("?&", "?");

  // create script
  script = document.createElement("script");
  let scriptAttr = opts.scriptAttr;
  delete scriptAttr.text;
  delete scriptAttr.src;
  for (let key in scriptAttr) {
    script[key] = scriptAttr[key];
  }

  if (callbackName) {
    script_oncallback(callbackNamespase, callbackName, function(data) {
      cleanup();
      if (state !== "error") {
        state = "callback";
        rec.callback && rec.callback(data);
        rec.complete && rec.complete();
      }
    });
  } else {
    script_onload(script, function() {
      cleanup();
      if (state !== "error") {
        state = "load";
        rec.load && rec.load();
        rec.complete && rec.complete();
      }
    });
  }
  script_onerror(script, function() {
    state = "error";
    cleanup();
    rec.error && rec.error(new Error("script error"));
    rec.complete && rec.complete();
  });

  script.src = _url;

  const target =
    document.getElementsByTagName("script")[0] ||
    document.head ||
    document.getElementsByTagName("head")[0];
  target.parentNode.insertBefore(script, target);

  return {
    cancel
  };
}

httpJsonp.version = version;

export default httpJsonp;
