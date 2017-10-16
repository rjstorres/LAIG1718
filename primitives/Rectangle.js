/**
 * Rectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Rectangle(scene, vertexCoordinates) {
	CGFobject.call(this,scene);
	this.vertexCoordinates = vertexCoordinates;
	this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor=Rectangle;

Rectangle.prototype.initBuffers = function () {
	this.vertices = [
        		this.vertexCoordinates[0], this.vertexCoordinates[1], 0,
				this.vertexCoordinates[0], this.vertexCoordinates[3],0,
				this.vertexCoordinates[2], this.vertexCoordinates[3],0,
				this.vertexCoordinates[2], this.vertexCoordinates[1],0
			];


	this.indices = [
        0, 1, 2,
        3, 0, 2
		];

	this.normals = [
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1
	];
	this.texCoords = [
		0,0, //mins, mint
		1,0, //maxs, mint
		0,1, //mins, maxt
		1,1 //maxs, maxt
	];


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Rectangle.prototype.setTextureCoords = function (afs, aft) {
	this.height = Math.abs(this.vertexCoordinates[3] - this.vertexCoordinates[1]);
	this.width = Math.abs(this.vertexCoordinates[2] - this.vertexCoordinates[0]);
	this.texCoords=[
		0,0,
		0,this.height/aft,
		this.width/afs,this.height/aft,
		this.width/afs,0
	];

	this.updateTexCoordsGLBuffers();
}
