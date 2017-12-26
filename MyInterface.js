 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)

    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
}

MyInterface.prototype.addSelectableGroup = function(nodes){
  var group = this.gui.addFolder("Selectables");
  group.open();
  for (var i = 0; i < nodes.length; i++) {
      this.scene.selectableNodes[nodes[i]] = false;
      group.add(this.scene.selectableNodes, nodes[i]);
  }
}
MyInterface.prototype.addControls = function(){
  this.gui.add(this.scene, 'ChangeCamera');
  this.gui.add(this.scene, 'Undo')
  this.gui.add(this.scene, 'DebugRemove')
  this.gui.add(this.scene, 'DebugWinP1')
  this.gui.add(this.scene, 'DebugWinP2')
}
MyInterface.prototype.addReplay = function(){
  this.gui.add(this.scene, 'ReplayLastGame')
}
