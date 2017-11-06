/**
 * LinearAnimation
 * @constructor
 */
function LinearAnimation(scene,args) {
  (args.length == 2 && args[0] === Array && args[1] === Number) ? null : console.log("Error");
  this.date = scene.date;
  this.timeStart = new Date().getTime()/1000; //Conversão para segundos
  this.time = 0;
  this.controlPoints = args[0];
  this.endFlag = false;
  this.speed = args[1];
  this.currentPoint = 0;
  this.timePerPoint = [];
  this.timeOffset = 0;
  this.initMat = mat4.create();
  console.log(this.controlPoints[0])
  mat4.identity(this.initMat);
  mat4.translate(this.initMat, this.initMat, this.controlPoints[0])
  this.calculateTimePerPoint(this.controlPoints, this.speed);
  this.unitVectors = this.calculateUnits(this.controlPoints);
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor=LinearAnimation;


LinearAnimation.prototype.animate = function(){
  //TODO aplicar rotação
  if(!this.endFlag){ //Animação já terminou?
    if(this.time > this.timePerPoint[this.currentPoint]){ //Verificar se já excedemos o ponto de controlo atual
      this.currentPoint++;
      if(this.currentPoint == this.controlPoints.length - 1){ //Se chegamos ao fim retorna-mos a posição do ultimo ponto de controlo
        this.endFlag = true;
        mat4.identity(this.initMat);
        mat4.translate(this.initMat, this.initMat, this.controlPoints[this.controlPoints.length - 1]);
        return this.initMat;
      }
      mat4.identity(this.initMat); // Centrar no próximo ponto de controlo
      mat4.translate(this.initMat, this.initMat, this.controlPoints[this.currentPoint - 1]);

      this.timeOffset = this.timePerPoint[this.currentPoint - 1] //Apartir de cada novo ponto de controlo assumimos um deltaT inicial = 0
    }
    let cp = this.controlPoints[this.currentPoint]; //Ponto de controlo atual
    let uv = this.unitVectors[this.currentPoint]; //Vetor unitário de direcção entre os dois pontos de controlo
    var translate = [
      cp[0]+uv[0]*(this.time - this.timeOffset),
      cp[1]+uv[1]*(this.time - this.timeOffset),
      cp[2]+uv[2]*(this.time - this.timeOffset)
    ];
    let tMat = mat4.create();
    mat4.translate(tMat, this.initMat, translate);
    this.time = new Date().getTime()/1000 - this.timeStart;
    return tMat;
  }
  else{
    return this.initMat; //Após o fim this.initMat tem valor igual ao ultimo ponto de controlo.
  }

};

LinearAnimation.prototype.calculateTimePerPoint = function(traj, speed){
  let length = 0;
  let totalTime = 0;
  for(var i = 0; i < traj.length - 1; i++){ //obter magnitudes de todos os control points
    v1 = traj[i];
    v2 = traj[i+1];
    var mag = Math.sqrt(
      Math.pow((v2[0] - v1[0]),2) +
      Math.pow((v2[1] - v1[1]),2) +
      Math.pow((v2[2] - v1[2]),2)
    );
    length += mag;
    totalTime += mag/speed;
    this.timePerPoint.push(totalTime); //Quanto tempo passar em cada caminho entre ponto de controlo
  }
}

LinearAnimation.prototype.calculateUnits = function(traj){ //Obter direcções do trajeto
  let uVectors = [];
  for(var i = 0; i < traj.length - 1; i++){ //Calcular vetor unitário para cada ponto  de controlo
    v1 = traj[i];
    v2 = traj[i+1];
    vs = [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]];
    var mag = Math.sqrt(
      Math.pow((vs[0]),2) +
      Math.pow((vs[1]),2) +
      Math.pow((vs[2]),2)
    );
    uVec = [];
    for(var j = 0; j < 3; j++){
      uVec.push(vs[j]/mag);
    }
    uVectors.push(uVec); //Adicionar vetor unitário
  }
  return uVectors; //Retornar lista vetores unitários
}
