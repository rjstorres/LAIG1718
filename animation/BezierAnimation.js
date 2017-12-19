/**
 * BezierAnimation
 * @constructor
 */
function BezierAnimation(scene, args,dir) {
    (args.length == 5 && args[0] === Array && args[1] === Array && args[2] === Array &&
    args[3] === Array && args[4] === Number) ? null : console.log("Error");
    this.invertDir = dir ? true : false
    this.scene = scene;
    this.args = args;
    this.p4=args[3];
    this.speed=args[4];
    this.threshold = this.aproximateThreshold(args[0],args[1],args[2],args[3])//Distancia minima entre pontos
    this.path = []; //Estrutura de memória que vai guardar pontos de bezier igualmente espaçados
    this.length = 0; //Guardar dimensão da curva
    this.mapPoints(args[0], args[1], args[2], args[3]); //Preencher this.path com os pontos do caminho bezier
    this.dir = 0;
    this.initMat = mat4.create();
    mat4.identity(this.initMat);
    mat4.translate(this.initMat, this.initMat, args[0])
    this.endFlag = false;
    this.timeSpan = this.length/this.speed;
    this.timeStart = new Date().getTime()/1000;
    this.timeNow = 0;
}

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor=BezierAnimation;

BezierAnimation.prototype.animate = function () {
  if(!this.endFlag){
    let position = this.speed*this.timeNow;
    let ind = Math.trunc(position*this.path.length/this.length);
    let point = this.path[ind];
    mat = mat4.create();
    mat4.translate(mat, this.initMat, point);
    //mat4.rotateY(mat, mat,45*(Math.PI/180));
    mat4.rotateY(mat, mat,this.getDirectionAngle(point, this.path[ind+1]));
    this.timeNow = new Date().getTime()/1000 - this.timeStart;
    if(this.timeNow > this.timeSpan){
      this.endFlag = true;
      mat4.translate(this.initMat,this.initMat, this.p4);
      mat4.rotateY(this.initMat,this.initMat, this.dir);
    }
    return mat;
  }
  return this.initMat;
}

BezierAnimation.prototype.mapPoints = function (p1, p2, p3, p4) {
  var ld = this.linearDistance(p1, p2, p3, p4);
  if (ld > this.threshold) {
    var v = this.deCasteljau(p1, p2, p3, p4);
    this.mapPoints(v[0][0], v[0][1], v[0][2], v[0][3]);
    this.mapPoints(v[1][0], v[1][1], v[1][2], v[1][3]);
  } else {
    this.length += ld;
    this.path.push(p1);
    this.path.push(p2);
    this.path.push(p3);
    this.path.push(p4);
  }
}

BezierAnimation.prototype.linearDistance = function(p1,p2,p3,p4){//Calcular a distancia entre 4 pontos
  var d = Math.sqrt(
    Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[2] - p1[2], 2)
  );
  d += Math.sqrt(
    Math.pow(p3[0] - p2[0], 2) + Math.pow(p3[1] - p2[1], 2) + Math.pow(p3[2] - p2[2], 2)
  );
  d += Math.sqrt(
    Math.pow(p4[0] - p3[0], 2) + Math.pow(p4[1] - p3[1], 2) + Math.pow(p4[2] - p3[2], 2)
  );
  return d;
}

BezierAnimation.prototype.deCasteljau = function (p1, p2, p3, p4) { //Algoritmo de De Casteljau para aproximação de curvas de bezier
  var p = [[], []];
  var h = [(p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2, (p2[2] + p3[2]) / 2];
  p[0][0] = p1;
  var l = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];
  p[0][1] = l;
  p[0][2] = [(l[0] + h[0]) / 2, (l[1] + h[1]) / 2, (l[2] + h[2]) / 2];
  p[1][3] = p4;
  var r = [(p3[0] + p4[0]) / 2, (p3[1] + p4[1]) / 2, (p3[2] + p4[2]) / 2];
  p[1][2] = r;
  p[1][1] = [(r[0] + h[0]) / 2, (r[1] + h[1]) / 2, (r[2] + h[2]) / 2];
  var f = [(p[0][2][0] + p[1][1][0]) / 2, (p[0][2][1] + p[1][1][1]) / 2, (p[0][2][2] + p[1][1][2]) / 2];
  p[0][3] = f;
  p[1][0] = f;
  return p;
}

BezierAnimation.prototype.aproximateThreshold = function (a, b, c, d) { //Otimização do threshold
  var v = this.deCasteljau(a, b, c, d);
  return ((this.linearDistance(v[0][0], v[0][1], v[0][2], v[0][3]) +
    this.linearDistance(v[1][0], v[1][1], v[1][2], v[1][3])) / 5000) * this.speed;
}

BezierAnimation.prototype.getDirectionAngle = function (p1, p2) { //Calcular  angulo de direccao entre dois pontos e o eixo ZZ
  //Cálculo de magnitude
  let xdif = p2[0] - p1[0];
  let zdif = p2[2] - p1[2];
  let mag = Math.sqrt(
    Math.pow(xdif, 2) +
    Math.pow((p2[1] - p1[1]), 2) +
    Math.pow(zdif, 2)
  )
  //Cálculo de valor unitário para x e z
  let xu = xdif / mag;
  let zu = zdif / mag;
  var angle = Math.atan2(xu, zu);
  if(this.invertDir) angle+=Math.PI
  //Retorno do angulo
  if (isNaN(angle)) {
    return this.dir;
  } else {
    this.dir = angle;
    return angle;
  }
}

BezierAnimation.prototype.clone = function () {
  return new BezierAnimation(this.scene, this.args);
}


BezierAnimation.prototype.restartTime = function () {
  this.timeStart = new Date().getTime() / 1000;
}
