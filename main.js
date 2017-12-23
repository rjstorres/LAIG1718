//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

serialInclude(['../lib/CGF.js', 'XMLscene.js', '../graph/MySceneGraph.js',
			 '../graph/MyGraphNode.js', '../graph/MyGraphLeaf.js', 'MyInterface.js',
       './primitives/Rectangle.js', './primitives/Triangle.js', './primitives/Cylinder.js',
       './primitives/Sphere.js', './primitives/Circle.js', './primitives/FullCylinder.js',
       './primitives/NURBSPatch.js','animation/Animation.js', 'animation/LinearAnimation.js',
       'animation/CircularAnimation.js', 'animation/BezierAnimation.js', 'animation/ComboAnimation.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.getElementById("cgf"));
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);


    //Função para gerir a interface inicial e setup
    var startApp = function(e){
      console.log("start")
      //Recolha da informação
      let args = [];
      let cb = document.getElementsByName('cen');
      for (var i=0; i<cb.length; i++){
         if (cb[i].checked) {
            args.push(cb[i].value);
            break;
         }
      }
      let filename
      switch (args[0]) {
        case 'c1':
          filename = 'gameScene.xml'
          break;
        case 'c2':
          filename = 'gameScene2.xml'
          break;
        case 'c3':
          filename = 'gameScene3.xml'
          break;
        default:
          break;
      }
      cb = document.getElementsByName('modo');
      for (var i=0; i<cb.length; i++){
         if (cb[i].checked) {
            args.push(cb[i].value);
            break;
         }
      }
      cb = document.getElementsByName('dif');
      for (var i=0; i<cb.length; i++){
         if (cb[i].checked) {
            args.push(cb[i].value);
            break;
         }
      }
      args.push(document.getElementById('time').value)
      console.log(args)
      document.body.removeChild(document.body.childNodes[1])
      //Setup da cena segundo cenário escolhido
      myScene.interface.gui.close();
      delete myInterface;
      myInterface = new MyInterface();
      delete myScene;
      myScene = new XMLscene(myInterface, args[1], args[2], args[3]);
      app.setScene(myScene);
      app.setInterface(myInterface);
      myInterface.setActiveCamera(myScene.camera);
      delete myGraph;
      myGraph = new MySceneGraph(filename, myScene);
      myScene.gameState = myScene.state.P1PieceSelect;
      setInterval(myScene.manageTimer.bind(myScene), 1000);
      myScene.clearPickRegistration();
    }
    document.getElementById("startButton").onclick = startApp



    app.init();
    app.setScene(myScene);
    app.setInterface(myInterface);
    myInterface.setActiveCamera(myScene.camera)
  	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
	 var filename=getUrlVars()['file'] || "gameScene.xml";
  	// create and load graph, and associate it to scene.
  	// Check console for loading errors
	 var myGraph = new MySceneGraph(filename, myScene);
  	// start
    app.run();
}

]);
