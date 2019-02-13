// import rollup from "rollup";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import { eslint } from "rollup-plugin-eslint";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");

const banner = (function() {
  const row = [
    `httpJsonp v${pkg.version}`,
    "",
    "Copyright (c) 2019-present Derek Li",
    "Released under the MIT License - https://choosealicense.com/licenses/mit/",
    "",
    "https://github.com/iDerekLi/http-jsonp"
  ];
  return ["/*!", ...row.map(r => `* ${r}`), "*/"].join("\n ");
})();
function getBaseConfig() {
  const baseConfig = {
    input: "src/http-jsonp.js",
    plugins: [
      json(),
      resolve({
        jsnext: false, // 该属性是指定将Node包转换为ES2015模块
        // main 和 browser 属性将使插件决定将那些文件应用到bundle中
        main: true, // Default: true
        browser: true // Default: false
      }),
      commonjs(),
      eslint({
        include: "src/**",
        exclude: "node_modules/**",
        throwOnWarning: true
      }),
      babel({
        exclude: "node_modules/**"
      })
    ],
    watch: {
      include: "src/**",
      exclude: "node_modules/**"
    }
  };
  return baseConfig;
}

function TerserPlugin(minimizer) {
  return terser({
    ie8: true,
    keep_fnames: !minimizer, // 是否保持原变量名
    compress: {
      warnings: false,
      drop_console: false, // 删除所有的 `console` 语句，可以兼容ie浏览器
      reduce_vars: false // 内嵌定义了但是只用到一次的变量
    },
    output: {
      beautify: !minimizer, // 是否不进行压缩
      comments: minimizer ? /Copyright|Derek Li/ : true // 是否保留注释
    }
  });
}

export default ["http-jsonp", "http-jsonp.min", "http-jsonp.esm"].map(
  filename => {
    switch (filename) {
      case "http-jsonp": {
        const config = Object.assign(getBaseConfig(), {
          output: {
            format: "umd",
            name: "httpJsonp",
            file: "dist/http-jsonp.js",
            banner,
            indent: true
          }
        });
        config.plugins.push(TerserPlugin(false));
        return config;
      }
      case "http-jsonp.min": {
        const config = Object.assign(getBaseConfig(), {
          output: {
            format: "umd",
            name: "httpJsonp",
            file: "dist/http-jsonp.min.js",
            banner,
            indent: true
          }
        });
        config.plugins.push(TerserPlugin(true));
        return config;
      }
      case "http-jsonp.esm": {
        const config = Object.assign(getBaseConfig(), {
          output: {
            format: "es",
            file: "dist/http-jsonp.esm.js",
            banner: banner + "\n/* eslint-disable */",
            indent: true
          }
        });
        config.plugins.push(TerserPlugin(false));
        return config;
      }
    }
  }
);
