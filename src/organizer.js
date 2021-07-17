function buildPath(flow, path = {}, height = 1, width = 300) {
  let res = [];
  let legend = [];
  if (Object.keys(path).length === 0) {
   path = flow.filter(x => x.type === 'start')[0];
   legend = flow.filter(x => x.type === 'legend');
  }
  if (path === undefined) {
    throw ('flow start not found')
  }
  path.next = [];
  let next = flow.filter(x => x.previous === path.id);
  width += (next.length - 1 ) > 0 ? (next.length - 1 ) * 225: 0;
  for (let j = 0; j < next.length; j++) {
      let nextPath = buildPath(flow, next[j],height, width);
    path.next.push(nextPath.path);
    path.next.flat()
    width = nextPath.width
    height = nextPath.height
    if (path.next.length > 0) {
    height+=(1/path.next.length);
    }
  }
  return {path, height, width, legend};
}

function organize(flow) {
  flow.forEach((i) => {
    if (flow.filter(x => x.id === i.id).length > 2) {
      throw(`id: '${i.id}' is used more than once, please use unique ids`);
    }
    if (flow.filter(x => x.id === i.previous).length < 1 && !(i.previous === undefined && i.type === 'start')) {
      throw(`id: '${i.previous}' was not defined as an id`);
    }
  });
  return (buildPath(flow));
}


module.exports.organize = organize;
