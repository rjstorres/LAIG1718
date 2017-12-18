var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;
    this.lightValues = {};
    this.selectedShader = null; //Guardar o shader escolhido
    this.selectableNodes = {};
    this.normScale = 0;
    this.counter = 0;
    this.oldTime = new Date().getTime()
    //Camera stats
    this.ChangeCamera = function(){this.movingCamera = true}
    this.currentCamera = 0
    this.cameraTimer = 0
    this.movingCamera = false
    //Game stats
    /*Game State enumerator*/
    this.state = {P1PieceSelect: 1, P1SpotSelect: 2, AIPlay: 3,P2PieceSelect: 4, P2SpotSelect: 5}
    /*Game Coordinates enumerator*/
    this.rows = { "1": 0,"2": -3.7,"3": -7.4,"4": -11,"5": -14.7,"6": -18.3,"7": -22.2,"8": -25.9 }
    this.collumns = { "A":-16.6, "B":-13, "C":-9.3, "D":-5.7, "E":-2, "F":1.7, "G":5.3, "H":9, "I":12.7, "J":16.3}
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.enableTextures(true);
    this.setUpdatePeriod(17);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);

    this.setPickEnabled(true);
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.

    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];

            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();

            i++;
        }
    }

}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(0, 50, 50),vec3.fromValues(0, 0, 0));
}

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function()
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);

    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

    this.initLights();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);
    // Add Selectables Group
    this.interface.addSelectableGroup(this.graph.selectables);
    //this.timeStart = this.date.getTime() //Obter tempo de ínicio do programa
    this.interface.addCameraControl()
}
XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
					console.log("Picked object: " + obj + ", with pick id " + customId);
          let cur = this.graph.nodes[this.graph.selectablePieces[customId]].selectable;
          this.graph.nodes[this.graph.selectablePieces[customId]].selectable = cur ? false : true
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}
/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    this.logPicking();
    this.clearPickRegistration();
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

    if (this.graph.loadedOk)
    {
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

		// Draw axis
		this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        // Displays the scene.
        this.counter += 0.5;
        this.graph.normScale = this.getNorm(this.counter);
        this.graph.displayScene();
        this.moveCamera();
        //this.timeNow = this.date.getTime()-this.timeStart

    }
	else
	{
		// Draw axis
		this.axis.display();
	}


    this.popMatrix();

    // ---- END Background, camera and axis setup

}
XMLscene.prototype.moveCamera = function(){
  if(this.movingCamera){
    switch (this.currentCamera) {
      case 0:
        this.cameraTimer += 1
        this.camera.orbit(CGFcameraAxis.Y, 0.1)
        if(this.cameraTimer > 10){
          this.currentCamera = 1
          this.movingCamera = false
          this.cameraTimer = 0
        }
        break;
      case 1:
        this.cameraTimer += 1
        this.camera.orbit(CGFcameraAxis.Y, -0.11)
        this.camera.translate(vec4.fromValues(0,21,-18,0))
        this.camera.setTarget(vec3.fromValues(0,0,0))
        if(this.cameraTimer == 10){
          this.camera.setPosition(vec3.fromValues(0,90,1))
          console.log(this.camera.position)
          this.currentCamera = 2
          this.movingCamera = false
          this.cameraTimer = 0
        }
        break;
      case 2:
        this.cameraTimer += 1
        this.camera.setPosition(vec3.fromValues(0,90-(4*this.cameraTimer),1+(4.9*this.cameraTimer)))
        //this.camera.setTarget(vec3.fromValues(0,0,0))
        if(this.cameraTimer == 10){
          this.currentCamera = 0
          this.movingCamera = false
          this.cameraTimer = 0
        }
        break;
      default:
        break;

    }
  }
}
XMLscene.prototype.getNorm = function(x){
  return ((Math.sin(x) + 1)/4) + 0.8;
}
