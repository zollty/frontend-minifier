"use strict";

var globby = require("globby");
var path = require("path");
var extend = require("extend");
var fs = require("graceful-fs");
var mkdirp = require("mkdirp");

var defaultOptions = {
  comments: true,
  output: "",
  each: false,
  extension: ".min.css",
  patterns: ["**/*.css"],
  configFile: null,
  callback: null,
  logLevel: "info",
};

module.exports = function (dirPath, options) {
  options = extend({}, defaultOptions, options);

  // npm install uglifycss -g
  var minifier = require("uglifycss");
  var state = {
    processCounter: 0,
    logLevel: options.logLevel,
    callback: options.callback,
  };

  var uglifyConfiguration = options.configFile
    ? require(path.resolve(options.configFile))
    : {};

  // grab and minify all the js files
  var files = globby.sync(options.patterns, {
    cwd: dirPath,
  });

  console.log("found files: ");
  files.forEach(function (fileName) {
    console.log(fileName);
  });

  if (options.each) {
    // minify each file individually
    files.forEach(function (fileName) {
      options.output = isEmpty(options.output) ? "_out_" : options.output;
      var newName =
        path.join(
          options.output,
          path.dirname(fileName),
          path.basename(fileName, path.extname(fileName))
        ) + options.extension;
      var originalCode = {};
      originalCode[fileName] = readFile(path.join(dirPath, fileName));

      var minifyResult = minifier.processString(
        originalCode[fileName],
        getUglifyOptions(newName, uglifyConfiguration)
      );

      // if (minifyResult.error) {
      //   console.error(minifyResult.error);
      //   throw minifyResult.error;
      // }

      writeFile(newName, minifyResult, state);
    });
  } else {
    // concatenate all the files into one
    var originalCode = {};

    files.forEach(function (fileName) {
      var source = readFile(path.join(dirPath, fileName));

      if (options.comments) {
        source = "/**** " + fileName + " ****/\n" + source;
      }
      originalCode[fileName] = source;
    });

    var uglifyOptions = getUglifyOptions(options.output, uglifyConfiguration);

    if (options.comments) {
      uglifyOptions.output = uglifyOptions.output || {};
      uglifyOptions.output.comments =
        uglifyOptions.output.comments || "/\\*{2}/";
    }

    var minifyResult = minifier.minify(originalCode, uglifyOptions);

    // if (minifyResult.error) {
    //   console.error(minifyResult.error);
    //   throw minifyResult.error;
    // }

    if (isEmpty(options.output)) {
      if (state.callback) {
        state.callback();
      }
      return minifyResult;
    } else {
      writeFile(options.output, minifyResult, state);
    }
  }
};

/**
 * Processes the uglifyjs options
 * @param  {String} fileName
 * @param  {Object} uglifyConfiguration
 * @return {Object}
 */
function getUglifyOptions(fileName, uglifyConfiguration) {
  fileName = path.basename(fileName);
  var uglifyOptions = JSON.parse(JSON.stringify(uglifyConfiguration));

  return uglifyOptions;
}

/**
 * Checks if the provided parameter is not an empty string.
 */
function isEmpty(str) {
  if (typeof str != "string" || str.trim() == "") {
    return true;
  }
  return false;
}

function readFile(path) {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch (e) {
    console.error("UGLIFYJS FOLDER ERROR: ", path, "was not found !");
    return "";
  }
}

/**
 * Writes the code at the specified path.
 */
function writeFile(filePath, code, state) {
  state.processCounter++;
  mkdirp(path.dirname(filePath))
    .then(function () {
      fs.writeFile(filePath, code, function (err) {
        state.processCounter--;
        if (state.callback && state.processCounter === 0) {
          state.callback();
        }
        if (err) {
          console.error("Error: " + err);
          return;
        }
        if (state.logLevel == "info") {
          console.info("File " + filePath + " written successfully !");
        }
      });
    })
    .catch(function (err) {
      state.processCounter--;
      if (state.callback && state.processCounter === 0) {
        state.callback();
      }

      console.error("Error: " + err);
    });
}
