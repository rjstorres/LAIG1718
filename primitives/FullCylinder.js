/**
 * FullCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function FullCylinder(scene, args) {
  CGFobject.call(this, scene);
  this.scene = scene;
  this.args = args;
  this.cap1 = null;
  if (args[5]) {
    this.cap1 = new Circle(scene, args[4], args[0])
  }
  args[6] ? this.cap2 = new Circle(scene, args[4], 0) : null;
  this.cylinder = new Cylinder(scene, args);
}

FullCylinder.prototype = Object.create(CGFobject.prototype);
FullCylinder.prototype.constructor = FullCylinder;


FullCylinder.prototype.display = function () {

  this.cylinder.display();
  if (this.args[5]) {
    this.scene.pushMatrix();
    this.scene.scale(this.args[2], this.args[2], 1);
    this.cap1.display();
    this.scene.popMatrix();
  }
  if (this.args[6]) {
    this.scene.pushMatrix();
    this.scene.scale(this.args[1], this.args[1], 1);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.cap2.display();
    this.scene.popMatrix();
  }

};
