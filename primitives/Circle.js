/**
 * Circle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Circle(scene, slices) {
	CGFobject.call(this,scene);
  this.slices = slices;
	this.initBuffers();
};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor=Circle;

Circle.prototype.initBuffers = function () {
  this.trig = (2*Math.PI)/this.slices;
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

  for(i = 0; i <= this.slices; i ++){
    this.vertices.push(
      Math.cos(this.trig*i),
      Math.sin(this.trig*i),
      0
    );
    this.normals.push(
      0,
      0,
      1
    );
    this.texCoords.push(
      0.5*Math.sin(this.trig*i) + 0.5,
      0.5*Math.cos(this.trig*i) + 0.5
    )
  }
  this.vertices.push(
    0,0,0
  );
  this.normals.push(
    0,0,1
  );
  this.texCoords.push(0.5,0.5);
  for(i = 0; i < this.slices; i++){
    this.indices.push(
      i, i + 1, this.slices
    );
  }

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
