/**
 * Triangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Triangle(scene, vertexCoordinates) {
	CGFobject.call(this, scene);
	this.vertexCoordinates = vertexCoordinates;
	this.texture = new CGFappearance(this.scene);
	this.texture.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function () {

	this.vertices = this.vertexCoordinates;

	this.indices = [
		0, 1, 2
	];

	//calculo de normais
	vectorU = [this.vertices[3] - this.vertices[0], this.vertices[4] - this.vertices[1], this.vertices[5] - this.vertices[2]];
	vectorV = [this.vertices[6] - this.vertices[0], this.vertices[7] - this.vertices[1], this.vertices[8] - this.vertices[2]];
	Normals = [
		(vectorU[1] * vectorV[2]) - (vectorU[2] * vectorV[1]),
		(vectorU[2] * vectorV[0]) - (vectorU[0] * vectorV[2]),
		(vectorU[0] * vectorV[1]) - (vectorU[1] * vectorV[0])
	];

	this.normals = [
		Normals[0], Normals[1], Normals[2],
		Normals[0], Normals[1], Normals[2],
		Normals[0], Normals[1], Normals[2]
	];

	this.texCoords = [
		0, 0,
		1, 0,
		0, 1,
		1, 1,
	];


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Triangle.prototype.setTextureCoords = function (afs, aft) {
	//Calcular distancias entre vértices
	let v = this.vertices; //Para não ter de escrever muito
	let dist = [-1, -1, -1]; //Init para error checking
	for (var i = 0; i < 3; i++) {
		let ov = (i + 1) % 3; //Para calcular dist 2 -> 0
		dist[i] = Math.sqrt(Math.pow(v[ov * 3] - v[i * 3], 2) + Math.pow(v[ov * 3 + 1] - v[i * 3 + 1], 2) + Math.pow(v[ov * 3 + 2] - v[i * 3 + 2], 2));
	}
	//Calculo de angulos
	let cosine = (Math.pow(dist[0], 2) + Math.pow(dist[2], 2) - Math.pow(dist[1], 2)) / (2 * dist[0] * dist[2])
	let sine = Math.sqrt(1 - Math.pow(cosine, 2));
	this.texCoords = [
		0, 1,
		dist[0] / afs, 1,
		(dist[0] - dist[1] * cosine) / afs, 1 - (dist[1] * sine) / aft
	]
	this.updateTexCoordsGLBuffers();
}
