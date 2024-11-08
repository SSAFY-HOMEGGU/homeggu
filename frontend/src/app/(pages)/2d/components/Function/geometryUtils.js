// TRY MATRIX CALC FOR BBOX REAL COORDS WITH TRAS + ROT.
function matrixCalc(el, message = false) {
  if (message) console.log("matrixCalc called by -> " + message);
  let m = el.getCTM();
  let bb = el.getBBox();
  let tpts = [
      matrixXY(m, bb.x, bb.y),
      matrixXY(m, bb.x + bb.width, bb.y),
      matrixXY(m, bb.x + bb.width, bb.y + bb.height),
      matrixXY(m, bb.x, bb.y + bb.height)];
  return tpts;
}

function matrixXY(m, x, y) {
  return { x: x * m.a + y * m.c + m.e, y: x * m.b + y * m.d + m.f };
}

function realBboxShow(coords) {
  for (let k in coords) {
      debugPoint(coords[k]);
  }
}


function limitObj(equation, size, coords, message = false) {
  if (message) {
      console.log(message);
  }
  let Px = coords.x;
  let Py = coords.y;
  let Aq = equation.A;
  let Bq = equation.B;
  let pos1, pos2;
  if (Aq === 'v') {
      pos1 = { x: Px, y: Py - size / 2 };
      pos2 = { x: Px, y: Py + size / 2 };
  } else if (Aq === 'h') {
      pos1 = { x: Px - size / 2, y: Py };
      pos2 = { x: Px + size / 2, y: Py };
  } else {
      let A = 1 + Aq * Aq;
      let B = (-2 * Px) + (2 * Aq * Bq) + (-2 * Py * Aq);
      let C = (Px * Px) + (Bq * Bq) - (2 * Py * Bq) + (Py * Py) - (size * size) / 4; // -N
      let Delta = (B * B) - (4 * A * C);
      let posX1 = (-B - (Math.sqrt(Delta))) / (2 * A);
      let posX2 = (-B + (Math.sqrt(Delta))) / (2 * A);
      pos1 = { x: posX1, y: (Aq * posX1) + Bq };
      pos2 = { x: posX2, y: (Aq * posX2) + Bq };
  }
  return [pos1, pos2];
}

function zoom_maker(lens, xmove, xview) {

  if (lens === 'zoomout' && zoom > 1 && zoom < 17) {
      zoom--;
      width_viewbox += xmove;
      let ratioWidthZoom = taille_w / width_viewbox;
      height_viewbox = width_viewbox * ratio_viewbox;
      myDiv = document.getElementById("scaleVal");
      myDiv.style.width = 60 * ratioWidthZoom + 'px';
      originX_viewbox = originX_viewbox - (xmove / 2);
      originY_viewbox = originY_viewbox - (xmove / 2 * ratio_viewbox);
  }
  if (lens === 'zoomin' && zoom < 14 && zoom > 0) {
      zoom++;
      let oldWidth = width_viewbox;
      width_viewbox -= xmove;
      let ratioWidthZoom = taille_w / width_viewbox;
      height_viewbox = width_viewbox * ratio_viewbox;
      myDiv = document.getElementById("scaleVal");
      myDiv.style.width = 60 * ratioWidthZoom + 'px';

      originX_viewbox = originX_viewbox + (xmove / 2);
      originY_viewbox = originY_viewbox + (xmove / 2 * ratio_viewbox);
  }
  factor = width_viewbox / taille_w;
  if (lens === 'zoomreset') {
      originX_viewbox = 0;
      originY_viewbox = 0;
      width_viewbox = taille_w;
      height_viewbox = taille_h;
      factor = 1;
  }
  if (lens === 'zoomright') {
      originX_viewbox += xview;
  }
  if (lens === 'zoomleft') {
      originX_viewbox -= xview;
  }
  if (lens === 'zoomtop') {
      originY_viewbox -= xview;
  }
  if (lens === 'zoombottom') {
      originY_viewbox += xview;
  }
  if (lens === 'zoomdrag') {
      originX_viewbox -= xmove;
      originY_viewbox -= xview;
  }
  $('svg').each(function () {
      $(this)[0].setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox)
  });
}

tactile = false;

function calcul_snap(event, state) {
  if (event.touches) {
      let touches = event.changedTouches;
      console.log("toto")
      eX = touches[0].pageX;
      eY = touches[0].pageY;
      tactile = true;
  } else {
      eX = event.pageX;
      eY = event.pageY;
  }
  x_mouse = (eX * factor) - (offset.left * factor) + originX_viewbox;
  y_mouse = (eY * factor) - (offset.top * factor) + originY_viewbox;

  if (state === 'on') {
      x_grid = Math.round(x_mouse / grid) * grid;
      y_grid = Math.round(y_mouse / grid) * grid;
  }
  if (state === 'off') {
      x_grid = x_mouse;
      y_grid = y_mouse;
  }
  return {
      x: x_grid,
      y: y_grid,
      xMouse: x_mouse,
      yMouse: y_mouse
  };
}

minMoveGrid = function (mouse) {
  return Math.abs(Math.abs(pox - mouse.x) + Math.abs(poy - mouse.y));
}

function intersectionOff() {
  if (typeof (lineIntersectionP) !== 'undefined') {
      lineIntersectionP.remove();
      lineIntersectionP = undefined; // delete 대신 undefined로 설정
  }
}

function intersection(snap, range = Infinity, except = ['']) {
  // ORANGE LINES 90° NEAR SEGMENT
  let bestEqPoint = {};
  let equation = {};

  bestEqPoint.distance = range;

  if (typeof (lineIntersectionP) != 'undefined') {
      lineIntersectionP.remove();
      lineIntersectionP = undefined;
  }

  lineIntersectionP = qSVG.create("boxbind", "path", { // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
      d: "",
      "stroke": "transparent",
      "stroke-width": 0.5,
      "stroke-opacity": "1",
      fill: "none"
  });

  for (index = 0; index < WALLS.length; index++) {
      if (except.indexOf(WALLS[index]) === -1) {
          let x1 = WALLS[index].start.x;
          let y1 = WALLS[index].start.y;
          let x2 = WALLS[index].end.x;
          let y2 = WALLS[index].end.y;

          // EQUATION 90° of segment nf/nf-1 at X2/Y2 Point
          if (Math.abs(y2 - y1) === 0) {
              equation.C = 'v'; // C/D equation 90° Coef = -1/E
              equation.D = x1;
              equation.E = 'h'; // E/F equation Segment
              equation.F = y1;
              equation.G = 'v'; // G/H equation 90° Coef = -1/E
              equation.H = x2;
              equation.I = 'h'; // I/J equation Segment
              equation.J = y2;
          } else if (Math.abs(x2 - x1) === 0) {
              equation.C = 'h'; // C/D equation 90° Coef = -1/E
              equation.D = y1;
              equation.E = 'v'; // E/F equation Segment
              equation.F = x1;
              equation.G = 'h'; // G/H equation 90° Coef = -1/E
              equation.H = y2;
              equation.I = 'v'; // I/J equation Segment
              equation.J = x2;
          } else {
              equation.C = (x1 - x2) / (y2 - y1);
              equation.D = y1 - (x1 * equation.C);
              equation.E = (y2 - y1) / (x2 - x1);
              equation.F = y1 - (x1 * equation.E);
              equation.G = (x1 - x2) / (y2 - y1);
              equation.H = y2 - (x2 * equation.C);
              equation.I = (y2 - y1) / (x2 - x1);
              equation.J = y2 - (x2 * equation.E);
          }
          equation.A = equation.C;
          equation.B = equation.D;
          eq = qSVG.nearPointOnEquation(equation, snap);
          if (eq.distance < bestEqPoint.distance) {
              setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 1);
          }
          equation.A = equation.E;
          equation.B = equation.F;
          eq = qSVG.nearPointOnEquation(equation, snap);
          if (eq.distance < bestEqPoint.distance) {
              setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 1);
          }
          equation.A = equation.G;
          equation.B = equation.H;
          eq = qSVG.nearPointOnEquation(equation, snap);
          if (eq.distance < bestEqPoint.distance) {
              setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 2);
          }
          equation.A = equation.I;
          equation.B = equation.J;
          eq = qSVG.nearPointOnEquation(equation, snap);
          if (eq.distance < bestEqPoint.distance) {
              setBestEqPoint(bestEqPoint, eq.distance, index, eq.x, eq.y, x1, y1, x2, y2, 2);
          }
      } // END INDEXOF EXCEPT TEST
  } // END LOOP FOR

  if (bestEqPoint.distance < range) {
      if (bestEqPoint.way === 2) {
          lineIntersectionP.attr({ // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
              d: "M" + bestEqPoint.x1 + "," + bestEqPoint.y1 + " L" + bestEqPoint.x2 + "," + bestEqPoint.y2 + " L" + bestEqPoint.x + "," +
                  bestEqPoint.y,
              "stroke": "#d7ac57"
          });
      } else {
          lineIntersectionP.attr({ // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
              d: "M" + bestEqPoint.x2 + "," + bestEqPoint.y2 + " L" + bestEqPoint.x1 + "," + bestEqPoint.y1 + " L" + bestEqPoint.x + "," +
                  bestEqPoint.y,
              "stroke": "#d7ac57"
          });
      }
      return ({
          x: bestEqPoint.x,
          y: bestEqPoint.y,
          wall: WALLS[bestEqPoint.node],
          distance: bestEqPoint.distance
      });
  } else {
      return false;
  }
}

function debugPoint(point, name, color = "#00ff00") {
  qSVG.create('boxDebug', 'circle', {
      cx: point.x,
      cy: point.y,
      r: 7,
      fill: color,
      id: name,
      class: "visu"
  });
}

function showVertex() {
  for (let i = 0; i < vertex.length; i++) {
      debugPoint(vertex[i], i);

  }
}

function showJunction() {
  for (let i = 0; i < junction.length; i++) {
      debugPoint({ x: junction[i].values[0], y: junction[i].values[1] }, i);

  }
}

$('.visu').mouseover(function () {
  console.log(this.id)
});

let sizeText = [];
let showAllSizeStatus = 0;

function hideAllSize() {
  $('#boxbind').empty();
  sizeText = [];
  showAllSizeStatus = 0;
}

function allRib() {
  $('#boxRib').empty();
  for (let i in WALLS) {
      inWallRib(WALLS[i], 'all');
  }
}

function inWallRib(wall, option = false) {
  if (!option) $('#boxRib').empty();
  ribMaster = [];
  ribMaster.push([]);
  ribMaster.push([]);
  let inter;
  let distance;
  let cross;
  let angleTextValue = wall.angle * (180 / Math.PI);
  let objWall = editor.objFromWall(wall); // LIST OBJ ON EDGE
  if (objWall.length == 0) return
  ribMaster[0].push({ wall: wall, crossObj: false, side: 'up', coords: wall.coords[0], distance: 0 });
  ribMaster[1].push({ wall: wall, crossObj: false, side: 'down', coords: wall.coords[1], distance: 0 });
  let objTarget = null
  for (let ob in objWall) {
      objTarget = objWall[ob];
      objTarget.up = [
          qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[0]),
          qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[1])
      ];
      objTarget.down = [
          qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[0]),
          qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[1])
      ];

      distance = qSVG.measure(wall.coords[0], objTarget.up[0]) / meter;
      ribMaster[0].push({
          wall: objTarget,
          crossObj: ob,
          side: 'up',
          coords: objTarget.up[0],
          distance: distance.toFixed(2)
      });
      distance = qSVG.measure(wall.coords[0], objTarget.up[1]) / meter;
      ribMaster[0].push({
          wall: objTarget,
          crossObj: ob,
          side: 'up',
          coords: objTarget.up[1],
          distance: distance.toFixed(2)
      });
      distance = qSVG.measure(wall.coords[1], objTarget.down[0]) / meter;
      ribMaster[1].push({
          wall: objTarget,
          crossObj: ob,
          side: 'down',
          coords: objTarget.down[0],
          distance: distance.toFixed(2)
      });
      distance = qSVG.measure(wall.coords[1], objTarget.down[1]) / meter;
      ribMaster[1].push({
          wall: objTarget,
          crossObj: ob,
          side: 'down',
          coords: objTarget.down[1],
          distance: distance.toFixed(2)
      });
  }
  distance = qSVG.measure(wall.coords[0], wall.coords[3]) / meter;
  ribMaster[0].push({ wall: objTarget, crossObj: false, side: 'up', coords: wall.coords[3], distance: distance });
  distance = qSVG.measure(wall.coords[1], wall.coords[2]) / meter;
  ribMaster[1].push({ wall: objTarget, crossObj: false, side: 'down', coords: wall.coords[2], distance: distance });
  ribMaster[0].sort(function (a, b) {
      return (a.distance - b.distance).toFixed(2);
  });
  ribMaster[1].sort(function (a, b) {
      return (a.distance - b.distance).toFixed(2);
  });
  for (let t in ribMaster) {
      for (let n = 1; n < ribMaster[t].length; n++) {
          let found = true;
          let shift = -5;
          let valueText = Math.abs(ribMaster[t][n - 1].distance - ribMaster[t][n].distance);
          let angleText = angleTextValue;
          if (found) {
              if (ribMaster[t][n - 1].side === 'down') {
                  shift = -shift + 10;
              }
              if (angleText > 89 || angleText < -89) {
                  angleText -= 180;
                  if (ribMaster[t][n - 1].side === 'down') {
                      shift = -5;
                  } else shift = -shift + 10;
              }


              sizeText[n] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              let startText = qSVG.middle(ribMaster[t][n - 1].coords.x, ribMaster[t][n - 1].coords.y, ribMaster[t][n].coords.x,
                  ribMaster[t][n].coords.y);
              sizeText[n].setAttributeNS(null, 'x', startText.x);
              sizeText[n].setAttributeNS(null, 'y', (startText.y) + shift);
              sizeText[n].setAttributeNS(null, 'text-anchor', 'middle');
              sizeText[n].setAttributeNS(null, 'font-family', 'roboto');
              sizeText[n].setAttributeNS(null, 'stroke', '#ffffff');
              sizeText[n].textContent = valueText.toFixed(2);
              if (sizeText[n].textContent < 1) {
                  sizeText[n].setAttributeNS(null, 'font-size', '0.8em');
                  sizeText[n].textContent = sizeText[n].textContent.substring(1, sizeText[n].textContent.length);
              } else sizeText[n].setAttributeNS(null, 'font-size', '1em');
              sizeText[n].setAttributeNS(null, 'stroke-width', '0.27px');
              sizeText[n].setAttributeNS(null, 'fill', '#666666');
              sizeText[n].setAttribute("transform", "rotate(" + angleText + " " + startText.x + "," + (startText.y) + ")");

              $('#boxRib').append(sizeText[n]);
          }
      }
  }
}
