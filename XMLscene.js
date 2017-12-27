var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface, mode, dificulty, time, lasthistory) {
  CGFscene.call(this);

  this.interface = interface;
  this.lightValues = {};
  this.selectedShader = null; //Guardar o shader escolhido
  this.selectableNodes = {};
  this.normScale = 0;
  this.counter = 0;
  this.oldTime = new Date().getTime()
  //Camera stats
  this.ChangeCamera = function () { this.movingCamera = true }
  this.currentCamera = 0
  this.cameraTimer = 0
  this.movingCamera = false
  //Game state
  /*Game mode enumerator*/
  this.mode = { HH: 1, HM: 2, MM: 3, R: 4 }
  /*Game State enumerator*/
  this.state = {
    P1PieceSelect: 1, P1SpotSelect: 2, P2PieceSelect: 4, P2SpotSelect: 5, GameSetup: 6, P1Animation: 7, P2Animation: 8,
    P1EliAnimation: 9, P2EliAnimation: 10, P1BoardValidate: 11, P2BoardValidate: 12, P1Victory: 13, P2Victory: 14, GameEnd: 15, Draw: 16
  }
  this.sicstus = null;
  this.endGame = null;
  this.sId = null;
  /*The current game state*/
  this.gameState = this.state.GameSetup;
  /*The current game mode */
  if (mode) {
    this.gameMode = Number(mode)
  } else {
    this.gameMode = this.mode.HH
  }
  if (time) {
    this.timer = Number(time)
  } else {
    this.timer = 30
  }
  this.timerTag = document.getElementById('retime')
  this.timerTag.innerText = this.timer
  //Dificuldade do jogo
  this.dificulty = dificulty ? dificulty : '1'

  /*Game Coordinates enumerator*/
  this.rows = { "1": 0, "2": -3.7, "3": -7.4, "4": -11, "5": -14.7, "6": -18.3, "7": -22.2, "8": -25.9 }
  this.collumns = {
    "A": -16.6, "B": -13, "C": -9.3, "D": -5.7, "E": -2, "F": 1.7, "G": 5.3, "H": 9, "I": 12.7, "J": 16.3,
    "K": 23.8, "L": 27.5, "M": 31.2, "N": 34.9, "O": 38.6
  } /*Colunas para peças removidas*/
  /*Current Selected soldier*/
  this.pickedSoldier = null
  /*Movement history. Format: SoldierOrigin-SoldierDestinatio*/
  this.history = []
  /*Game saved States*/
  this.savedStates = [
    [
      ['1w', '2w', '3w', '4w', '5w', '6w', '7w', '8w', '9w', '10w', '8'],
      [' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', '7'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '6'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '5'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '4'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '3'],
      [' ', ' ', ' ', ' ', ' ', 'B', ' ', ' ', ' ', ' ', '2'],
      ['1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '10b', '1'],
      ['_a_', '_b_', '_c_', '_d_', '_e_', '_f_', '_g_', '_h_', '_i_', '_j_'],
    ],
  ];
  setBoard(this.savedStates[0]);
  this.serverBoard = null;
  /*Keep track of the removed pieces and where they are stored*/
  this.removedPieces = [
    [['K1', null], ['L1', null], ['M1', null], ['N1', null], ['O1', null], ['K2', null], ['L2', null], ['M2', null], ['N2', null], ['O2', null]], /*Player 1 pieces*/
    [['K7', null], ['L7', null], ['M7', null], ['N7', null], ['O7', null], ['K8', null], ['L8', null], ['M8', null], ['N8', null], ['O8', null]]  /*Player 2 pieces*/
  ];
  this.lasthistory = lasthistory ? lasthistory : null
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function (application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();
  this.enableTextures(true);
  this.setUpdatePeriod(17);
  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.axis = new CGFaxis(this);
  this.setPickEnabled(true);
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function () {
  var i = 0;
  // Lights index.
  // Reads the lights from the scene graph.
  for (var key in this.graph.lights) {
    if (i >= 8)
      break;              // Only eight lights allowed by WebGL.
    if (this.graph.lights.hasOwnProperty(key)) {
      var light = this.graph.lights[key];
      this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
      this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
      this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
      this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
      this.lights[i].setVisible(true);
      if (light[0])
        this.lights[i].enable();
      else
        this.lights[i].disable();
      this.lights[i].update();
      i++;
    }
  }
}
/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 50, 50), vec3.fromValues(0, 0, 0));
}
/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function () {
  this.camera.near = this.graph.near;
  this.camera.far = this.graph.far;
  this.axis = new CGFaxis(this, this.graph.referenceLength);
  this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
  this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
  this.initLights();
  // Adds lights group.
  this.interface.addLightsGroup(this.graph.lights);
  // Add Selectables Group
  this.interface.addSelectableGroup(this.graph.selectables);
  //Butão de controlo da camera
  this.interface.addControls()
  if (this.lasthistory) {
    this.interface.addReplay()
  }
}
/*
* Tratamento de respostas do servidor
*/
XMLscene.prototype.responseValidate = function (player) {
  if (this.sicstus.status != 0) {
    if (this.sicstus.status == 200) {
      let targetCoords = this.history[this.history.length - 1].split("-")[2]
      this.graph.nodes[this.pickedSoldier].selectable = false;
      this.gameState = player == 1 ? this.state.P1Animation : this.state.P2Animation;
      this.resetTimer();
      this.saveState(this.pickedSoldier, this.graph.nodes[this.pickedSoldier].coords, targetCoords, this.sicstus.responseText)
      this.graph.addMoveAnimation(targetCoords, this.pickedSoldier)
    } else if (this.sicstus.status == 400) {
      this.history.pop();
      console.log("Invalid move");
    }
    this.sicstus = null;
  }
}
/*
* Procurar por peças a remover
*/
XMLscene.prototype.handleElimination = function (player) {
  let rempieces = this.diffBoard();
  if (rempieces.length > 0) {
    for (let i = 0; i < rempieces.length; i++) {
      this.graph.addRemoveAnimation(rempieces[i]);
    }
    this.gameState = player == 1 ? this.state.P1EliAnimation : this.state.P2EliAnimation;
  } else {
    this.gameState = player == 1 ? this.state.P2PieceSelect : this.state.P1PieceSelect;
  }
  this.endGame = getGame_is_over(player);
}
/*
* Procurar peças a remover
*/
XMLscene.prototype.diffBoard = function () {
  let r = [];
  let internal = this.savedStates[this.savedStates.length - 1];
  let external = this.serverBoard;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 10; j++) {
      if (external[i][j] == ' ' && internal[i][j] != ' ') {
        let inid = internal[i][j];
        let p = '';
        switch (inid[inid.length - 1]) {
          case 'W':
            p = 'soldierReiB'
            break;
          case 'B':
            p = 'soldierReiA'
            break;
          case 'w':
            p = 'soldier' + inid.split('w')[0] + 'B'
            break;
          case 'b':
            p = 'soldier' + inid.split('b')[0] + 'A'
            break;
          default:
            break;
        }
        r.push(p);
        internal[i][j] = ' ';
      }
    }
  }
  console.log(this.savedStates[this.savedStates.length - 1]);
  return r;
}
/*
* Gerir o modo de jogo humano-humano
*/
XMLscene.prototype.hhPlay = function () {
  if (this.gameState != this.state.GameSetup) {
    let rempieces = [];
    switch (this.gameState) {
      case this.state.P1PieceSelect:
        if (this.sId) {
          if (this.graph.nodes[this.sId].piecetype == '1') {
            this.pickedSoldier = this.sId;
            this.graph.nodes[this.sId].selectable = true;
            this.gameState = this.state.P1SpotSelect;
          }
        }
        break;
      case this.state.P2PieceSelect:
        if (this.sId) {
          if (this.graph.nodes[this.sId].piecetype == '2') {
            this.pickedSoldier = this.sId;
            this.graph.nodes[this.sId].selectable = true;
            this.gameState = this.state.P2SpotSelect;
          }
        }
        break;
      case this.state.P1SpotSelect:
        if (this.sId) {
          if (this.graph.nodes[this.sId].piecetype == '1') {
            this.graph.nodes[this.pickedSoldier].selectable = false;
            this.pickedSoldier = this.sId;
            this.graph.nodes[this.sId].selectable = true;
          } else if (this.graph.nodes[this.sId].piecetype == 's') {
            if (this.sicstus == null) {
              this.sicstus = makePlay(1, this.graph.nodes[this.pickedSoldier].coords, this.graph.nodes[this.sId].coords)
              this.history.push(this.pickedSoldier + "-" + this.graph.nodes[this.pickedSoldier].coords + "-" + this.graph.nodes[this.sId].coords)
            }
          }
        } else if (this.sicstus) {
          this.responseValidate(1);
        }
        break;
      case this.state.P2SpotSelect:
        if (this.sId) {
          if (this.graph.nodes[this.sId].piecetype == '2') {
            this.graph.nodes[this.pickedSoldier].selectable = false;
            this.pickedSoldier = this.sId;
            this.graph.nodes[this.sId].selectable = true;
          } else if (this.graph.nodes[this.sId].piecetype == 's') {
            if (this.sicstus == null) {
              this.sicstus = makePlay(2, this.graph.nodes[this.pickedSoldier].coords, this.graph.nodes[this.sId].coords)
              this.history.push(this.pickedSoldier + "-" + this.graph.nodes[this.pickedSoldier].coords + "-" + this.graph.nodes[this.sId].coords)
            }
          }
        } else if (this.sicstus) {
          this.responseValidate(2);
        }
        break;
      case this.state.P1BoardValidate:
        this.handleElimination(1);
        break;
      case this.state.P2BoardValidate:
        this.handleElimination(2);
        break;
      case this.state.P1Victory:
        this.finalizeGame(1)
        break;
      case this.state.P2Victory:
        this.finalizeGame(2)
        break;
      case this.state.Draw:
        this.finalizeGame(3)
        break;
      default:
        break;
    }
    this.sId = null;
  }
}
/*
* Gerir o modo de jogo humano-maquina
*/
XMLscene.prototype.hmPlay = function () {
  if (this.gameState != this.state.GameSetup) {
    switch (this.gameState) {
      case this.state.P1PieceSelect:
        if (this.sId) {
          if (this.graph.nodes[this.sId].piecetype == '1') {
            this.pickedSoldier = this.sId;
            this.graph.nodes[this.sId].selectable = true;
            this.gameState = this.state.P1SpotSelect;
          }
        }
        break;
      case this.state.P2PieceSelect:
        if (this.sicstus == null) {
          this.sicstus = makeAIPlay(2, this.dificulty);
        } else {
          if (this.sicstus.status != 0) {
            let aimove = this.sicstus.responseText;
            aimove = aimove.split('[')[1].split(']')[0].split(',');
            let origin = aimove[0].toUpperCase() + aimove[1];
            this.pickedSoldier = ''
            for (let i = 82; i <= 103; i++) {
              let search = this.graph.selectablePieces[i];
              if (this.graph.nodes[search].coords == origin) {
                this.pickedSoldier = search;
                break;
              }
            }
            let destination = aimove[2].toUpperCase() + aimove[3];
            this.sicstus = getBoard();
            this.history.push(this.pickedSoldier + "-" + origin + "-" + destination);
            this.gameState = this.state.P2SpotSelect;
          }
        }
        break;
      case this.state.P2SpotSelect:
        this.responseValidate(2);
        break;
      case this.state.P1SpotSelect:
        if (this.sId) {
          if (this.graph.nodes[this.sId].piecetype == '1') {
            this.graph.nodes[this.pickedSoldier].selectable = false;
            this.pickedSoldier = this.sId;
            this.graph.nodes[this.sId].selectable = true;
          } else if (this.graph.nodes[this.sId].piecetype == 's') {
            if (this.sicstus == null) {
              this.sicstus = makePlay(1, this.graph.nodes[this.pickedSoldier].coords, this.graph.nodes[this.sId].coords)
              this.history.push(this.pickedSoldier + "-" + this.graph.nodes[this.pickedSoldier].coords + "-" + this.graph.nodes[this.sId].coords)
            }
          }
        } else if (this.sicstus) {
          this.responseValidate(1);
        }
        break;
      case this.state.P1BoardValidate:
        this.handleElimination(1);
        break;
      case this.state.P2BoardValidate:
        this.handleElimination(2);
        break;
        break;
      case this.state.P1Victory:
        this.finalizeGame(1)
        break;
      case this.state.P2Victory:
        this.finalizeGame(2)
        break;
      case this.state.Draw:
        this.finalizeGame(3)
        break;
      default:
        break;
    }
    this.sId = null;
  }
}
/*
* Gerir o modo de jogo maquina-maquina
*/
XMLscene.prototype.mmPlay = function () {
  switch (this.gameState) {
    case this.state.P1PieceSelect:
      if (this.sicstus == null) {
        this.sicstus = makeAIPlay(1, this.dificulty);
      } else {
        if (this.sicstus.status != 0) {
          let aimove = this.sicstus.responseText;
          aimove = aimove.split('[')[1].split(']')[0].split(',');
          let origin = aimove[0].toUpperCase() + aimove[1];
          this.pickedSoldier = ''
          for (let i = 82; i <= 103; i++) {
            let search = this.graph.selectablePieces[i];
            if (this.graph.nodes[search].coords == origin) {
              this.pickedSoldier = search;
              break;
            }
          }
          let destination = aimove[2].toUpperCase() + aimove[3];
          this.sicstus = getBoard();
          this.history.push(this.pickedSoldier + "-" + origin + "-" + destination);
          this.gameState = this.state.P1SpotSelect;
        }
      }
      break;
    case this.state.P1SpotSelect:
      this.responseValidate(1);
      break;
    case this.state.P2PieceSelect:
      if (this.sicstus == null) {
        this.sicstus = makeAIPlay(2, this.dificulty);
      } else {
        if (this.sicstus.status != 0) {
          let aimove = this.sicstus.responseText;
          aimove = aimove.split('[')[1].split(']')[0].split(',');
          let origin = aimove[0].toUpperCase() + aimove[1];
          this.pickedSoldier = ''
          for (let i = 82; i <= 103; i++) {
            let search = this.graph.selectablePieces[i];
            if (this.graph.nodes[search].coords == origin) {
              this.pickedSoldier = search;
              break;
            }
          }
          let destination = aimove[2].toUpperCase() + aimove[3];
          this.sicstus = getBoard();
          this.history.push(this.pickedSoldier + "-" + origin + "-" + destination);
          this.gameState = this.state.P2SpotSelect;
        }
      }
      break;
    case this.state.P2SpotSelect:
      this.responseValidate(2);
      break;
    case this.state.P1BoardValidate:
      this.handleElimination(1);
      break;
    case this.state.P2BoardValidate:
      this.handleElimination(2);
      break;
    case this.state.P1Victory:
      this.finalizeGame(1)
      break;
    case this.state.P2Victory:
      this.finalizeGame(2)
      break;
    case this.state.Draw:
      this.finalizeGame(3)
      break;
    default:
      break;
  }
}
/*
* Fazer replay do jogo
*/
XMLscene.prototype.rPlay = function () {
  if (this.rcounter == this.lasthistory.length && (this.gameState == this.state.P1BoardValidate || this.gameState == this.state.P2BoardValidate)) {
    this.finalizeReplay();
  } else {
    let action = 0;
    if (this.rcounter < this.lasthistory.length) {
      action = this.lasthistory[this.rcounter].split("-")
    }
    let coords;
    switch (this.gameState) {
      case this.state.P1PieceSelect:
        this.pickedSoldier = action[0]
        coords = action[2]
        this.gameState = this.state.P1Animation;
        this.resetTimer();
        this.rcounter++
        this.graph.addMoveAnimation(coords, this.pickedSoldier)
        break;
      case this.state.P2PieceSelect:
        this.pickedSoldier = action[0]
        coords = action[2]
        this.gameState = this.state.P2Animation;
        this.resetTimer();
        this.rcounter++
        this.graph.addMoveAnimation(coords, this.pickedSoldier)
        break;
      case this.state.P1BoardValidate:
        this.gameState = this.state.P2PieceSelect;
        break;
      case this.state.P2BoardValidate:
        this.gameState = this.state.P1PieceSelect;
        break;
      default:
        break;
    }
  }
}
/*
*Finalizar um replay
*/
XMLscene.prototype.finalizeReplay = function () {
  if (this.curState == this.state.P1SpotSelect || this.curState == this.state.P1PieceSelect)
    this.gameState = this.state.P1PieceSelect;
  else
    this.gameState = this.state.P2PieceSelect;
  this.gameMode = this.oldGameMode;
  this.removedPieces = []
  for (let i = 0; i < 2; i++) {
    let ar = []
    for (let j = 0; j < 10; j++) {
      ar.push(this.oldEliminated[i][j].slice())
    }
    this.removedPieces.push(ar);
  }
  this.oldGameMode = null;
  this.curState = null;
  this.oldEliminated = null;
  let stt = this.savedStates[this.savedStates.length - 1];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 10; j++) {
      if (stt[i][j] !== ' ') {
        let piece = stt[i][j];
        let coords = stt[8][j][1].toUpperCase() + stt[i][10]
        let soldier = "";
        switch (piece[piece.length - 1]) {
          case 'W':
            soldier = 'soldierReiB'
            this.graph.nodes[soldier].coords = coords
            break;
          case 'B':
            soldier = 'soldierReiA'
            this.graph.nodes[soldier].coords = coords
            break;
          case 'w':
            soldier = 'soldier' + piece.split('w')[0] + 'B'
            this.graph.nodes[soldier].coords = coords
            break;
          case 'b':
            soldier = 'soldier' + piece.split('b')[0] + 'A'
            this.graph.nodes[soldier].coords = coords
            break;
          default:
            break;
        }
        this.graph.updatePosition(soldier);
      }
    }
  }
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 10; j++) {
      if (this.removedPieces[i][j][1]) {
        this.graph.nodes[this.removedPieces[i][j][1]].coords = this.removedPieces[i][j][0]
        this.graph.updatePosition(this.removedPieces[i][j][1]);
      }
    }
  }
}
/*
*Finalizar jogo e preparar um novo
*/
XMLscene.prototype.finalizeGame = function (winner) {
  if (winner == 1) {
    document.getElementById("p1score").innerText = Number(document.getElementById("p1score").innerText) + 1;
  } else if (winner == 2) {
    document.getElementById("p2score").innerText = Number(document.getElementById("p2score").innerText) + 1;
  }
  if (winner != 3)
    document.getElementById("winner").innerText = "Vitória do jogador " + winner + "!";
  else
    document.getElementById("winner").innerText = "Empate! Ambos perdem";
  this.gameState = this.state.GameEnd;
  clearInterval(timerInterval);
  document.getElementById("enddiv").removeAttribute('hidden');
}
/*
*Replay game
*/
XMLscene.prototype.ReplayLastGame = function () {
  if (this.interactiveState()) {
    console.log(this.lasthistory)
    let oldState = this.savedStates[0];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 10; j++) {
        if (oldState[i][j] !== ' ') {
          let piece = oldState[i][j];
          let coords = oldState[8][j][1].toUpperCase() + oldState[i][10]
          let soldier = "";
          switch (piece[piece.length - 1]) {
            case 'W':
              soldier = 'soldierReiB'
              this.graph.nodes[soldier].coords = coords
              break;
            case 'B':
              soldier = 'soldierReiA'
              this.graph.nodes[soldier].coords = coords
              break;
            case 'w':
              soldier = 'soldier' + piece.split('w')[0] + 'B'
              this.graph.nodes[soldier].coords = coords
              break;
            case 'b':
              soldier = 'soldier' + piece.split('b')[0] + 'A'
              this.graph.nodes[soldier].coords = coords
              break;
            default:
              break;
          }
          this.graph.updatePosition(soldier);
        }
      }
    }
    this.curState = this.gameState; //Guardar uma referencia do estado a quando o replay
    this.oldGameMode = this.gameMode; //Guardar uma referencia do modo a quando o replay
    this.oldEliminated = [] //Guardar uma referencia das peças eliminadas
    for (let i = 0; i < 2; i++) {
      let ar = []
      for (let j = 0; j < 10; j++) {
        ar.push(this.removedPieces[i][j].slice())
        this.removedPieces[i][j][1] = null
      }
      this.oldEliminated.push(ar);
    }
    this.gameMode = this.mode.R;
    this.rcounter = 0;
    this.gameState = this.state.P1PieceSelect;
    if (this.pickedSoldier)
      this.graph.nodes[this.pickedSoldier].selectable = false;
    this.resetTimer();
  }
}
/*
* Check if the game is in an interactive state
*/
XMLscene.prototype.interactiveState = function () {
  if ((this.gameState == this.state.P1SpotSelect) || (this.gameState == this.state.P2SpotSelect) || (this.gameState == this.state.P1PieceSelect) || (this.gameState == this.state.P2PieceSelect))
    return true;
  return false;
}
/*
*Save the state of the current game
*/
XMLscene.prototype.saveState = function (soldier, origin, destination, serverBoard) {
  let oldState = this.savedStates[this.savedStates.length - 1].slice()
  let newState = []
  for (let i = 0; i < 9; i++) {
    newState.push(oldState[i].slice())
  }
  let row = 8 - Number(origin[1])
  let col = origin.charCodeAt(0) - 65
  newState[row][col] = ' '
  let id
  if (soldier.includes('A')) {
    if (soldier.includes('Rei'))
      id = 'B'
    else {
      id = soldier.split('soldier')[1].split('A')[0] + 'b'
    }
  } else {
    if (soldier.includes('Rei'))
      id = 'W'
    else {
      id = soldier.split('soldier')[1].split('B')[0] + 'w'
    }
  }
  row = 8 - Number(destination[1])
  col = destination.charCodeAt(0) - 65
  newState[row][col] = id
  this.savedStates.push(newState)
  console.log(this.savedStates)
  //Parse do tabuleiro recebido do servidor
  this.serverBoard = [];
  let aux = [];
  for (let i = 2; i < serverBoard.length; i++) {
    if ('[],'.indexOf(serverBoard[i]) > -1) {
      continue;
    }
    if ('wWbB '.indexOf(serverBoard[i]) > -1) {
      aux.push(serverBoard[i]);
      continue;
    }
    if ('12345678'.indexOf(serverBoard[i]) > -1) {
      this.serverBoard.push(aux.slice());
      aux = [];
      continue;
    }
    break;
  }
  console.log(this.serverBoard);
}
/*
* Generate a randomMove
*/
XMLscene.prototype.makeRandomMove = function () {
  if (this.gameState == this.state.P1SpotSelect || this.gameState == this.state.P1PieceSelect) {
    if (this.sicstus == null) {
      this.sicstus = makeAIPlay(1, '1');
    } else {
      if (this.sicstus.status != 0) {
        let aimove = this.sicstus.responseText;
        aimove = aimove.split('[')[1].split(']')[0].split(',');
        let origin = aimove[0].toUpperCase() + aimove[1];
        this.pickedSoldier = ''
        for (let i = 82; i <= 103; i++) {
          let search = this.graph.selectablePieces[i];
          if (this.graph.nodes[search].coords == origin) {
            this.pickedSoldier = search;
            break;
          }
        }
        let destination = aimove[2].toUpperCase() + aimove[3];
        this.sicstus = getBoard();
        this.history.push(this.pickedSoldier + "-" + origin + "-" + destination);
        this.gameState = this.state.P1SpotSelect;
      }
    }
  } else if (this.gameState == this.state.P2SpotSelect || this.gameState == this.state.P2PieceSelect) {
    if (this.sicstus == null) {
      this.sicstus = makeAIPlay(2, '1');
    } else {
      if (this.sicstus.status != 0) {
        let aimove = this.sicstus.responseText;
        aimove = aimove.split('[')[1].split(']')[0].split(',');
        let origin = aimove[0].toUpperCase() + aimove[1];
        this.pickedSoldier = ''
        for (let i = 82; i <= 103; i++) {
          let search = this.graph.selectablePieces[i];
          if (this.graph.nodes[search].coords == origin) {
            this.pickedSoldier = search;
            break;
          }
        }
        let destination = aimove[2].toUpperCase() + aimove[3];
        this.sicstus = getBoard();
        this.history.push(this.pickedSoldier + "-" + origin + "-" + destination);
        this.gameState = this.state.P2SpotSelect;
      }
    }
  }
}
/*
* Debug end of game states
*/
XMLscene.prototype.DebugWinP1 = function () {
  console.log("Setting player 1 victory..")
  this.gameState = this.state.P1Victory;
}
XMLscene.prototype.DebugWinP2 = function () {
  console.log("Setting player 2 victory..")
  this.gameState = this.state.P2Victory;
}
XMLscene.prototype.DebugDraw = function () {
  console.log("Setting a draw..")
  this.gameState = this.state.Draw;
}
/*
* Obter um index valido para guardar peças eliminadas
*/
XMLscene.prototype.getEliSpot = function (Player, id) {
  let ar = Player == '1' ? this.removedPieces[0] : this.removedPieces[1];
  let sp = '';
  for (let i = 0; i < 10; i++) {
    if (ar[i][1] == null) {
      sp = ar[i][0];
      ar[i][1] = id;
      break;
    }
  }
  return sp;
}
/*
* Manage the game timer
*/
XMLscene.prototype.manageTimer = function (scene) {
  if (this.gameState != this.state.P1Animation && this.gameState != this.state.P2Animation) {

    if (Number(this.timerTag.innerText) > 1) {
      this.timerTag.innerText = Number(this.timerTag.innerText) - 1
    }
    else if (Number(this.timerTag.innerText) == 0) {
      this.makeRandomMove()
    }
  }
}
/*
* Reset the timer
*/
XMLscene.prototype.resetTimer = function () {
  this.timerTag.innerText = this.timer
}
/*
*Undo into last state
*/
XMLscene.prototype.Undo = function () {
  if ((this.interactiveState()) && (this.savedStates.length > 1) && (this.gameMode != this.mode.R)) {
    let undoState;
    if (this.gameState == this.state.P1PieceSelect || this.gameState == this.state.P1SpotSelect)
      undoState = this.state.P2PieceSelect;
    else
      undoState = this.state.P1PieceSelect;
    if (this.pickedSoldier)
      this.graph.nodes[this.pickedSoldier].selectable = false;
    this.savedStates.pop();
    let oldState = this.savedStates[this.savedStates.length - 1]
    setBoard(oldState);
    this.history.pop();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 10; j++) {
        if (oldState[i][j] !== ' ') {
          let piece = oldState[i][j];
          let coords = oldState[8][j][1].toUpperCase() + oldState[i][10]
          let soldier = "";
          switch (piece[piece.length - 1]) {
            case 'W':
              soldier = 'soldierReiB'
              this.graph.nodes[soldier].coords = coords
              break;
            case 'B':
              soldier = 'soldierReiA'
              this.graph.nodes[soldier].coords = coords
              break;
            case 'w':
              soldier = 'soldier' + piece.split('w')[0] + 'B'
              this.graph.nodes[soldier].coords = coords
              break;
            case 'b':
              soldier = 'soldier' + piece.split('b')[0] + 'A'
              this.graph.nodes[soldier].coords = coords
              break;
            default:
              break;
          }
          this.graph.updatePosition(soldier);
          for (let k = 0; k < 2; k++) {
            for (let l = 0; l < 10; l++) {
              if (soldier == this.removedPieces[k][l][1])
                this.removedPieces[k][l][1] = null;
            }
          }
        }
      }
    }
    this.gameState = undoState;
    this.resetTimer();
  }
}
/*
* Log picked object
*/
XMLscene.prototype.logpick = function () {
  if (this.pickMode == false) {
    if (this.pickResults != null && this.pickResults.length > 0) {
      for (var i = 0; i < this.pickResults.length; i++) {
        var obj = this.pickResults[i][0];
        if (obj) {
          var customId = this.pickResults[i][1];
          console.log("Picked object: " + obj + ", with pick id " + customId);
          if (this.gameState != this.state.GameSetup) {
            this.sId = this.graph.selectablePieces[customId];
            console.log(this.sId);
          }
        }
      }
      this.pickResults.splice(0, this.pickResults.length);
    }
  }
}
/**
 * Displays the scene.
 */
XMLscene.prototype.display = function () {
  this.logpick();
  this.clearPickRegistration();
  // ---- BEGIN Background, camera and axis setup

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  this.pushMatrix();

  if (this.graph.loadedOk) {
    // Applies initial transformations.
    this.multMatrix(this.graph.initialTransforms);

    // Draw axis
    this.axis.display();

    var i = 0;
    for (var key in this.lightValues) {
      if (this.lightValues.hasOwnProperty(key)) {
        if (this.lightValues[key]) {
          this.lights[i].setVisible(true);
          this.lights[i].enable();
        }
        else {
          this.lights[i].setVisible(false);
          this.lights[i].disable();
        }
        this.lights[i].update();
        i++;
      }
    }
    if (this.endGame) {
      if (this.endGame.status != 0 && !this.endGame.responseText.includes('OK')) {
        if (this.endGame.responseText.includes('DRAW')) {
          this.gameState = this.state.Draw;
        } else if (this.endGame.responseText.includes('Player 1 Lost')) {
          this.gameState = this.state.P1Victory
        } else if (this.endGame.responseText.includes('Player 2 Lost')) {
          this.gameState = this.state.P2Victory
        }
        console.log(this.endGame.responseText);
        this.endGame = null;
      }
    }
    //Process game cycle
    switch (this.gameMode) {
      case this.mode.R:
        this.rPlay()
        break;
      case this.mode.HH:
        this.hhPlay()
        break;
      case this.mode.HM:
        this.hmPlay()
        break;
      case this.mode.MM:
        this.mmPlay()
        break;
      default:
        break;
    }
    // Displays the scene.
    this.counter += 0.5;
    this.graph.normScale = this.getNorm(this.counter);
    this.graph.displayScene();
    this.moveCamera();
    //this.timeNow = this.date.getTime()-this.timeStart

  }
  else {
    // Draw axis
    this.axis.display();
  }


  this.popMatrix();

  // ---- END Background, camera and axis setup

}
XMLscene.prototype.moveCamera = function () {
  if (this.movingCamera) {
    switch (this.currentCamera) {
      case 0:
        this.cameraTimer += 1
        this.camera.orbit(CGFcameraAxis.Y, 0.1)
        if (this.cameraTimer > 10) {
          this.currentCamera = 1
          this.movingCamera = false
          this.cameraTimer = 0
        }
        break;
      case 1:
        this.cameraTimer += 1
        this.camera.orbit(CGFcameraAxis.Y, -0.11)
        this.camera.translate(vec4.fromValues(0, 21, -18, 0))
        this.camera.setTarget(vec3.fromValues(0, 0, 0))
        if (this.cameraTimer == 10) {
          this.camera.setPosition(vec3.fromValues(0, 90, 1))
          console.log(this.camera.position)
          this.currentCamera = 2
          this.movingCamera = false
          this.cameraTimer = 0
        }
        break;
      case 2:
        this.cameraTimer += 1
        this.camera.setPosition(vec3.fromValues(0, 90 - (4 * this.cameraTimer), 1 + (4.9 * this.cameraTimer)))
        //this.camera.setTarget(vec3.fromValues(0,0,0))
        if (this.cameraTimer == 10) {
          this.currentCamera = 0
          this.movingCamera = false
          this.cameraTimer = 0
        }
        break;
      default:
        break;

    }
  }
}
XMLscene.prototype.getNorm = function (x) {
  return ((Math.sin(x) + 1) / 4) + 0.8;
}
