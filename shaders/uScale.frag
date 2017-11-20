#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;
uniform float normScale;
uniform float normScaleMax;

void main() {
	/*if (coords.x > 0.0)
		gl_FragColor =  coords;
	else
	{
		gl_FragColor.rgb = abs(coords.xyz);
		gl_FragColor.a = 1.0;
	}*/
	gl_FragColor = vec4(cos(coords.x)/4.0 + (normScale/normScaleMax),coords.y - coords.y*(normScale/normScaleMax),coords.z - coords.z*(normScale/normScaleMax),1.0);
}
