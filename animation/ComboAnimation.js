/**
 * ComboAnimation
 * @constructor
 */
function ComboAnimation(scene, args) {
    this.scene = scene;
    this.args = args;
    this.ComboAnimationsID = args;
    this.currAnimation = null;
    this.endFlag = false;
    this.counter = 0;
    this.endAnimationMatrix = mat4.create();
    mat4.identity(this.endAnimationMatrix);
}

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor = ComboAnimation;

ComboAnimation.prototype.animate = function () {
    if (this.endFlag)
        return this.endAnimationMatrix;

    else if (this.ComboAnimationsID.length > 0) {
        if (this.currAnimation == null) {
            this.currAnimation = this.scene.graph.animations[this.ComboAnimationsID[this.counter]].clone();
            this.currAnimation.restartTime();
        }

        var mat = this.currAnimation.animate();
        

        if (this.currAnimation.endFlag) {
            this.currAnimation = null;
            this.counter++;
            mat4.multiply(this.endAnimationMatrix, this.endAnimationMatrix, mat);
        }

        if (this.counter >= this.ComboAnimationsID.length)
            this.endFlag = true;

        mat4.multiply(mat, this.endAnimationMatrix, mat);
        return mat;
    }
}

ComboAnimation.prototype.clone = function () {
    return new ComboAnimation(this.scene, this.args);
}

ComboAnimation.prototype.restartTime = function () { };
