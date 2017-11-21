/**
 * ComboAnimation
 * @constructor
 */
function ComboAnimation(scene, args) {
    this.scene = scene;
    this.args = args;
    this.ComboAnimationsID = args;
    this.currAnimation=null;
    this.endFlag=false;
    this.counter=0;
};

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor=ComboAnimation;

ComboAnimation.prototype.animate = function () {
    if(this.currAnimation==null){
        this.currAnimation=this.scene.graph.animations[this.ComboAnimationsID[this.counter]].clone();
    }

    var mat= this.currAnimation.animate();

    if(this.currAnimation.endFlag){
        this.currAnimation=null;
        this.counter++;
    }

    if(this.counter>=this.ComboAnimationsID.lenght)
        this.endFlag=true;
    
    return mat;
};

ComboAnimation.prototype.clone = function () { 
    return new ComboAnimation(this.scene, this.args);
}
