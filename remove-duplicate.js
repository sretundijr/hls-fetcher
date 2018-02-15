var fs = require('fs');
var path = require('path');
var m3u = require('m3u8-reader');
var rimraf = require('rimraf');

// this code executes when a user downloads the same stream twice
// prior to this update the second download would update the manifest to point
// to the new subdir, but the old subdir would remain. this code removes those
// old subdir's 
function removeDuplicatedDirectories(cwd, playlistFilename) {
  // since top level manifest name remains the same on duplicate 
  // download I can grab the duplicate
  // directory names from the previously written manifest before the manifest is 
  // updated
  var manifestPath = path.resolve(cwd, playlistFilename);
  // parse manifest to grab old directory names, returns array
  var parsedManifest = m3u(fs.readFileSync(manifestPath, 'utf8'));

  // parsed manifest contains objects and strings, playlist.m3u8 files are stored as 
  // strings
  var duplicateSubDir = parsedManifest.filter(function (item) {
    return typeof (item) === 'string';
  });

  duplicateSubDir.forEach(function (duplicate) {

    if (path.extname(duplicate) === '.ts' && fs.existsSync(path.resolve(cwd, duplicate))) {
      fs.unlinkSync(path.resolve(cwd, duplicate));
    } else {
      // remove playlist.m3u8 portion to expose only dir name
      var subDir = duplicate.substring(0, duplicate.indexOf('/'));
      var duplicatePath = path.resolve(cwd, subDir);
      // is the first part of conditional && needed?
      if (duplicatePath != '/' && cwd != duplicatePath) {
        rimraf(duplicatePath, function () { console.log('removed duplicates'); });
      }
    }
  });
}

module.exports = removeDuplicatedDirectories;
