/**
 * NURBSPatch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function NURBSPatch(scene, args) {
	this.scene = scene;
  this.obj = null;
  this.uv = args.attributes[1].nodeValue.split(" ").map(Number);
  this.points = [];
  for(var i = 0; i < args.children.length; i++){
    let uArray = [];
    let cpoints = args.children[i].children
    for(var j = 0; j < cpoints.length; j++){
      uArray.push(
        [
          Number(cpoints[j].attributes[0].value),
          Number(cpoints[j].attributes[1].value),
          Number(cpoints[j].attributes[2].value),
          Number(cpoints[j].attributes[3].value)
        ]
      );
    }
    this.points.push(uArray);
  }
	this.init();
};

NURBSPatch.prototype.constructor=NURBSPatch;

NURBSPatch.prototype.init = function () {
  console.log(this.points);
  this.makeSurface(
    this.uv[0],
    this.uv[1],
    this.points
  );
};

NURBSPatch.prototype.makeSurface = function(degree1, degree2, controlvertexes){
  var knots1 = this.getKnotsVector(degree1);
  var knots2 = this.getKnotsVector(degree2);

  var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
  this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, 20, 20 );
}

NURBSPatch.prototype.getKnotsVector = function(degree){
  var v = new Array();
  for (var i=0; i<=degree; i++) {
  	v.push(0);
  }
  for (var i=0; i<=degree; i++) {
  	v.push(1);
  }
  return v;
}

NURBSPatch.prototype.display = function(){
  this.obj.display();
}
