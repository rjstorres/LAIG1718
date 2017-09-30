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
	/*for(var i = 0; i < this.vertexCoordinates.length; i+=2){
		this.vertices = this.vertices.concat(
				[this.vertexCoordinates[i], this.vertexCoordinates[i+1], 0]
		);
	}*/
	
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
