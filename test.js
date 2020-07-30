var minifierJsFolder = require("./index"); // 或者 uglifyjs-impl，两者差别不大

var minifierCssFolder = require("./cleancss-impl"); // 或者uglifycss-impl

minifierJsFolder(__dirname + "/tmp", {
  each: true,
  comments: true,
  extension: ".js",
  patterns: ["**/*.js", "!**/*min.js"],
  configFile: "./terserConfig.json",
});

// minifierCssFolder(__dirname + "/source", {
//   each: true,
//   comments: true,
//   extension: ".css",
//   patterns: ["**/*.css", "!**/*min.css"],
//   configFile: "./cleancssConfig.json",
// });
