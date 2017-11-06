/**
 * LinearAnimation
 * @constructor
 */
function LinearAnimation(scene,args) {
  (args.length == 2 && args[0] === Array && args[1] === Number) ? null : console.log("Error");
  this.controlPoints = args[0];
  this.speed = args[1];
  this.currentPoint = this.controlPoints[0];
  this.delta = this.calculateDelta(this.controlPoints, this.speed);
  this.unitVectors = this.calculateUnits(this.controlPoints);
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor=LinearAnimation;


LinearAnimation.prototype.animate = function(mat, t){
  //multMatrix(mat, delta*t)

};

LinearAnimation.prototype.calculateDelta = function(traj, speed){
  let length = 0;
  for(var i = 0; i < traj.length - 1; i++){ //obter magnitudes de todos os control points
    v1 = traj[i];
    v2 = traj[i+1];
    var mag = Math.sqrt(
      Math.pow((v2[0] - v1[0]),2) +
      Math.pow((v2[1] - v1[1]),2) +
      Math.pow((v2[2] - v1[2]),2)
    );
    length += mag;
  }
  return length/speed; //Calcular distancia a percorrer por segundo
}

LinearAnimation.prototype.calculateUnits = function(traj){ //Obter direcções do trajeto
  let uVectors = [];
  for(var i = 0; i < traj.length - 1; i++){ //Calcular vetor unitário para cada ponto  de controlo
    v1 = traj[i];
    v2 = traj[i+1];
    vs = [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]];
    var mag = Math.sqrt(
      Math.pow((v2[0] - v1[0]),2) +
      Math.pow((v2[1] - v1[1]),2) +
      Math.pow((v2[2] - v1[2]),2)
    );
    uVec = [];
    for(var j = 0; j < 3; j++){
      uVec.push(vs[j]/mag);
    }
    uVectors.push(uVec); //Adicionar vetor unitário
  }
  return uVectors; //Retornar lista vetores unitários
}
