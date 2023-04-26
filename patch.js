'use strict';

const fs = require('fs');

const PJSonPath = 'dist/apps/server/package.json';
const rawPJson = fs.readFileSync(PJSonPath);
const PJson = JSON.parse(rawPJson);

PJson.scripts = {
  start: 'node main.js'
};

fs.writeFile(PJSonPath, JSON.stringify(PJson, undefined, 2), function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log(`Patching of file ${PJSonPath} is successfully done!`);
  }
});
