/**
 * Cylinder
 * @constructor
 */
 function Cylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;
  this.tCoord = 0;
  this.sCoord = 0;

 	this.initBuffers();
 };

 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Cylinder;

 Cylinder.prototype.initBuffers = function() {


  this.vertices = []
  this.indices = []
  this.normals = []
  this.texCoords = []
  this.trig = (2*Math.PI)/this.slices;

  for(i = 0; i < this.stacks + 1; i++){
    for(j = 0; j <= this.slices; j ++){
      this.vertices.push(
        0.5*Math.cos(this.trig*j),
        0.5*Math.sin(this.trig*j),
        i
      );
      this.normals.push(
        Math.cos(this.trig*j),
        Math.sin(this.trig*j),
        0
      );
      this.texCoords.push(
        this.sCoord, this.tCoord
      ),
      this.sCoord++;
    }
    this.tCoord++;
    this.sCoord = 0;
  }
  var offset = 0;
  for(i = 0; i < this.stacks; i++){
    offset = i*(this.slices+1);
    for(j = 0; j < this.slices; j++){
      this.indices.push(
        j+offset, j+1+offset, j+this.slices+1+offset,
        j+1+offset, j+this.slices+2+offset, j+this.slices+1+offset
      );
    }
  }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
