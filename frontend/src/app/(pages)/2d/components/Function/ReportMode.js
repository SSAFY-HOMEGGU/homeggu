document.getElementById('report_mode').addEventListener("click", function () {
  if (typeof (globalArea) === "undefined") return false;
  mode = "report_mode";
  $('#panel').hide();
  $('#reportTools').show(200)
  document.getElementById('reportTotalSurface').innerHTML = "Total surface : <b>" + (globalArea / 3600).toFixed(1) + "</b> m²";
  $('#reportTotalSurface').show(1000);
  document.getElementById('reportNumberSurface').innerHTML = "Number of rooms : <b>" + ROOM.length + "</b>";
  $('#reportNumberSurface').show(1000);
  let number = 1;
  let reportRoom = '<div class="row">\n';
  for (let k in ROOM) {
      let nameRoom = "Room n°" + number + " <small>(sans nom)</small>";
      if (ROOM[k].name != "") nameRoom = ROOM[k].name;
      reportRoom += '<div class="col-md-6"><p>' + nameRoom + '</p></div>\n';
      reportRoom += '<div class="col-md-6"><p>Surface : <b>' + ((ROOM[k].area) / 3600).toFixed(2) + '</b> m²</p></div>\n';
      number++;
  }
  reportRoom += '</div><hr/>\n';
  reportRoom += '<div>\n';
  let switchNumber = 0;
  let plugNumber = 0;
  let lampNumber = 0;
  for (let k in OBJDATA) {
      if (OBJDATA[k].class === 'energy') {
          if (OBJDATA[k].type === 'switch' || OBJDATA[k].type === 'doubleSwitch' || OBJDATA[k].type === 'dimmer') switchNumber++;
          if (OBJDATA[k].type === 'plug' || OBJDATA[k].type === 'plug20' || OBJDATA[k].type === 'plug32') plugNumber++;
          if (OBJDATA[k].type === 'wallLight' || OBJDATA[k].type === 'roofLight') lampNumber++;
      }
  }
  reportRoom += '<p>Switch number : ' + switchNumber + '</p>';
  reportRoom += '<p>Electric outlet number : ' + plugNumber + '</p>';
  reportRoom += '<p>Light point number : ' + lampNumber + '</p>';
  reportRoom += '</div>';
  reportRoom += '<div>\n';
  reportRoom += '<h2>Energy distribution per room</h2>\n';
  number = 1;
  reportRoom += '<div class="row">\n';
  reportRoom += '<div class="col-md-4"><p>Label</p></div>\n';
  reportRoom += '<div class="col-md-2"><small>Swi.</small></div>\n';
  reportRoom += '<div class="col-md-2"><small>Elec. out.</small></div>\n';
  reportRoom += '<div class="col-md-2"><small>Light.</small></div>\n';
  reportRoom += '<div class="col-md-2"><small>Watts Max</small></div>\n';
  reportRoom += '</div>';

  let roomEnergy = [];
  for (let k in ROOM) {
      reportRoom += '<div class="row">\n';
      let nameRoom = "Room n°" + number + " <small>(no name)</small>";
      if (ROOM[k].name != "") nameRoom = ROOM[k].name;
      reportRoom += '<div class="col-md-4"><p>' + nameRoom + '</p></div>\n';
      switchNumber = 0;
      plugNumber = 0;
      let plug20 = 0;
      let plug32 = 0;
      lampNumber = 0;
      let wattMax = 0;
      let plug = false;
      for (let i in OBJDATA) {
          if (OBJDATA[i].class === 'energy') {
              if (OBJDATA[i].type === 'switch' || OBJDATA[i].type === 'doubleSwitch' || OBJDATA[i].type === 'dimmer') {
                  if (roomTarget = editor.rayCastingRoom(OBJDATA[i])) {
                      if (isObjectsEquals(ROOM[k], roomTarget)) switchNumber++;
                  }
              }
              if (OBJDATA[i].type === 'plug' || OBJDATA[i].type === 'plug20' || OBJDATA[i].type === 'plug32') {
                  if (roomTarget = editor.rayCastingRoom(OBJDATA[i])) {
                      if (isObjectsEquals(ROOM[k], roomTarget)) {
                          plugNumber++;
                          if (OBJDATA[i].type === 'plug' && !plug) {
                              wattMax += 3520;
                              plug = true;
                          }
                          if (OBJDATA[i].type === 'plug20') {
                              wattMax += 4400;
                              plug20++;
                          }
                          if (OBJDATA[i].type === 'plug32') {
                              wattMax += 7040;
                              plug32++;
                          }
                      }
                  }
              }
              if (OBJDATA[i].type === 'wallLight' || OBJDATA[i].type === 'roofLight') {
                  if (roomTarget = editor.rayCastingRoom(OBJDATA[i])) {
                      if (isObjectsEquals(ROOM[k], roomTarget)) {
                          lampNumber++;
                          wattMax += 100;
                      }
                  }
              }
          }
      }
      roomEnergy.push({
          switch: switchNumber,
          plug: plugNumber,
          plug20: plug20,
          plug32: plug32,
          light: lampNumber
      });
      reportRoom += '<div class="col-md-2"><b>' + switchNumber + '</b></div>\n';
      reportRoom += '<div class="col-md-2"><b>' + plugNumber + '</b></div>\n';
      reportRoom += '<div class="col-md-2"><b>' + lampNumber + '</b></div>\n';
      reportRoom += '<div class="col-md-2"><b>' + wattMax + '</b></div>\n';
      number++;
      reportRoom += '</div>';
  }
  reportRoom += '<hr/><h2>Standard details NF C 15-100</h2>\n';
  number = 1;

  for (let k in ROOM) {
      reportRoom += '<div class="row">\n';
      let nfc = true;
      let nameRoom = "Room n°" + number + " <small>(no name)</small>";
      if (ROOM[k].name != "") nameRoom = ROOM[k].name;
      reportRoom += '<div class="col-md-4"><p>' + nameRoom + '</p></div>\n';
      if (ROOM[k].name === "") {
          reportRoom +=
              '<div class="col-md-8"><p><i class="fa fa-ban" aria-hidden="true" style="color:red"></i> The room has no label, Home Rough Editor cannot provide you with information.</p></div>\n';
      } else {
          if (ROOM[k].name === "Salon") {
              for (let g in ROOM) {
                  if (ROOM[g].name === "Salle à manger") {
                      roomEnergy[k].light += roomEnergy[g].light;
                      roomEnergy[k].plug += roomEnergy[g].plug;
                      roomEnergy[k].switch += roomEnergy[g].switch;
                  }
              }
              reportRoom += '<div class="col-md-8">';
              if (roomEnergy[k].light === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                      roomEnergy[k].light + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].plug < 5) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>5 power outlets</b> <small>(actually ' +
                      roomEnergy[k].plug + ')</small>.</p>\n';
                  nfc = false;
              }
              if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
              reportRoom += '</div>';
          }
          if (ROOM[k].name === "Salle à manger") {
              reportRoom +=
                  '<div class="col-md-8"><p><i class="fa fa-info" aria-hidden="true" style="color:blue"></i> This room is linked to the <b>living room / living room</b> according to the standard.</p></div>\n';
          }
          if (ROOM[k].name.substr(0, 7) === "Chambre") {
              reportRoom += '<div class="col-md-8">';
              if (roomEnergy[k].light === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                      roomEnergy[k].light + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].plug < 3) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>3 power outlets</b> <small>(actually ' +
                      roomEnergy[k].plug + ')</small>.</p>\n';
                  nfc = false;
              }
              if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
              reportRoom += '</div>';
          }
          if (ROOM[k].name === "SdB") {
              reportRoom += '<div class="col-md-8">';
              if (roomEnergy[k].light === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 light point</b> <small>(actually ' +
                      roomEnergy[k].light + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].plug < 2) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>2 power outlets</b> <small>(actually ' +
                      roomEnergy[k].plug + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].switch === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 switch</b> <small>(actually ' +
                      roomEnergy[k].switch + ')</small>.</p>\n';
                  nfc = false;
              }
              if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
              reportRoom += '</div>';
          }
          if (ROOM[k].name === "Couloir") {
              reportRoom += '<div class="col-md-8">';
              if (roomEnergy[k].light === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                      roomEnergy[k].light + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].plug < 1) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 power outlet</b> <small>(actually ' +
                      roomEnergy[k].plug + ')</small>.</p>\n';
                  nfc = false;
              }
              if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
              reportRoom += '</div>';
          }
          if (ROOM[k].name === "Toilette") {
              reportRoom += '<div class="col-md-8">';
              if (roomEnergy[k].light === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 light point</b>. <small>(actually ' +
                      roomEnergy[k].light + ')</small>.</p>\n';
                  nfc = false;
              }
              if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
              reportRoom += '</div>';
          }
          if (ROOM[k].name === "Cuisine") {
              reportRoom += '<div class="col-md-8">';
              if (roomEnergy[k].light === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 controlled light point</b> <small>(actually ' +
                      roomEnergy[k].light + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].plug < 6) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>6 power outlets</b> <small>(actually ' +
                      roomEnergy[k].plug + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].plug32 === 0) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>1 32A power outlet</b> <small>(actually ' +
                      roomEnergy[k].plug32 + ')</small>.</p>\n';
                  nfc = false;
              }
              if (roomEnergy[k].plug20 < 2) {
                  reportRoom +=
                      '<p><i class="fa fa-exclamation-triangle" style="color:orange" aria-hidden="true"></i> This room must have at least <b>2 20A power outlets</b> <small>(actually ' +
                      roomEnergy[k].plug20 + ')</small>.</p>\n';
                  nfc = false;
              }
              if (nfc) reportRoom += '<i class="fa fa-check" aria-hidden="true" style="color:green"></i>';
              reportRoom += '</div>';
          }
      }
      number++;
      reportRoom += '</div>';
  }

  document.getElementById('reportRooms').innerHTML = reportRoom;
  $('#reportRooms').show(1000);



});