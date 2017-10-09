/**
 * FullCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function FullCylinder(scene, args) {
	CGFobject.call(this,scene);
  this.scene = scene;
  this.args = args;
	(args[5] || args[6]) ? this.cap = new Circle(scene,args[4]) : null;
  this.cylinder = new Cylinder(scene, args);
};

FullCylinder.prototype = Object.create(CGFobject.prototype);
FullCylinder.prototype.constructor=FullCylinder;


FullCylinder.prototype.display = function() {

    if(this.args[5]){
      this.scene.pushMatrix();
      this.scene.translate(0,0,this.args[0]);
      this.scene.scale(this.args[2],this.args[2],1);
      this.cap.display()
      this.scene.popMatrix();
    }
    if(this.args[6]){
      this.scene.pushMatrix();
      this.scene.scale(this.args[1],this.args[1],1);
      this.scene.rotate(Math.PI,1,0,0)
      this.cap.display()
      this.scene.popMatrix();
    }
    this.cylinder.display();

};
