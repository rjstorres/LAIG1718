/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
	this.graph = graph;
	this.args = graph.reader.getString(xmlelem, 'args');
	this.type = graph.reader.getString(xmlelem, 'type');
	this.primitive = null;

	switch (this.type) {
		case "triangle":
			this.primitive = new Triangle(this.graph.scene, this.args);
			break;
		case 'sphere':
			this.primitive = new Sphere(this.graph.scene, this.args);
			break;
		case 'cylinder':
			this.primitive = new Cylinder(this.graph.scene, this.args);
			break;
		case 'rectangle':
			this.primitive = new Rectangle(this.graph.scene, this.args);
			break;
		default:
			break;
	}

}

MyGraphLeaf.prototype.display = function(){
	this.primitive.display();
}
