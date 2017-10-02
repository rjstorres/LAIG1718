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

  this.degStepXY = (2*Math.PI)/this.partsPerSections;
  this.degStepZ = (Math.PI)/this.sections;

	this.tCoord = 0;
  this.sCoord = 0;

 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

 Sphere.prototype.initBuffers = function() {


  this.vertices = []
  this.indices = []
  this.normals = []
  this.texCoords = [];

  //Assumindo uma esfera em centro 0,0,0
  //Vertice inferior
  this.vertices.push(0,0,-this.radius);
  this.normals.push(0,0,-1);
  //Adicionar os vertices "piso a piso": 0<floor<sections
  for(floor = 1; floor < this.sections; floor++){
    //Calcular a ordenada Z da latitude atual
    let z = -this.radius + this.radiusStep*floor; //Radius porque estamos a começar de baixo.
    //Calcular raio da latitude atual
    let latRadius = Math.sqrt(Math.pow(this.radius,2)-Math.pow(z,2));
    for(i = 0; i <= this.partsPerSections; i++){ //Adicionar vertice repetido devido a texturas
      this.vertices.push(
        latRadius*Math.cos(this.degStepXY * i),
        latRadius*Math.sin(this.degStepXY * i),
        z
      );
      //Adicionar informação de normais
      this.normals.push(
        Math.cos(this.degStepXY * i),
        Math.sin(this.degStepXY * i),
        Math.sin(this.degStepZ * i)
      );
      //[!]Informação de texturas
      this.texCoords.push(
        this.sCoord, this.tCoord
      ),
      this.sCoord++;
    }
    this.tCoord++;
    this.sCoord = 0;
  }
  //Adicionar vertice no top da esfera
  this.vertices.push(0,0,this.radius);
  this.normals.push(0,0,1);
  this.texCoords.push(this.sCoord, this.tCoord + 1);
  //Criar a malha poligonal
  //Parte baixa da esfera
  for(var i = 1; i <= this.partsPerSections; i++){
    this.indices.push(
      0, i + 1, i
    );
  }
  //Secções intermediarias
  for(var floor = 0; floor < this.sections - 2; floor++){ //offset -2 pois as secções topo e baixo são lidadas de diferente forma
    let row = (this.partsPerSections + 1) * floor; //offset + 1 devido a vertices repetidos
    for(var i = 1; i <= this.partsPerSections; i++){
      let pivot = i+row
      this.indices.push(
        pivot, pivot+this.partsPerSections+2, pivot+this.partsPerSections+1,
        pivot, pivot+1, pivot+this.partsPerSections+2
      );
    }
  }
  //Parte de topo da esfera
  let top = (this.vertices.length/3) - 1;
  for(i = top-this.partsPerSections-1; i < top - 1; i++){
    this.indices.push(
      top, i, i+1
    );
  }
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
