const { createCanvas, loadImage } = require('canvas')
var rgbaToHex = require('hex-and-rgba').rgbaToHex;
const fs = require('fs');
const boxWidth = 200;
const thickness = boxWidth/100;
const boxHeight = boxWidth/2;
const boxSpace = boxWidth/2;
const fontSize = boxWidth/6;

function wrapText(ctx, text, x, y, maxWidth){
  let firstY=y;
  let words = text.split(' ');
  let line = '';
  let lineHeight=fontSize*1.5;

  ctx.textBaseline='top';

  for(var n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if(testWidth > maxWidth) {
      ctx.fillText(line, x, y);
      if(n<words.length){
          line = words[n] + ' ';
          y += lineHeight;
      }
    }else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return (y + lineHeight);
}

function trimCanvas(canvas) {
let ctx = canvas.getContext('2d'),
        copy = createCanvas().getContext('2d');
        pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
        l = pixels.data.length,
        bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
        };

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % canvas.width;
            y = ~~((i / 4) / canvas.width);

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    // Calculate the height and width of the content
    let trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

        copy.canvas.width = trimWidth;
        copy.canvas.height = trimHeight;
        copy.putImageData(trimmed, 0, 0);

        // Return trimmed canvas
        return copy.canvas;
}

function setBg(type) {
  switch (type) {
    case "step":
      return rgbaToHex(255, 255, 0, 0.2);
    break;
    case "throws":
      return rgbaToHex(255, 0, 0, 0.2);
    break;
    case "condition":
      return rgbaToHex(255, 0, 255, 0.2);
    break;
    case "end":
    return rgbaToHex(0, 0, 255, 0.2);
    break;
    case "start":
    return rgbaToHex(0, 255, 0, 0.2);
    break;
    default:
      throw("Unkown Type")
  }
}

function calcHorizontalSpace(numBoxes) {
  let spaces = new Array(numBoxes);
  if (spaces.length % 2 === 0) {
    spaces[1] = 0
      spaces[2] = 1
      if (spaces.length === 3) {
        spaces[1] = 1.5;
          spaces[2] = 1.5
      }
  } else {
  spaces[1] = 0
    spaces[2] = 3
  }
for (var i = 3; i < spaces.length; i++) {
  spaces[i] = spaces[i - 1] + 3;
}
  spaces = spaces.filter(function () { return true });
  let rSpaces;
  if (spaces.length % 2 === 0) {
    rSpaces = [...spaces];
    rSpaces.shift();
  } else {
    spaces.shift();
    spaces = spaces.map( v => v+0.5 )
    rSpaces = [...spaces];
  }
  rSpaces.reverse();
  rSpaces = rSpaces.map( v => -v )
  spaces.unshift(rSpaces);
  return spaces.flat();
}

function canvasLine(context, fromx, fromy, tox, toy, dx = (tox - fromx), dy = (toy - fromy), headlen = 10) {
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
}

function canvasArrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  canvasLine(context, fromx, fromy, tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function drawContainers(xLoc, yLoc, bg, text, ctx, width = boxWidth, height = boxHeight) {
  ctx.rect(xLoc, yLoc + (boxSpace*2), width, height);
  ctx.fillStyle = bg;
  ctx.fillRect(xLoc, yLoc + (boxSpace*2), width, height);
  ctx.fillStyle = rgbaToHex(0, 0, 0, 1);
  ctx.fillText(text, xLoc + width/2 - thickness/2, yLoc + (boxSpace*2) + height/2 + thickness)
}

function alignContainers(info, xLoc, yLoc, ctx) {
  if (info) {
    if (info[0] && info[0].next) {
    info = info[0]
  }
      drawContainers(xLoc, yLoc, setBg(info.type), info.title, ctx);
      let xLocThick = xLoc - thickness/2;
      let yLocThick = yLoc + (boxSpace*2) - thickness/2;
      let arrowXLoc = xLocThick + boxWidth/2;
      let arrowYLoc = yLocThick + boxHeight;
      if (info.next.length === 1) {
      alignContainers(info.next, xLocThick, yLocThick, ctx)
      canvasArrow(ctx, arrowXLoc, arrowYLoc, arrowXLoc, arrowYLoc + boxSpace*3/4);
    } else {
      if (info.next.length !== 0) {
        let yPos2 = arrowYLoc + boxSpace*1/2;
        if (info.next.length % 2 === 1) {
          yPos2 = arrowYLoc + boxSpace*1/4
        }
        canvasLine(ctx, xLocThick + boxWidth/2, yLocThick + boxHeight, arrowXLoc, yPos2)
      }
      let spaces = calcHorizontalSpace(info.next.length);
      let lowestXPos =ctx.canvas.width;
      let highestXPos = 0;
      let infoBoxXs = [];
        for (let i = 0; i < info.next.length; i++) {
            xLocThick = xLoc + (boxSpace*spaces[i]) - thickness/2;
            yLocThick = yLoc + (boxSpace*2.5) - thickness/2;
            arrowXLoc = xLocThick + boxWidth/2;
            arrowYLoc = yLocThick + boxHeight + boxSpace;
            infoBoxXs.push(xLocThick + boxWidth/4)
            alignContainers(info.next[i], xLocThick, yLocThick, ctx)
            if (arrowXLoc < lowestXPos) {
              lowestXPos = arrowXLoc
            } else if (arrowXLoc > highestXPos) {
              highestXPos = arrowXLoc;
            }
      }
      if (lowestXPos !==ctx.canvas.width&&highestXPos !== 0) {
      for (let j = 0; j < infoBoxXs.length; j++) {
        drawContainers(infoBoxXs[j] - boxWidth/16, yLocThick - boxHeight*1.25, rgbaToHex(255,255,255,1), info.next[j].condition, ctx, boxWidth/1.5, boxHeight/1.5);
        let ypos = yLocThick + (boxSpace * 1.25);
        if (j < infoBoxXs.length - 1) {
        canvasLine(ctx, infoBoxXs[j] + boxWidth/1.65, yLocThick + boxSpace, infoBoxXs[j+1] - boxWidth/16, yLocThick + boxSpace)
        }
        canvasArrow(ctx, infoBoxXs[j] + boxWidth/4,yLocThick + (boxSpace * 1.4),infoBoxXs[j] + boxWidth/4,arrowYLoc - boxSpace*1/4)
      }
    }
    }
}
  return;
}

function drawLegend(legend, imgHeight, imgWidth) {
  let longestStr = 0;
  let strs = []
  for (let i = 0; i < legend.length; i++) {
    if (longestStr < legend[i].value.length) {
      longestStr = legend[i].value.length;
    }
  }
  let xSize = imgWidth/4;
  let ySize = imgHeight/4;
  let offset = (boxWidth/4 < boxHeight/4?boxWidth/4:boxHeight/4);
  let canvas = createCanvas(xSize+offset*2,ySize+offset*2)
  const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize*1.5}px Impact`
  ctx.fillStyle = rgbaToHex(0, 0, 0, 1);
  ctx.fillText("Legend", xSize/2-fontSize*2.5+offset, fontSize*1.5+offset )
  let lineY = fontSize*2.25 + offset;
  canvasLine(ctx, offset, lineY, xSize + offset, lineY)
    ctx.font = `${fontSize}px Impact`
    for (let i = 0; i < legend.length; i++) {
      ySize = wrapText(ctx,legend[i].value, offset *1.5,(fontSize*1.25*i)+(offset*1.5)+lineY, xSize+offset-(offset *1.5))
    }
    ctx.fillStyle = rgbaToHex(0, 0, 0, 1);
    ctx.lineWidth = thickness;
    ctx.rect(offset, offset, xSize,ySize);
  ctx.stroke()
  return canvas
}

function drawChart(info, height, width) {
  const canvas = createCanvas(width,height)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = setBg(info.type);
  let startXpos = width/2 - boxWidth/2 - thickness/2;
  let startYpos = boxHeight - thickness/2;
  ctx.fillRect(startXpos, startYpos, boxWidth, boxHeight);
  ctx.rect(startXpos, startYpos, boxWidth, boxHeight);
  ctx.lineWidth = thickness;
  ctx.strokeStyle = 'black';

  ctx.font = `${fontSize}px Impact`
  ctx.textAlign = 'center';
  ctx.fillStyle = rgbaToHex(0, 0, 0, 1);
  ctx.fillText(info.title, width/2 - thickness/2, boxHeight + boxHeight/2)
  let arrowXLoc = startXpos + boxWidth/2;
  let arrowYLoc = startYpos + boxHeight;

  canvasArrow(ctx, arrowXLoc, arrowYLoc, arrowXLoc, arrowYLoc + boxSpace*3/4);

  alignContainers(info.next, width/2 - boxWidth/2, boxHeight, ctx);
  ctx.stroke()
  return trimCanvas(canvas);
}

function drawImage(info, height, width, legend, fileLoc = './flow.png') {
  height += boxHeight * height/100
  width += boxWidth * width/100
  let chartCanvas = drawChart(info, height, width);
  width = chartCanvas.width + boxWidth
  let canvas = createCanvas(width,height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  let legendCanvas = drawLegend(legend, height, width);
  let drawRight = true;
  for (let w = 0; w < legendCanvas.width; w++) {
    for (let h = 0; h < legendCanvas.height; h++) {
      let p = ctx.getImageData(w, h, 1, 1).data
      if (p[0] === 255&&p[1] === 255 && p[2] === 255) {
        drawRight = false;
      }
    }
  }
  if (drawRight) {
    ctx.drawImage(legendCanvas, 0, 0);
} else {
  ctx.drawImage(legendCanvas, canvas.width - legendCanvas.width, 0);
}
ctx.drawImage(chartCanvas, Math.abs((width/2) - (chartCanvas.width/2)), Math.abs((height/2) - (chartCanvas.height/2)));
  fs.writeFileSync(fileLoc, canvas.toBuffer())
  console.log(`Successfully saved file to: ${fileLoc}` );
}

module.exports.draw = drawImage;
