#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;
uniform float normScale;

void main() {
	/*if (coords.x > 0.0)
		gl_FragColor =  coords;
	else
	{
		gl_FragColor.rgb = abs(coords.xyz);
		gl_FragColor.a = 1.0;
	}*/
	gl_FragColor = vec4((normScale-0.8)/0.5,coords.y - coords.y*(normScale/1.3),coords.z - coords.z*(normScale/1.3),1.0);
}
