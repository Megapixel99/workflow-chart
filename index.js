#!/usr/bin/env node

const {drawer, organizer, parser} = require('./src');
const path = require('path');
const fs = require('fs');
let flow = [];

async function parseToFlow(file) {
  let subFlow = parser.parseFile(file);
  if (subFlow !== undefined) {
  flow.push(parser.parseFile(file));
  }
}

function traverseDir(p) {
  const dir = fs.opendirSync(p)
  let dirent;
while ((dirent = dir.readSync()) !== null) {
    if (fs.lstatSync(`${p}/${dirent.name}`).isDirectory()) {
    traverseDir(`${p}/${dirent.name}`);
    }else  if (fs.lstatSync(`${p}/${dirent.name}`).isFile() ) {
      parseToFlow(`${p}/${dirent.name}`);
    } else {
      if (!p.includes('node_modules/.bin')) {
      console.log(`${p}/${dirent.name} could not be resolved to a file or a directory, skipping file(s)`);
      }
    }
    }
  dir.closeSync()
}

function createFlow(options) {
  for (let i = 0; i < options.input.split(',').length; i++) {
    let p = path.resolve(options.input.split(',')[i]);
    if (p) {
        traverseDir(p);
    } else {
      throw(`${options.input} could not be resolved as a path, skipping file(s)`);
    }
  }
  let organizedFlow = organizer.organize(flow.flat());
  drawer.draw(organizedFlow.path, (organizedFlow.height*100), organizedFlow.width, organizedFlow.legend, path.resolve(`${options.output}/${options.filename}`));
}

module.exports = createFlow;
