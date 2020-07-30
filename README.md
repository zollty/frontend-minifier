# frontend-minifier

Run css js minifier on a folder and minify the result in a single file or folder.    
Uses uglifyjs or [terser](https://www.npmjs.com/package/terser) package to perform the js minification.    
Use uglify-css or clean-css to perform the css minification.    
Use the [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser) to perform the html minification.    
and image compression will be coming soon.    


## Getting Started
Install the module with: `npm install`    
modify `test.js` and run `npm run test`


## Documentation
    Usage
      fmini path [options]

    options:
      -c --comments      Add a comment with the file name.
      -o --output        Specify a file/folder to write the minified code
      -e --each          Minify each file independently
      -x --extension     Minified file extension (default: .min.js)
      -p --pattern       Specifies a comma separated glob patterns for the file selections. Default: **/*.js
         --pseparator    Specifies the separator for the pattern input. Default: ,
         --version       Prints the current version from package.json
         --config-file   Specifies a json configuration file for the terser module
         --log-level     Specifies the log level used when processing the files. Default: info
      -h --help          Print this list and exit.
## Examples
    $ fmini test-folder
    $ fmini test-folder --comments
    $ fmini test-folder -o all.min.js
    $ fmini test-folder --output all.min.js --pattern "**/*.js,!**/*min.js" # ignore minified files 
    $ fmini test-folder -eo newFolder
    $ fmini test-folder -eo newFolder --log-level error
    $ fmini test-folder-es6 -o newFolder
    $ fmini test-folder -e -x .js -o test-folder # careful: overwrite all files in test-folder
    $ fmini test-folder --config-file "./uglify.json"
    where uglify.json contains
    {
      "keep_fnames": true
    }

## Contributing
Pull requests are appreciated.


## License
Licensed under the MIT license.
