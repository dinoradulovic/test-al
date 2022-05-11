import path from 'path';
import fs from 'fs';

// Normalize a port into a number, string, or false. From Express Generator. 
export function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


export function findNestedFiles(startPath, filter, callback) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);

  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      findNestedFiles(filename, filter, callback); //recurse
    }
    else if (filter.test(filename)) callback(filename);
  };
};

