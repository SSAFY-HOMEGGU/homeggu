//  RETURN PATH(s) ARRAY FOR OBJECT + PROPERTY params => bindBox (false = open sideTool), move, resize, rotate
function carpentryCalc(classObj, typeObj, sizeObj, thickObj, dividerObj = 10) {
  let construc = [];
  construc.params = {};
  construc.params.bindBox = false;
  construc.params.move = false;
  construc.params.resize = false;
  construc.params.resizeLimit = {};
  construc.params.resizeLimit.width = { min: false, max: false };
  construc.params.resizeLimit.height = { min: false, max: false };
  construc.params.rotate = false;

  if (classObj === 'socle') {
      pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
          thickObj / 2 + " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) +
          " Z", "#5cba79", "#5cba79", '');
  }


  if (classObj === 'doorWindow') {
      if (typeObj === 'simple') {

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#ccc", "none",
              '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
              (-sizeObj - thickObj / 2) + "  A" + sizeObj + "," + sizeObj + " 0 0,1 " + sizeObj / 2 + "," + (-thickObj / 2), "none", colorWall,
              '');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 40, max: 120 };
      }
      if (typeObj === 'double') {

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#ccc", "none",
              '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
              (-sizeObj / 2 - thickObj / 2) + "  A" + sizeObj / 2 + "," + sizeObj / 2 + " 0 0,1 0," + (-thickObj / 2), "none", colorWall,
              '');

          pushToConstruc(construc, "M " + (sizeObj / 2) + "," + (-thickObj / 2) + " L " + (sizeObj / 2) + "," +
              (-sizeObj / 2 - thickObj / 2) + "  A" + sizeObj / 2 + "," + sizeObj / 2 + " 0 0,0 0," + (-thickObj / 2), "none", colorWall,
              '');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 40, max: 160 };
      }
      if (typeObj === 'pocket') {
          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-(thickObj / 2) - 4) + " L " + (-sizeObj / 2) + "," +
              thickObj / 2 + " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-(thickObj / 2) - 4) + " Z", "#ccc",
              "none",
              'none');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " M " + (sizeObj / 2) + "," + (thickObj / 2) + " L " + (sizeObj / 2) + "," + (-thickObj / 2), "none", "#494646",
              '5 5');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," +
              (-thickObj / 2 - 5) + " L " + (+sizeObj / 2) + "," + (-thickObj / 2 - 5) + " L " + (+sizeObj / 2) +
              "," + (-thickObj / 2) + " Z", "url(#hatch)", "#494646", '');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 60, max: 200 };
      }
      if (typeObj === 'aperture') {
          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#ccc", "#494646",
              '5,5');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-(thickObj / 2)) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " L " + ((-sizeObj / 2) + 5) + "," + thickObj / 2 + " L " + ((-sizeObj / 2) + 5) + "," + (-(thickObj / 2)) + " Z", "none",
              "#494646",
              'none');

          pushToConstruc(construc, "M " + ((sizeObj / 2) - 5) + "," + (-(thickObj / 2)) + " L " + ((sizeObj / 2) - 5) + "," + thickObj / 2 +
              " L " + (sizeObj / 2) + "," + thickObj / 2 + " L " + (sizeObj / 2) + "," + (-(thickObj / 2)) + " Z", "none", "#494646",
              'none');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 40, max: 500 };
      }
      if (typeObj === 'fix') {
          pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",2 L " +
              sizeObj / 2 + ",2 L " + sizeObj / 2 + ",-2 Z", "#ccc", "none", '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#ccc", '');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 30, max: 300 };
      }
      if (typeObj === 'flap') {

          pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",2 L " +
              sizeObj / 2 + ",2 L " + sizeObj / 2 + ",-2 Z", "#ccc", "none", '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#ccc", '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + ((-sizeObj / 2) +
              ((sizeObj) * 0.866)) + "," + ((-sizeObj / 2) - (thickObj / 2)) + "  A" + sizeObj + "," +
              sizeObj + " 0 0,1 " + sizeObj / 2 + "," + (-thickObj / 2), "none", colorWall, '');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 20, max: 100 };
      }
      if (typeObj === 'twin') {

          pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",2 L " + sizeObj / 2 +
              ",2 L " + sizeObj / 2 + ",-2 Z", "#000", "none", '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " L " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "#fff", "#fff", '', 0.7);

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#000", '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + ((-sizeObj / 2) +
              ((sizeObj / 2) * 0.866)) + "," + (-sizeObj / 4 - thickObj / 2) + "  A" +
              sizeObj / 2 + "," + sizeObj / 2 + " 0 0,1 0," + (-thickObj / 2), "none", colorWall, '');

          pushToConstruc(construc, "M " + (sizeObj / 2) + "," + (-thickObj / 2) + " L " + ((sizeObj / 2) +
              ((-sizeObj / 2) * 0.866)) + "," + (-sizeObj / 4 - thickObj / 2) + "  A" +
              sizeObj / 2 + "," + sizeObj / 2 + " 0 0,0 0," + (-thickObj / 2), "none", colorWall, '');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 40, max: 200 };
      }
      if (typeObj === 'bay') {

          pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 +
              " M " + sizeObj / 2 + "," + thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2), "none", "#ccc", '');

          pushToConstruc(construc, "M " + (-sizeObj / 2) + ",-2 L " + (-sizeObj / 2) + ",0 L 2,0 L 2,2 L 3,2 L 3,-2 Z", "#ccc", "none", '');

          pushToConstruc(construc, "M -2,1 L -2,3 L " + sizeObj / 2 + ",3 L " + sizeObj / 2 + ",1 L -1,1 L -1,-1 L -2,-1 Z", "#ccc", "none", '');
          construc.params.resize = true;
          construc.params.resizeLimit.width = { min: 60, max: 300 };
      }
  }

  if (classObj === 'measure') {
      construc.params.bindBox = true;
      pushToConstruc(construc, "M-" + (sizeObj / 2) + ",0 l10,-10 l0,8 l" + (sizeObj - 20) +
          ",0 l0,-8 l10,10 l-10,10 l0,-8 l-" + (sizeObj - 20) + ",0 l0,8 Z", "#729eeb", "none", '');
  }

  if (classObj === 'boundingBox') {

      pushToConstruc(construc,
          "M" + (-sizeObj / 2 - 10) + "," + (-thickObj / 2 - 10) + " L" + (sizeObj / 2 + 10) + "," + (-thickObj / 2 - 10) + " L" +
          (sizeObj / 2 + 10) + "," + (thickObj / 2 + 10) + " L" + (-sizeObj / 2 - 10) + "," + (thickObj / 2 + 10) + " Z", 'none',
          "#aaa", '');

      // construc.push({'path':"M"+dividerObj[0].x+","+dividerObj[0].y+" L"+dividerObj[1].x+","+dividerObj[1].y+" L"+dividerObj[2].x+",
      // "+dividerObj[2].y+" L"+dividerObj[3].x+","+dividerObj[3].y+" Z", 'fill':'none', 'stroke':"#000", 'strokeDashArray': ''});
  }

  //typeObj = color  dividerObj = text
  if (classObj === 'text') {
      construc.params.bindBox = true;
      construc.params.move = true;
      construc.params.rotate = true;
      construc.push({
          'text': dividerObj.text,
          'x': '0',
          'y': '0',
          'fill': typeObj,
          'stroke': typeObj,
          'fontSize': dividerObj.size + 'px',
          "strokeWidth": "0px"
      });
  }

  if (classObj === 'stair') {
      construc.params.bindBox = true;
      construc.params.move = true;
      construc.params.resize = true;
      construc.params.rotate = true;
      construc.params.width = 60;
      construc.params.height = 180;
      if (typeObj === 'simpleStair') {

          pushToConstruc(construc,
              "M " + (-sizeObj / 2) + "," + (-thickObj / 2) + " L " + (-sizeObj / 2) + "," + thickObj / 2 + " L " + sizeObj / 2 + "," +
              thickObj / 2 + " L " + sizeObj / 2 + "," + (-thickObj / 2) + " Z", "#fff", "#000", '');

          let heightStep = thickObj / (dividerObj);
          for (let i = 1; i < dividerObj + 1; i++) {
              pushToConstruc(construc, "M " + (-sizeObj / 2) + "," + ((-thickObj / 2) + (i * heightStep)) + " L " + (sizeObj / 2) + "," +
                  ((-thickObj / 2) + (i * heightStep)), "none", "#000", 'none');
          }
          construc.params.resizeLimit.width = { min: 40, max: 200 };
          construc.params.resizeLimit.height = { min: 40, max: 400 };
      }

  }

  if (classObj === 'energy') {
      construc.params.bindBox = true;
      construc.params.move = true;
      construc.params.resize = false;
      construc.params.rotate = false;
      if (typeObj === 'gtl') {
          pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#fff", "#333", '');
          construc.push({
              'text': "GTL",
              'x': '0',
              'y': '5',
              'fill': "#333333",
              'stroke': "none",
              'fontSize': '0.9em',
              "strokeWidth": "0.4px"
          });
          construc.params.width = 40;
          construc.params.height = 40;
          construc.family = 'stick';
      }
      if (typeObj === 'switch') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#333", '');
          pushToConstruc(construc, qSVG.circlePath(-2, 4, 5), "none", "#333", '');
          pushToConstruc(construc, "m 0,0 5,-9", "none", "#333", '');
          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';

      }
      if (typeObj === 'doubleSwitch') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#333", '');
          pushToConstruc(construc, qSVG.circlePath(0, 0, 4), "none", "#333", '');
          pushToConstruc(construc, "m 2,-3 5,-8 3,2", "none", "#333", '');
          pushToConstruc(construc, "m -2,3 -5,8 -3,-2", "none", "#333", '');
          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'dimmer') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#333", '');
          pushToConstruc(construc, qSVG.circlePath(-2, 4, 5), "none", "#333", '');
          pushToConstruc(construc, "m 0,0 5,-9", "none", "#333", '');
          pushToConstruc(construc, "M -2,-6 L 10,-4 L-2,-2 Z", "none", "#333", '');

          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'plug') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "M 10,-6 a 10,10 0 0 1 -5,8 10,10 0 0 1 -10,0 10,10 0 0 1 -5,-8", "none", "#333", '');
          pushToConstruc(construc, "m 0,3 v 7", "none", "#333", '');
          pushToConstruc(construc, "m -10,4 h 20", "none", "#333", '');
          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'plug20') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "M 10,-6 a 10,10 0 0 1 -5,8 10,10 0 0 1 -10,0 10,10 0 0 1 -5,-8", "none", "#333", '');
          pushToConstruc(construc, "m 0,3 v 7", "none", "#333", '');
          pushToConstruc(construc, "m -10,4 h 20", "none", "#333", '');

          construc.push({
              'text': "20A",
              'x': '0',
              'y': '-5',
              'fill': "#333333",
              'stroke': "none",
              'fontSize': '0.65em',
              "strokeWidth": "0.4px"
          });
          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'plug32') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "M 10,-6 a 10,10 0 0 1 -5,8 10,10 0 0 1 -10,0 10,10 0 0 1 -5,-8", "none", "#333", '');
          pushToConstruc(construc, "m 0,3 v 7", "none", "#333", '');
          pushToConstruc(construc, "m -10,4 h 20", "none", "#333", '');

          construc.push({
              'text': "32A",
              'x': '0',
              'y': '-5',
              'fill': "#333333",
              'stroke': "none",
              'fontSize': '0.65em',
              "strokeWidth": "0.4px"
          });
          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'roofLight') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "M -8,-8 L 8,8 M -8,8 L 8,-8", "none", "#333", '');

          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'free';
      }
      if (typeObj === 'wallLight') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "M -8,-8 L 8,8 M -8,8 L 8,-8", "none", "#333", '');
          pushToConstruc(construc, "M -10,10 L 10,10", "none", "#333", '');

          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'www') {
          pushToConstruc(construc, "m -20,-20 l 40,0 l0,40 l-40,0 Z", "#fff", "#333", '');

          construc.push({
              'text': "@",
              'x': '0',
              'y': '4',
              'fill': "#333333",
              'stroke': "none",
              'fontSize': '1.2em',
              "strokeWidth": "0.4px"
          });
          construc.params.width = 40;
          construc.params.height = 40;
          construc.family = 'free';
      }
      if (typeObj === 'rj45') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "m-10,5 l0,-10 m20,0 l0,10", "none", "#333", '');
          pushToConstruc(construc, "m 0,5 v 7", "none", "#333", '');
          pushToConstruc(construc, "m -10,5 h 20", "none", "#333", '');

          construc.push({
              'text': "RJ45",
              'x': '0',
              'y': '-5',
              'fill': "#333333",
              'stroke': "none",
              'fontSize': '0.5em',
              "strokeWidth": "0.4px"
          });
          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'tv') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "m-10,5 l0-10 m20,0 l0,10", "none", "#333", '');
          pushToConstruc(construc, "m-7,-5 l0,7 l14,0 l0,-7", "none", "#333", '');
          pushToConstruc(construc, "m 0,5 v 7", "none", "#333", '');
          pushToConstruc(construc, "m -10,5 h 20", "none", "#333", '');

          construc.push({
              'text': "TV",
              'x': '0',
              'y': '-5',
              'fill': "#333333",
              'stroke': "none",
              'fontSize': '0.5em',
              "strokeWidth": "0.4px"
          });
          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }

      if (typeObj === 'heater') {
          pushToConstruc(construc, qSVG.circlePath(0, 0, 16), "#fff", "#000", '');
          pushToConstruc(construc, "m-15,-4 l30,0", "none", "#333", '');
          pushToConstruc(construc, "m-14,-8 l28,0", "none", "#333", '');
          pushToConstruc(construc, "m-11,-12 l22,0", "none", "#333", '');
          pushToConstruc(construc, "m-16,0 l32,0", "none", "#333", '');
          pushToConstruc(construc, "m-15,4 l30,0", "none", "#333", '');
          pushToConstruc(construc, "m-14,8 l28,0", "none", "#333", '');
          pushToConstruc(construc, "m-11,12 l22,0", "none", "#333", '');

          construc.params.width = 36;
          construc.params.height = 36;
          construc.family = 'stick';
      }
      if (typeObj === 'radiator') {
          pushToConstruc(construc, "m -20,-10 l 40,0 l0,20 l-40,0 Z", "#fff", "#333", '');
          pushToConstruc(construc, "M -15,-10 L -15,10", "#fff", "#333", '');
          pushToConstruc(construc, "M -10,-10 L -10,10", "#fff", "#333", '');
          pushToConstruc(construc, "M -5,-10 L -5,10", "#fff", "#333", '');
          pushToConstruc(construc, "M -0,-10 L -0,10", "#fff", "#333", '');
          pushToConstruc(construc, "M 5,-10 L 5,10", "#fff", "#333", '');
          pushToConstruc(construc, "M 10,-10 L 10,10", "#fff", "#333", '');
          pushToConstruc(construc, "M 15,-10 L 15,10", "#fff", "#333", '');

          construc.params.width = 40;
          construc.params.height = 20;
          construc.family = 'stick';

      }
  }

  if (classObj === 'furniture') {
      construc.params.bindBox = true;
      construc.params.move = true;
      construc.params.resize = true;
      construc.params.rotate = true;
  }

  return construc;
}

function setBestEqPoint(bestEqPoint, distance, index, x, y, x1, y1, x2, y2, way) {
  bestEqPoint.distance = distance;
  bestEqPoint.node = index;
  bestEqPoint.x = x;
  bestEqPoint.y = y;
  bestEqPoint.x1 = x1;
  bestEqPoint.y1 = y1;
  bestEqPoint.x2 = x2;
  bestEqPoint.y2 = y2;
  bestEqPoint.way = way;
}

function pushToRibMaster(ribMaster, firstIndex, secondIndex, wallIndex, crossEdge, side, coords, distance) {
  ribMaster[firstIndex][secondIndex].push({
      wallIndex: wallIndex,
      crossEdge: crossEdge,
      side: side,
      coords: coords,
      distance: distance
  });
}

function pushToConstruc(construc, path, fill, stroke, strokeDashArray, opacity = 1) {
  construc.push({
      'path': path,
      'fill': fill,
      'stroke': stroke,
      'strokeDashArray': strokeDashArray,
      'opacity': opacity
  });
}