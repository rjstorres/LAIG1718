/**
 * BezierAnimation
 * @constructor
 */
function BezierAnimation(scene, args) {
    (args.length == 5 && args[0] === Array && args[1] === Array && args[2] === Array && 
        args[3] === Array && args[4] === Number) ? null : console.log("Error");
    this.P1=args[0];    
    this.P2=args[1];
    this.P3=args[2];
    this.P4=args[3];
    this.speed=args[4];
};

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor=BezierAnimation;

BezierAnimation.prototype.animate = function (t) {

};
