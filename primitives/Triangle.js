/**
 * Triangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Triangle(scene, vertexCoordinates) {
	CGFobject.call(this,scene);
	this.vertexCoordinates = vertexCoordinates;
  this.texture = new CGFappearance(this.scene);
	this.texture.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

Triangle.prototype.initBuffers = function () {

	this.vertices = this.vertexCoordinates;

	this.indices = [
        0,2,1,
				0,1,2
		];

	this.normals = [
		0,0,1,
		0,0,1,
		0,0,1
	];

  this.texCoords = [
		0,0,
		1,0,
		0,1,
		1,1,
	];


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Triangle.prototype.setTextureCoords = function (afs,aft) {
	//Calcular distancias entre vértices
	let v = this.vertices; //Para não ter de escrever muito
	let dist = [-1,-1,-1]; //Init para error checking
	for(var i = 0; i < 3; i++){
		let ov = (i+1)%3; //Para calcular dist 2 -> 0
		dist[i] = Math.sqrt(Math.pow(v[ov*3]-v[i*3],2) + Math.pow(v[ov*3+1]-v[i*3+1],2) + Math.pow(v[ov*3+2]-v[i*3+2],2));
	}
	//Calculo de angulos
	let cosine = (Math.pow(dist[0],2) + Math.pow(dist[2],2) - Math.pow(dist[1],2))/(2*dist[0]*dist[2])
	let sine = Math.sqrt(1-Math.pow(cosine,2));
	this.texCoords=[
		0,0,
		dist[0]/afs,0,
		(dist[0]-dist[1]*cosine)/afs,(dist[1]*sine)/aft
	]
 	this.updateTexCoordsGLBuffers();
}
