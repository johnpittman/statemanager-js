'use strict'

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jasmine = require('gulp-jasmine');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var prompt = require('gulp-prompt');
var recursiveread = require('recursive-readdir');
var beautify = require('gulp-beautify');

var fs = require('fs');
var path = require('path');

/**
 * Setup
 */

// File paths.
var JS_SRC = 'src/**/*.js';
var MAP_DIST = 'dist/**/*.map';
var DIST = 'dist/';
var SRC = 'src/';
var SPECS = 'test/*Spec.js';
var PACKAGE_CONFIGS = '*.json';

// Cross task variables.
var bumpType;

/**
 * Tasks
 */

gulp.task('default', []);
gulp.task('test', ['unitSpecs']);
gulp.task('build', ['updateSourceMapPaths']);
gulp.task('deploy', ['bumpVersion']);

/**
 * Deploy
 */

// Run all units tests.
gulp.task('bumpVersion', ['build'], function(cb) {
    gulp.src('package.json')
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'bump',
            message: 'What type of bump would you like to do? (None)',
            choices: ['patch', 'minor', 'major', '1.0.0'],
        }, function(res) {
            //value is in res.bump (as an array)
            bumpType = res.bump[0];
            // Bump version of package.json and bower.json only
            var files = fs.readdirSync('./');
            for (var i = 0; i < files.length; i++) {
                var fileName = files[i];
                if (fileName === 'package.json' ||
                    fileName === 'bower.json') {
                    var buff = JSON.parse(fs.readFileSync(fileName));
                    var versionTypeValues = buff.version.split('-')[0].split('.');

                    if (bumpType === 'patch') {
                        var versionTypeNum = parseInt(versionTypeValues[2]);
                        ++versionTypeNum;
                        versionTypeValues[2] = versionTypeNum;
                        if (versionTypeNum > 9) {
                            versionTypeValues[2] = 0;
                            var minorVersion = ++versionTypeValues[1];
                            if (minorVersion > 9) {
                                versionTypeValues[1] = 0;
                                ++versionTypeValues[0];
                            }
                        }
                    } else if (bumpType === 'minor') {
                        var versionTypeNum = parseInt(versionTypeValues[1]);
                        ++versionTypeNum;
                        versionTypeValues[1] = versionTypeNum;
                        if (versionTypeNum > 9) {
                            versionTypeValues[1] = 0;
                            ++versionTypeValues[0];
                        }
                        versionTypeValues[2] = 0; // Reset patch version.
                    } else if (bumpType === 'major') {
                        var versionTypeNum = parseInt(versionTypeValues[0]);
                        versionTypeValues[0] = ++versionTypeNum;
                        versionTypeValues[1] = 0; // Reset minor version.
                        versionTypeValues[2] = 0; // Reset patch version.
                    } else if (bumpType === '1.0.0') {
                        versionTypeValues[0] = 1;
                        versionTypeValues[1] = 0;
                        versionTypeValues[2] = 0;
                    }

                    var versionStr = versionTypeValues.join('.');

                    // Write the new version to .json.
                    buff.version = versionStr;
                    buff = JSON.stringify(buff);
                    fs.writeFileSync(fileName, buff);
                }
            }
        }))
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'bump',
            message: 'Is this an Alpha or Beta release? (No)',
            choices: ['alpha', 'beta'],
        }, function(res) {
            //value is in res.bump (as an array)
            bumpType = res.bump[0];
            // Bump version of package.json and bower.json only
            var files = fs.readdirSync('./');
            for (var i = 0; i < files.length; i++) {
                var fileName = files[i];
                if (fileName === 'package.json' ||
                    fileName === 'bower.json') {
                    var buff = JSON.parse(fs.readFileSync(fileName));

                    if (bumpType === 'alpha' || bumpType === 'beta') {
                        buff.version += '-' + bumpType;
                    }

                    console.log(fileName + ' - version: ' + buff.version);

                    // Write the new version to .json.
                    buff = JSON.stringify(buff);
                    fs.writeFileSync(fileName, buff);
                }

                // Reformat the new files back to easily readable.
                gulp.src(PACKAGE_CONFIGS)
                    .pipe(beautify())
                    .pipe(gulp.dest('./'));
            }
        }));

    return cb();
});

/**
 * Test
 */

// Run all units tests.
gulp.task('unitSpecs', function() {
    return gulp.src(SPECS)
        .pipe(jasmine());
});

/**
 * Build
 */

// Clear the distribution directory in case files/folders were removed from last build.
gulp.task('cleanDist', ['test'], function() {
    return gulp.src(DIST, {
            read: false
        })
        .pipe(clean())
        .pipe(gulp.dest('./'));
});

// Minify JS with source maps and generate source maps.
gulp.task('compress', ['cleanDist'], function() {
    return gulp.src(JS_SRC)
        .pipe(rename(function(path) {
            path.extname = '.min.js'
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./', {
            sourceRoot: '../src'
        }))
        .pipe(gulp.dest(DIST));
});

// Rename .min.js.map files to .min.map.
gulp.task('renameSourceMaps', ['compress'], function() {
    return gulp.src(MAP_DIST)
        .pipe(rename(function(path) {
            path.basename = path.basename.split('.')[0],
                path.extname = '.min.map'
        }))
        .pipe(gulp.dest(DIST));
});

// Clean up .min.js.map files.
gulp.task('cleanSourceMaps', ['renameSourceMaps'], function() {
    return gulp.src(DIST + '*.min.js.map', {
            read: false
        })
        .pipe(clean())
        .pipe(gulp.dest(DIST));
});

// Fixes sourcemap linking. 
gulp.task('updateSourceMapPaths', ['cleanSourceMaps'], function(cb) {
    recursiveread('./dist/', ['node_modules', 'bower_components', '.git'], function(err, files) {
        for (var i = 0; i < files.length; i++) {
            var filePath = files[i];
            // Grab map file to alter.
            if (filePath.indexOf('.min.map') !== -1) {
                // Read file.
                var buff = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                // Clear invlaid sources.
                var sources = buff['sources'] = [];
                // Get the file name.
                // Keep relative path for nested files in src/
                // Rip off dist/
                var fileName = filePath.split('\\');
                fileName.shift();
                fileName = fileName.join('\\');
                fileName = fileName.split('.');
                fileName = fileName[0];
                // Make file type js
                fileName += '.js';
                // Add the source file to the map sources.
                sources.push(fileName);
                // Back to JSON
                buff = JSON.stringify(buff);
                // Write the new .map file.
                fs.writeFile(filePath, buff);
            }

            // Grab minified js file to change .map link path.
            if (filePath.indexOf('.min.js') !== -1) {
                // Read file.
                var buff = fs.readFileSync(filePath, 'utf8').toString();
                // Get file name
                var sourceMappingKey = '//# sourceMappingURL=';
                var filePathIndex = buff.indexOf(sourceMappingKey);
                if (filePathIndex !== -1) {
                    var currSourceFileName = buff.substring(filePathIndex + sourceMappingKey.length, buff.length);
                    var buff = buff.substring(0, filePathIndex + sourceMappingKey.length);
                    // Take out .js.
                    currSourceFileName = currSourceFileName.split('.');
                    currSourceFileName.splice(2, 1);
                    currSourceFileName = currSourceFileName.join('.');
                    // Update file with new path.
                    buff += currSourceFileName;
                    // Write the new .js file.
                    fs.writeFile(filePath, buff);
                }
            }
        }
    });

    return cb();
});
