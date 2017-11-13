/**
 * Sphere
 * @constructor
 */
function Sphere(scene, args){
 	CGFobject.call(this,scene);

	this.radius = args[0];
	this.sections = args[1];
	this.partsPerSections = args[2];
  this.radiusStep = (this.radius*2)/this.sections
  this.tStep = 1/this.sections;
  this.vStep = 1/this.partsPerSections;

  this.degStepXY = (2*Math.PI)/this.partsPerSections;
  this.degStepZ = (Math.PI)/(this.sections);

 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

 Sphere.prototype.initBuffers = function() {

  let sc = 0;
  let st = 0;
  this.vertices = []
  this.indices = []
  this.normals = []
  this.texCoords = [];

  //Assumindo uma esfera em centro 0,0,0
  //Vertice inferior
  let texPoleOffset = this.vStep/2;
  for(var i = 0; i < this.partsPerSections; i++){
    this.vertices.push(0,0,-this.radius);
    this.normals.push(0,0,-1);
    this.texCoords.push(texPoleOffset+(this.vStep*i), 0);
  }
  //Adicionar os vertices "piso a piso": 0<floor<sections
  for(floor = 1; floor < this.sections; floor++){
    st = this.tStep * floor;
    //Calcular a ordenada Z da latitude atual
    let z = -this.radius + this.radiusStep*floor; //Radius porque estamos a começar de baixo.
    //Calcular raio da latitude atual
    let latRadius = Math.sqrt(Math.pow(this.radius,2)-Math.pow(z,2));
    for(i = 0; i <= this.partsPerSections; i++){ //Adicionar vertice repetido devido a texturas
      sc = this.vStep*i;
      var x = latRadius*Math.cos(this.degStepXY * i);
      var y = latRadius*Math.sin(this.degStepXY * i);
      this.vertices.push(x,y,z);
      //Adicionar informação de normais
      this.normals.push(x/this.radius, y/this.radius, z/this.radius
        /*Math.cos(this.degStepXY * i),
        Math.sin(this.degStepXY * i),
        -1*Math.cos(this.degStepZ * floor)*/
      );
      //[!]Informação de texturas
    this.texCoords.push(
        sc, st
      )
    }
  }

  //Adicionar vertice no top da esfera
  for(var i = 0; i < this.partsPerSections; i++){
    this.vertices.push(0,0,this.radius);
    this.normals.push(0,0,1);
    this.texCoords.push(texPoleOffset+(this.vStep*i), 1);
  }
  //Criar a malha poligonal
  //Parte baixa da esfera
  for(var i = 0; i < this.partsPerSections; i++){
    this.indices.push(
      i, this.partsPerSections + i + 1 , this.partsPerSections + i
    );
  }
  //Secções intermediarias
  for(var floor = 0; floor < this.sections - 2; floor++){ //offset -2 pois as secções topo e baixo são lidadas de diferente forma
    let row = (this.partsPerSections + 1) * floor; //offset + 1 devido a vertices repetidos
    for(var i = 1; i <= this.partsPerSections; i++){
      let pivot = i+row+this.partsPerSections-1
      this.indices.push(
        pivot, pivot+this.partsPerSections+2, pivot+this.partsPerSections+1,
        pivot, pivot+1, pivot+this.partsPerSections+2
      );
    }
  }
  //Parte de topo da esfera
  let top = (this.vertices.length/3) - (this.partsPerSections + 1);
  for(i = top-this.partsPerSections-1, j=0; j <= this.partsPerSections; i++,j++){
    this.indices.push(
      top+j, i, i+1
    );
  }
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};
