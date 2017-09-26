/**
 * SemiSphere
 * @constructor
 */
 function SemiSphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;
  this.tCoord = 0;
  this.sCoord = 0;

 	this.initBuffers();
 };

 SemiSphere.prototype = Object.create(CGFobject.prototype);
 SemiSphere.prototype.constructor = SemiSphere;

 SemiSphere.prototype.initBuffers = function() {


  this.vertices = []
  this.indices = []
  this.normals = []
  this.texCoords = [];
  this.trig = (2*Math.PI)/this.slices;
  this.trigz = (Math.PI/2)/this.stacks;

  for(j = 0; j < this.stacks; j++){
    for(i = 0; i < this.slices; i++){
      this.vertices.push(0.5*Math.cos(this.trig*i)*Math.cos(this.trigz*j), 0.5*Math.sin(this.trig*i)*Math.cos(this.trigz*j),0.5*Math.sin(this.trigz*j));
      this.normals.push(Math.cos(this.trig*i), Math.sin(this.trig*i),Math.sin(this.trigz*j));
      this.texCoords.push(
        this.sCoord, this.tCoord
      ),
      this.sCoord++;
    }
    this.tCoord++;
    this.sCoord = 0;
  }
  for(j = 0; j < this.stacks - 1; j++){
    for(i = 0; i < this.slices; i++){
      if(i == this.slices - 1){
        this.indices.push(
        i+(j*this.slices), this.slices+(j*this.slices), i+this.slices+(j*this.slices),
        (j*this.slices), this.slices+(j*this.slices), i+(j*this.slices));
      }else{
      this.indices.push(
        i+(j*this.slices), i+this.slices+1+(j*this.slices), i+this.slices+(j*this.slices),
        i+1+(j*this.slices), i+this.slices+1+(j*this.slices), i+(j*this.slices)
      );
    }
    }
  }

  this.vertices.push(0,0,0.5);
  this.normals.push(0,0,1);
  this.texCoords.push(this.sCoord, this.tCoord + 1);

  for(i = 0; i < this.slices; i++){
    if(i == this.slices - 1){
      this.indices.push(
        this.slices*this.stacks, this.slices*this.stacks - 1, this.slices*this.stacks - this.slices
      );
    }else{
      this.indices.push(
        this.slices*this.stacks , this.slices*this.stacks - (i+2), this.slices*this.stacks - (i+1)
      );
  }

  }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
