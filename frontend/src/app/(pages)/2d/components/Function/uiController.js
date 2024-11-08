function rib(shift = 5) {
  let ribMaster = [[], []];
  let inter, distance, cross;
  WALLS.forEach((wall, i) => {
    if (wall.equations.base) {
      ribMaster[0].push([]);
      pushToRibMaster(ribMaster, 0, i, i, i, 'up', wall.coords[0], 0);
      ribMaster[1].push([]);
      pushToRibMaster(ribMaster, 1, i, i, i, 'down', wall.coords[1], 0);

      WALLS.forEach((otherWall, p) => {
        if (i !== p && otherWall.equations.base) {
          cross = qSVG.intersectionOfEquations(wall.equations.base, otherWall.equations.base, "object");
          if (qSVG.btwn(cross.x, wall.start.x, wall.end.x, 'round') && qSVG.btwn(cross.y, wall.start.y, wall.end.y, 'round')) {
            inter = qSVG.intersectionOfEquations(wall.equations.up, otherWall.equations.up, "object");
            if (qSVG.btwn(inter.x, wall.coords[0].x, wall.coords[3].x, 'round') &&
                qSVG.btwn(inter.y, wall.coords[0].y, wall.coords[3].y, 'round') &&
                qSVG.btwn(inter.x, otherWall.coords[0].x, otherWall.coords[3].x, 'round') &&
                qSVG.btwn(inter.y, otherWall.coords[0].y, otherWall.coords[3].y, 'round')) {
              distance = qSVG.measure(wall.coords[0], inter) / meter;
              pushToRibMaster(ribMaster, 0, i, i, p, 'up', inter, distance.toFixed(2));
            }

            inter = qSVG.intersectionOfEquations(wall.equations.up, otherWall.equations.down, "object");
            if (qSVG.btwn(inter.x, wall.coords[0].x, wall.coords[3].x, 'round') &&
                qSVG.btwn(inter.y, wall.coords[0].y, wall.coords[3].y, 'round') &&
                qSVG.btwn(inter.x, otherWall.coords[1].x, otherWall.coords[2].x, 'round') &&
                qSVG.btwn(inter.y, otherWall.coords[1].y, otherWall.coords[2].y, 'round')) {
              distance = qSVG.measure(wall.coords[0], inter) / meter;
              pushToRibMaster(ribMaster, 0, i, i, p, 'up', inter, distance.toFixed(2));
            }

            inter = qSVG.intersectionOfEquations(wall.equations.down, otherWall.equations.up, "object");
            if (qSVG.btwn(inter.x, wall.coords[1].x, wall.coords[2].x, 'round') &&
                qSVG.btwn(inter.y, wall.coords[1].y, wall.coords[2].y, 'round') &&
                qSVG.btwn(inter.x, otherWall.coords[0].x, otherWall.coords[3].x, 'round') &&
                qSVG.btwn(inter.y, otherWall.coords[0].y, otherWall.coords[3].y, 'round')) {
              distance = qSVG.measure(wall.coords[1], inter) / meter;
              pushToRibMaster(ribMaster, 1, i, i, p, 'down', inter, distance.toFixed(2));
            }

            inter = qSVG.intersectionOfEquations(wall.equations.down, otherWall.equations.down, "object");
            if (qSVG.btwn(inter.x, wall.coords[1].x, wall.coords[2].x, 'round') &&
                qSVG.btwn(inter.y, wall.coords[1].y, wall.coords[2].y, 'round') &&
                qSVG.btwn(inter.x, otherWall.coords[1].x, otherWall.coords[2].x, 'round') &&
                qSVG.btwn(inter.y, otherWall.coords[1].y, otherWall.coords[2].y, 'round')) {
              distance = qSVG.measure(wall.coords[1], inter) / meter;
              pushToRibMaster(ribMaster, 1, i, i, p, 'down', inter, distance.toFixed(2));
            }
          }
        }
      });

      distance = qSVG.measure(wall.coords[0], wall.coords[3]) / meter;
      pushToRibMaster(ribMaster, 0, i, i, i, 'up', wall.coords[3], distance.toFixed(2));

      distance = qSVG.measure(wall.coords[1], wall.coords[2]) / meter;
      pushToRibMaster(ribMaster, 1, i, i, i, 'down', wall.coords[2], distance.toFixed(2));
    }
  });

  ribMaster.forEach(layer => {
    layer.forEach(rib => rib.sort((a, b) => a.distance - b.distance));
  });

  const boxRib = document.getElementById('boxRib');
  if (shift === 5) boxRib.innerHTML = '';

  ribMaster.forEach((layer, t) => {
    layer.forEach((ribGroup, a) => {
      ribGroup.slice(1).forEach((rib, n) => {
        if (ribGroup[n].wallIndex === rib.wallIndex) {
          const edge = rib.wallIndex;
          let found = true;
          const valueText = Math.abs(ribGroup[n - 1].distance - rib.distance);

          if (valueText < 0.15) found = false;
          if (found && ribGroup[n - 1].crossEdge === rib.crossEdge && rib.crossEdge !== rib.wallIndex) found = false;

          if (found && ribGroup.length > 2 && n === 1) {
            const polygon = Array.from({ length: 4 }, (_, pp) => ({
              x: WALLS[rib.crossEdge].coords[pp].x,
              y: WALLS[rib.crossEdge].coords[pp].y
            }));
            if (qSVG.rayCasting(ribGroup[0].coords, polygon)) found = false;
          }

          if (found && ribGroup.length > 2 && n === ribGroup.length - 1) {
            const polygon = Array.from({ length: 4 }, (_, pp) => ({
              x: WALLS[ribGroup[n - 1].crossEdge].coords[pp].x,
              y: WALLS[ribGroup[n - 1].crossEdge].coords[pp].y
            }));
            if (qSVG.rayCasting(ribGroup[ribGroup.length - 1].coords, polygon)) found = false;
          }

          if (found) {
            const angleText = WALLS[rib.wallIndex].angle * (180 / Math.PI);
            let shiftValue = rib.side === 'down' ? -shift + 10 : -shift;
            if (angleText > 90 || angleText < -89) {
              shiftValue = rib.side === 'down' ? -shift : -shift + 10;
            }

            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const startText = qSVG.middle(ribGroup[n - 1].coords.x, ribGroup[n - 1].coords.y, rib.coords.x, rib.coords.y);
            textElement.setAttributeNS(null, 'x', startText.x);
            textElement.setAttributeNS(null, 'y', startText.y + shiftValue);
            textElement.setAttributeNS(null, 'text-anchor', 'middle');
            textElement.setAttributeNS(null, 'font-family', 'roboto');
            textElement.setAttributeNS(null, 'stroke', '#ffffff');
            textElement.textContent = valueText < 1 ? valueText.toFixed(2).substring(1) : valueText.toFixed(2);
            textElement.setAttributeNS(null, 'font-size', valueText < 1 ? '0.73em' : '0.9em');
            textElement.setAttributeNS(null, 'stroke-width', '0.2px');
            textElement.setAttributeNS(null, 'fill', '#555555');
            textElement.setAttribute('transform', `rotate(${angleText} ${startText.x},${startText.y})`);

            boxRib.appendChild(textElement);
          }
        }
      });
    });
  });
}

function cursor(tool) {
  const cursorUrl = {
    grab: "url('https://wiki.openmrs.org/s/en_GB/7502/b9217199c27dd617c8d51f6186067d7767c5001b/_/images/icons/emoticons/add.png') 8 8, auto",
    scissor: "url('https://maxcdn.icons8.com/windows10/PNG/64/Hands/hand_scissors-64.png'), auto",
    trash: "url('https://cdn4.iconfinder.com/data/icons/common-toolbar/36/Cancel-32.png'), auto",
    validation: "url('https://images.fatguymedia.com/wp-content/uploads/2015/09/check.png'), auto"
  };
  linElement.style.cursor = cursorUrl[tool] || 'auto';
}

function fullscreen() {
  const el = document.body;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  else if (el.msRequestFullscreen) el.msRequestFullscreen();
}

function outFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
}

document.addEventListener("fullscreenchange", function () {
  const noFullMode = document.getElementById('nofull_mode');
  const fullMode = document.getElementById('full_mode');
  if (!document.fullscreenElement) {
    noFullMode.style.display = 'none';
    fullMode.style.display = 'block';
  }
});

function raz_button() {
  const modes = [
    'rect_mode', 'select_mode', 'line_mode', 'partition_mode', 'door_mode',
    'node_mode', 'text_mode', 'room_mode', 'distance_mode', 'object_mode', 'stair_mode'
  ];
  modes.forEach(mode => {
    const modeElement = document.getElementById(mode);
    modeElement.classList.remove('btn-success');
    modeElement.classList.add('btn-default');
  });
}

function fonc_button(modesetting, option) {
  save();
  document.querySelectorAll('.sub').forEach(sub => sub.style.display = 'none');
  raz_button();

  const modeElement = document.getElementById(modesetting);
  if (option !== 'simpleStair') {
    modeElement.classList.remove('btn-default');
    modeElement.classList.add('btn-success');
  }

  mode = modesetting;
  modeOption = option;

  if (typeof lineIntersectionP !== 'undefined') {
    lineIntersectionP.remove();
    lineIntersectionP = undefined;
  }
}

document.getElementById('distance_mode').addEventListener('click', function () {
  cursor('crosshair');
  document.getElementById('boxinfo').textContent = 'Add a measurement';
  fonc_button('distance_mode');
});

document.getElementById('room_mode').addEventListener('click', function () {
  cursor('pointer');
  document.getElementById('boxinfo').textContent = 'Config. of rooms';
  fonc_button('room_mode');
});

document.getElementById('select_mode').addEventListener('click', function () {
  document.getElementById('boxinfo').textContent = 'Mode "select"';
  if (typeof binder !== 'undefined') {
    binder.remove();
    binder = undefined;
  }
  fonc_button('select_mode');
});

document.getElementById('line_mode').addEventListener('click', function () {
  cursor('crosshair');
  document.getElementById('boxinfo').textContent = 'Creation of wall(s)';
  multi = 0;
  action = 0;
  fonc_button('line_mode');
});

document.getElementById('partition_mode').addEventListener('click', function () {
  cursor('crosshair');
  document.getElementById('boxinfo').textContent = 'Creation of thin wall(s)';
  multi = 0;
  fonc_button('partition_mode');
});

document.getElementById('rect_mode').addEventListener('click', function () {
  cursor('crosshair');
  document.getElementById('boxinfo').textContent = 'Room(s) creation';
  fonc_button('rect_mode');
});

document.querySelectorAll('.door').forEach(door => {
  door.addEventListener('click', function () {
    cursor('crosshair');
    document.getElementById('boxinfo').textContent = 'Add a door';
    document.getElementById('door_list').style.display = 'none';
    fonc_button('door_mode', this.id);
  });
});

document.querySelectorAll('.window').forEach(window => {
  window.addEventListener('click', function () {
    cursor('crosshair');
    document.getElementById('boxinfo').textContent = 'Add a window';
    document.getElementById('door_list').style.display = 'none';
    document.getElementById('window_list').style.display = 'none';
    fonc_button('door_mode', this.id);
  });
});

document.querySelectorAll('.object').forEach(object => {
  object.addEventListener('click', function () {
    cursor('move');
    document.getElementById('boxinfo').textContent = 'Add an object';
    fonc_button('object_mode', this.id);
  });
});

document.getElementById('stair_mode').addEventListener('click', function () {
  cursor('move');
  document.getElementById('boxinfo').textContent = 'Add stair';
  fonc_button('object_mode', 'simpleStair');
});

document.getElementById('node_mode').addEventListener('click', function () {
  document.getElementById('boxinfo').innerHTML = 'Cut a wall<br/><span style="font-size:0.7em">Warning : Cutting the wall of a room can cancel its configuration</span>';
  fonc_button('node_mode');
});

document.getElementById('text_mode').addEventListener('click', function () {
  document.getElementById('boxinfo').innerHTML = 'Add text<br/><span style="font-size:0.7em">Place the cursor to the desired location, then type your text.</span>';
  fonc_button('text_mode');
});

document.getElementById('grid_mode').addEventListener('click', function () {
  const gridMode = document.getElementById('grid_mode');
  const boxInfo = document.getElementById('boxinfo');
  const boxGrid = document.getElementById('boxgrid');
  if (grid_snap === 'on') {
    grid_snap = 'off';
    boxInfo.textContent = 'Help grid off';
    gridMode.classList.replace('btn-success', 'btn-warning');
    gridMode.innerHTML = 'GRID OFF';
    boxGrid.style.opacity = '0.5';
  } else {
    grid_snap = 'on';
    boxInfo.textContent = 'Help grid on';
    gridMode.classList.replace('btn-warning', 'btn-success');
    gridMode.innerHTML = 'GRID ON <i class="fa fa-th" aria-hidden="true"></i>';
    boxGrid.style.opacity = '1';
  }
});
