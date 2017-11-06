/**
 * CircularAnimation
 * @constructor
 */
function CircularAnimation(scene, args) {
    (args.length == 5 && args[0] === Array && args[1] === Number && 
        args[2] === Number && args[3] === Number && args[4] === Number) ? null : console.log("Error");
    this.center = args[0];
    this.radius = args[1];
    this.initialAngle = this.radius(args[2]);
    this.rotationAngle = this.radius(args[3]);
    this.speed = args[4];
    this.span=null; //calculate the total time needed
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor=CircularAnimation;

CircularAnimation.prototype.animate = function (t) {
    var matAnimation= mat4.create();

    if (t>this.span)
        t=this.span;

    mat4.translate(matAnimation,matAnimation,this.center);
    mat4.rotateY(matAnimation,matAnimation,this.initialAngle+(t/this.span)*this.rotationAngle);
    mat4.translate(matAnimation,matAnimation,[this.radius,0,0]);
    if(this.rotationAngle>0)
        mat4.rotateY(matAnimation,matAnimation,MATH.PI);
    return matAnimation;
};


