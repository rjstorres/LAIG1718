/**
 * Cylinder
 * @constructor
 */
 function Cylinder(scene, args) {
 	CGFobject.call(this,scene);

  this.height = args[0];
  this.bRadius = args[1];
  this.tRadius = args[2];
  this.sections = args[3];
  this.partsPerSections = args[4];

  this.partHeight = this.height/this.sections;
  this.radiusStep = (this.tRadius - this.bRadius)/(this.sections + 1);

  this.trig = (2*Math.PI)/this.partsPerSections;
  this.trigz = (2*Math.PI)/this.sections;

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

  for(i = 0, radius = this.bRadius; i <= this.sections; i++, radius = this.bRadius+(this.radiusStep*i)){
    for(j = 0; j <= this.partsPerSections; j ++){
      this.vertices.push(
        radius*Math.cos(this.trig*j),
        radius*Math.sin(this.trig*j),
        i*this.partHeight
      );
      this.normals.push(
        Math.cos(this.trig*j),
        Math.sin(this.trig*j),
        Math.sin(this.trigz*j)
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
  for(i = 0; i < this.sections; i++){
    offset = i*(this.partsPerSections+1);
    for(j = 0; j < this.partsPerSections; j++){
      this.indices.push(
        j+offset, j+1+offset, j+this.partsPerSections+1+offset,
        j+1+offset, j+this.partsPerSections+2+offset, j+this.partsPerSections+1+offset
      );
    }
  }

  console.log(this.vertices);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 Cylinder.prototype.setTextureCoords = function (s,t) {
   //Todo setamplif factor
 	this.updateTexCoordsGLBuffers();
 }
