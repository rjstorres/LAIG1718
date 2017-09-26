/**
 * Triangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Triangle(scene) {
	CGFobject.call(this,scene);
  this.texture = new CGFappearance(this.scene);
	this.texture.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

Triangle.prototype.initBuffers = function () {
	this.vertices = [
        0,0.5,0,
        0.5,-0.5,0,
        -0.5,-0.5,0
			];


	this.indices = [
        0,2,1
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
