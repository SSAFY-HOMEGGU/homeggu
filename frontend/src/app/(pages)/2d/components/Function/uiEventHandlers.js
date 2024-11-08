import { initializeState } from "./init";

export const setupEventListeners = () => {
  const state = initializeState();

  const getById = id => document.getElementById(id);

  getById('wallWidth').addEventListener('input', function () {
    const sliderValue = this.value;
    binder.wall.thick = sliderValue;
    binder.wall.type = 'normal';
    editor.architect(state.WALLS);
    const objWall = editor.objFromWall(binder.wall); // LIST OBJ ON EDGE
    objWall.forEach(wall => {
      wall.thick = sliderValue;
      wall.update();
    });
    rib();
    getById('wallWidthVal').textContent = sliderValue;
  });

  getById('bboxTrash').addEventListener('click', function () {
    binder.obj.graph.remove();
    binder.graph.remove();
    state.OBJDATA.splice(state.OBJDATA.indexOf(binder.obj), 1);
    getById('objBoundingBox').style.display = 'none';
    getById('panel').style.display = 'block';
    fonc_button('select_mode');
    getById('boxinfo').textContent = 'Deleted object';
    binder = undefined;
    rib();
  });

  getById('bboxStepsAdd').addEventListener('click', function () {
    let newValue = parseInt(getById('bboxStepsVal').textContent, 10);
    if (newValue < 15) {
      newValue++;
      binder.obj.value = newValue;
      binder.obj.update();
      getById('bboxStepsVal').textContent = newValue;
    }
  });

  getById('bboxStepsMinus').addEventListener('click', function () {
    let newValue = parseInt(getById('bboxStepsVal').textContent, 10);
    if (newValue > 2) {
      newValue--;
      binder.obj.value = newValue;
      binder.obj.update();
      getById('bboxStepsVal').textContent = newValue;
    }
  });

  getById('bboxWidth').addEventListener('input', function () {
    const sliderValue = this.value;
    binder.obj.size = (sliderValue / 100) * state.meter;
    binder.size = (sliderValue / 100) * state.meter;
    binder.update();
    getById('bboxWidthVal').textContent = sliderValue;
  });

  getById('bboxHeight').addEventListener('input', function () {
    const sliderValue = this.value;
    binder.obj.thick = (sliderValue / 100) * state.meter;
    binder.thick = (sliderValue / 100) * state.meter;
    binder.update();
    getById('bboxHeightVal').textContent = sliderValue;
  });

  getById('bboxRotation').addEventListener('input', function () {
    const sliderValue = this.value;
    binder.obj.angle = sliderValue;
    binder.angle = sliderValue;
    binder.update();
    getById('bboxRotationVal').textContent = sliderValue;
  });

  getById('doorWindowWidth').addEventListener('input', function () {
    const sliderValue = this.value;
    const objTarget = binder.obj;
    const wallBind = editor.rayCastingWalls(objTarget, state.WALLS).pop();
    const limits = limitObj(wallBind.equations.base, sliderValue, objTarget);

    if (
      qSVG.btwn(limits[1].x, wallBind.start.x, wallBind.end.x) &&
      qSVG.btwn(limits[1].y, wallBind.start.y, wallBind.end.y) &&
      qSVG.btwn(limits[0].x, wallBind.start.x, wallBind.end.x) &&
      qSVG.btwn(limits[0].y, wallBind.start.y, wallBind.end.y)
    ) {
      objTarget.size = sliderValue;
      objTarget.limit = limits;
      binder.size = sliderValue;
      binder.limit = limits;
      objTarget.update();
      binder.update();
      getById('doorWindowWidthVal').textContent = sliderValue;
    }
    inWallRib(wallBind);
  });

  getById('objToolsHinge').addEventListener('click', function () {
    binder.obj.hinge = binder.obj.hinge === 'normal' ? 'reverse' : 'normal';
    binder.obj.update();
  });

  window.addEventListener('load', function () {
    const panel = getById('panel');
    if (panel) {
      panel.style.transform = 'translateX(200px)';
      panel.addEventListener('transitionend', () => {
        getById('moveBox').style.transform = 'translateX(-165px)';
        getById('zoomBox').style.transform = 'translateX(-165px)';
      });
    }

    if (!localStorage.getItem('history')) {
      getById('recover').innerHTML = '<p>Select a plan type.</p>';
    }

    const myModal = new bootstrap.Modal(getById('myModal'));
    myModal.show();
  });

  getById('sizePolice').addEventListener('input', function () {
    getById('labelBox').style.fontSize = `${this.value}px`;
  });

  document.getElementById('textToLayer').addEventListener('hidden.bs.modal', function () {
    fonc_button('select_mode');
    const textToMake = getById('labelBox').textContent;
    if (textToMake && textToMake !== 'Your text') {
      binder = new editor.obj2D('free', 'text', getById('labelBox').style.color, snap, 0, 0, 0, 'normal', 0, {
        text: textToMake,
        size: getById('sizePolice').value,
      });
      binder.update();
      state.OBJDATA.push(binder);
      binder.graph.remove();
      getById('boxText').append(state.OBJDATA[state.OBJDATA.length - 1].graph);
      state.OBJDATA[state.OBJDATA.length - 1].update();
      binder = undefined;
      getById('boxinfo').textContent = 'Added text';
      save();
    } else {
      getById('boxinfo').textContent = 'Selection mode';
    }

    getById('labelBox').textContent = 'Your text';
    getById('labelBox').style.color = '#333333';
    getById('labelBox').style.fontSize = '15px';
    getById('sizePolice').value = 15;
  });

  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function (searchElement, fromIndex) {
        if (this == null) throw new TypeError('"this" is null or not defined');
        const o = Object(this);
        const len = o.length >>> 0;
        if (len === 0) return false;
        let n = fromIndex | 0;
        let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
          if (o[k] === searchElement) return true;
          k++;
        }
        return false;
      },
    });
  }

  function isObjectsEquals(a, b) {
    return Object.keys(a).every(key => a[key] === b[key]);
  }

  getById('showRib').addEventListener('click', function () {
    const isChecked = this.checked;
    getById('boxScale').style.display = isChecked ? 'block' : 'none';
    getById('boxRib').style.display = isChecked ? 'block' : 'none';
    state.showRib = isChecked;
  });

  getById('showArea').addEventListener('click', function () {
    getById('boxArea').style.display = this.checked ? 'block' : 'none';
  });

  getById('showLayerRoom').addEventListener('click', function () {
    getById('boxRoom').style.display = this.checked ? 'block' : 'none';
  });

  getById('showLayerEnergy').addEventListener('click', function () {
    getById('boxEnergy').style.display = this.checked ? 'block' : 'none';
  });

  getById('applySurface').addEventListener('click', function () {
    getById('roomTools').style.display = 'none';
    getById('panel').style.display = 'block';
    binder.remove();
    binder = undefined;

    const id = getById('roomIndex').value;
    state.ROOM[id].color = getById('roomBackground').value;
    const roomName = getById('roomName').value;
    state.ROOM[id].name = roomName === 'None' ? '' : roomName;
    state.ROOM[id].surface = getById('roomSurface').value;
    state.ROOM[id].showSurface = getById('seeArea').checked;
    state.ROOM[id].action = document.querySelector('input[type=radio]:checked').value;

    if (state.ROOM[id].action === 'sub') {
      state.ROOM[id].color = 'hatch';
    } else if (state.ROOM[id].color === 'hatch') {
      state.ROOM[id].color = 'gradientNeutral';
    }

    getById('boxRoom').innerHTML = '';
    getById('boxSurface').innerHTML = '';
    editor.roomMaker(state.ROOM);
    getById('boxinfo').textContent = 'Updated room';
    fonc_button('select_mode');
  });

  getById('resetRoomTools').addEventListener('click', function () {
    getById('roomTools').style.display = 'none';
    getById('panel').style.display = 'block';
    binder.remove();
    binder = undefined;
    getById('boxinfo').textContent = 'Updated room';
    fonc_button('select_mode');
  });

  getById('wallTrash').addEventListener('click', function () {
    const wall = binder.wall;
    state.WALLS = state.WALLS.filter(w => !isObjectsEquals(w.child, wall) && !isObjectsEquals(w.parent, wall));
    wall.graph.remove();
    binder.graph.remove();
    editor.architect(state.WALLS);
    rib();
    mode = 'select_mode';
    getById('panel').style.display = 'block';
  });
};
