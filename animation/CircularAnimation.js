/**
 * CircularAnimation
 * @constructor
 */
function CircularAnimation(scene, args) {
    (args.length == 5 && args[0] === Array && args[1] === Number &&
        args[2] === Number && args[3] === Number && args[4] === Number) ? null : console.log("Error");
    this.scene = scene;
    this.args = args;
    this.center = args[0];
    this.radius = args[1];
    this.initialAngle = args[2]*Math.PI/180;
    this.rotationAngle = args[3]*Math.PI/180;
    this.speed = args[4];
    this.span=this.rotationAngle*this.radius/this.speed; //calculate the total time needed
    this.endFlag=false;
    this.endMat;
    /*Temporario
      Guardar tempo de animação*/
    this.timeStart = new Date().getTime()/1000 /*Conversão para segundos*/
    this.time = 0; /*Tempo da animação em segundos*/
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor=CircularAnimation;

CircularAnimation.prototype.animate = function () {
    var matAnimation= mat4.create();

    if(endFlag)
        return endMat;

    if (this.time>this.span){
        this.time=this.span;
        this.endFlag=true;
    }

    mat4.translate(matAnimation,matAnimation,this.center);
    mat4.rotateY(matAnimation,matAnimation,this.initialAngle+(this.time/this.span)*this.rotationAngle);
    mat4.translate(matAnimation,matAnimation,[this.radius,0,0]);
    
    if(this.rotationAngle>0)
        mat4.rotateY(matAnimation,matAnimation,Math.PI);
    
    this.time = new Date().getTime()/1000 - this.timeStart
    this.endMat=matAnimation;
    
    return matAnimation;
};

CircularAnimation.prototype.clone = function () { 
    return new CircularAnimation(this.scene, this.args);
  }