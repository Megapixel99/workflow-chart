const fs = require('fs');
const readline = require('readline');

function findValueByType(args, type) {
  return args.filter(element => element.type === type);
}

function findSingleValueByType(args, type) {
  let result = findValueByType(args, type);
  if (result.length > 0) {
  return result[0].value;
} else {
  return undefined;
}
}

function findByType(args, type) {
  return args.filter(element => element.type === type);
}

function saveToObj(args) {
  res = [];
  for (let i = 0; i < args.length; i++) {
let lType = findValueByType(args[i], "@flowLegend");
    if (lType.length > 0) {
      for (let j = 0; j < lType.length; j++) {
      res.push ({
        type: "legend",
        value: lType[j].value
      });
      }
    } else {
  let type = findSingleValueByType(args[i], "@flowType");
  if (type !== undefined) {
  res.push ({
    type: type,
    id: (findSingleValueByType(args[i], "@flowId")||type),
    previous: findSingleValueByType(args[i], "@flowPrevious"),
    title: (findSingleValueByType(args[i], "@flowTitle")||type),
    condition: findSingleValueByType(args[i], "@flowCondition"),
  });
}
  }
}
  return res;
}

   function parseFile(filePath) {
  let args = [];
  let data = fs.readFileSync(filePath, 'utf8');
  let matches = data.toString().match(/(\/\*)(.+?)(\*\/)/gs);
  if (matches !== null && matches.length > 0) {
    for (var j = 0; j < matches.length; j++) {
      let lines = matches[j].replace(/\r/g, '').split('\n');
      args[j] = [];
      for (var i = 0; i < lines.length; i++) {
        let line = lines[i].split(' ');
          let type = line[1];
        if (type !== undefined) {
          if (type === "@flowLegend") {
        args[j].push({
          type: type,
          value: `${line[2]}: ${line.slice(3).join(' ')}`
        });
          } else {
        args[j].push({
          type: type,
          value: line.slice(2).join(' ')
        });
          }
        }
      }
    }
  }
  if (args.length > 0) {
  return (saveToObj(args));
  }
}

module.exports.parseFile = parseFile;
