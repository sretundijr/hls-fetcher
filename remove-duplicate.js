var fs = require('fs');
var path = require('path');
var m3u = require('m3u8-reader');
var rimraf = require('rimraf');

function removeDuplicatedDirectories(cwd, playlistFilename) {
  // since top level manifest name remains the same on duplicate 
  // download I can grab the duplicate
  // directory names from the previously written manifest before the manifest is 
  // updated
  var manifestPath = path.resolve(cwd, playlistFilename);
  // parse manifest to grab old directory names, returns array
  var parsedManifest = m3u(fs.readFileSync(manifestPath, 'utf8'));

  var duplicateSubDir = parsedManifest.filter(function (item) {
    return typeof (item) === 'string';
  });

  duplicateSubDir.forEach(function (duplicate) {
    var subDir = duplicate.substring(0, duplicate.indexOf('/'));
    var duplicatePath = path.resolve(cwd, subDir);
    if (duplicatePath != '/' && cwd != duplicatePath) {
      rimraf(duplicatePath, function () { console.log('removed duplicates'); });
    }
  });
}

module.exports = removeDuplicatedDirectories;
