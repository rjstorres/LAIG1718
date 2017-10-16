/**
 * NURBSPatch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function NURBSPatch(scene, args, xml) {
	CGFobject.call(this,scene);
	this.initBuffers();
};

NURBSPatch.prototype = Object.create(CGFobject.prototype);
NURBSPatch.prototype.constructor=NURBSPatch;

NURBSPatch.prototype.initBuffers = function () {


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
