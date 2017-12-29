/**
 * Cylinder
 * @constructor
 */
function Cylinder(scene, args) {
  CGFobject.call(this, scene);

  this.height = args[0];
  this.bRadius = args[1];
  this.tRadius = args[2];
  this.sections = args[3];
  this.partsPerSections = args[4];
  this.tStep = 1 / this.sections;
  this.vStep = 1 / this.partsPerSections;

  this.partHeight = this.height / this.sections;
  this.radiusStep = (this.tRadius - this.bRadius) / (this.sections);

  this.trig = (2 * Math.PI) / this.partsPerSections;
  this.trigz = (2 * Math.PI) / this.sections;

  this.tCoord = 0;
  this.sCoord = 0;

  this.initBuffers();
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function () {


  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

  for (var i = 0, radius = this.bRadius; i <= this.sections; i++ , radius = this.bRadius + (this.radiusStep * i)) {
    this.tCoord = this.tStep * i;
    for (var j = 0; j <= this.partsPerSections; j++) {
      this.sCoord = this.vStep * j;
      var x = radius * Math.cos(this.trig * j);
      var y = radius * Math.sin(this.trig * j);
      this.vertices.push(x, y, i * this.partHeight);
      this.normals.push(
        x / radius,
        y / radius,
        0
      );
      this.texCoords.push(
        this.sCoord, this.tCoord
      );
    }

  }

  var offset = 0;
  for (var i = 0; i < this.sections; i++) {
    offset = i * (this.partsPerSections + 1);
    for (var j = 0; j < this.partsPerSections; j++) {
      this.indices.push(
        j + offset, j + 1 + offset, j + this.partsPerSections + 1 + offset,
        j + 1 + offset, j + this.partsPerSections + 2 + offset, j + this.partsPerSections + 1 + offset
      );
    }
  }

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
