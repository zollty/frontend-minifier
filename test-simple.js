var fs = require("fs");
var UglifyJS = require("uglify-js");

scanDir("./js");

function scanDir(rootPath) {
  //读取目录
  fs.readdir(rootPath, function (dirErr, files) {
    if (!dirErr) {
      files.forEach(function (fileName) {
        //当前文件路径
        var tmpPath = rootPath + "/" + fileName;
        //获取文件状态
        fs.stat(tmpPath, function (statErr, stat) {
          if (statErr) {
            console.log("stat error:" + statErr);
          }
          //是个目录
          else if (stat.isDirectory()) {
            console.log("scan dir " + fileName);
            scanDir(tmpPath);
          } else {
            console.log("--- file " + fileName);
            //是js文件
            if (fileName.match(/.*\.js$/i)) {
              compressFile(tmpPath);
            } else {
              console.log("not js file " + fileName);
            }
          }
        });
      });
    } else console.log("dir error");
  });
}
function compressFile(path) {
  //console.log("--- build file " + path);
  buildOne(path, path);
}
function buildOne(flieIn, fileOut) {
  var origCode = fs.readFileSync(flieIn, "utf8");
  var result = UglifyJS.minify({ flieIn: origCode });
  if (result.error) throw result.error;
  if (result.warnings) console.log(result.warnings);
  console.log("compressed:" + fileOut);
  fs.writeFileSync(fileOut, result.code, "utf8");
}
