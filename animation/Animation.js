/**
 * Base Animation class
 * @constructor
**/

function Animation(scene,args){
  this.timeStart = new Date().getTime()/1000;
  this.time = 0;
  this.endFlag = false;
}


Animation.prototype.animate = function(){
}

Animation.prototype.restartTime = function(){
    this.timeStart = new Date().getTime()/1000
}
