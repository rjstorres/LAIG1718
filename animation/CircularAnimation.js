/**
 * CircularAnimation
 * @constructor
 */
function CircularAnimation(scene, args) {
    (args.length == 5 && args[0] === Array && args[1] === Number && 
        args[2] === Number && args[3] === Number && args[4] === Number) ? null : console.log("Error");
    this.center = args[0];
    this.radius = args[1];
    this.initialAngle = args[2];
    this.rotationAngle = args[3];
    this.speed = args[4];
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor=CircularAnimation;

CircularAnimation.prototype.animate = function (mat, t) {

};


