/**
 * Rectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Rectangle(scene, mins, maxs, mint, maxt) {
	CGFobject.call(this,scene);
	this.mins = mins || 0;
	this.maxs = maxs || 1;
	this.mint = mint || 0;
	this.maxt = maxt || 1;

	this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor=Rectangle;

Rectangle.prototype.initBuffers = function () {
	this.vertices = [
        -0.5,0.5,0, //0
        0.5,0.5,0, //1
        -0.5,-0.5,0, //2
        0.5,-0.5,0, //3
			];


	this.indices = [
        0, 2, 3,
        3, 1, 0,
		];

	this.normals = [
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1
	];
	this.texCoords = [
		this.mins,this.mint,
		this.maxs,this.mint,
		this.mins,this.maxt,
		this.maxs,this.maxt
	];


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
