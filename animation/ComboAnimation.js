/**
 * ComboAnimation
 * @constructor
 */
function ComboAnimation(scene, args) {
    this.animations = args;
};

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor=ComboAnimation;

ComboAnimation.prototype.animate = function (t) {

};
