// The MIT License
// Copyright © 2020 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOISE FROM https://www.shadertoy.com/view/tldSRj
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
// You should replace this hash by one that you like and meets
// your needs. This one is here just as example and should not
// be used in production.
vec2 g(vec2 n) { return sin(n.x * n.y * vec2(12, 17) + vec2(1, 2)); }
//vec2 g( vec2 n ) { return sin(n.x*n.y+vec2(0,1.571)); } // if you want the gradients to lay on a circle

float noise(vec2 p)
{
	const float kF = 2.0; // make 6 to see worms

	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(sin(kF * dot(p, g(i + vec2(0, 0)))),
			sin(kF * dot(p, g(i + vec2(1, 0)))), f.x),
		mix(sin(kF * dot(p, g(i + vec2(0, 1)))),
			sin(kF * dot(p, g(i + vec2(1, 1)))), f.x), f.y);
}

mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722,
	-0.09991, -0.33609, 0.43600,
	0.615, -0.5586, -0.05639);

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution;
	vec3 color = vec3(0.0);

	mat3 yuv2rgb = mat3(1.000 + cos(u_time), cos(1. * u_time) + 0.4 * sin(0.4 + u_time * 1.), 1.004 + 1. + sin(u_time),
		2.016, -0.39465, 0.2 * cos(u_time * 1.2 + 21.048),
		1.000 + cos(u_time * 2.) * 0.1, 1.928, -0.056);
	st -= 0.5;
	st *= 2.0;
	color = yuv2rgb * vec3(0.5, st.x, st.y);

	vec2 uv = st * vec2(u_resolution.x / u_resolution.y, 1.0);

	float f = 0.0;

	uv *= 6.304;
	uv += u_time;
	const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
	f = 0.5000 * noise(uv); uv = m * uv;
	f += 0.2500 * noise(uv); uv = m * uv;
	f += 0.1250 * noise(uv); uv = m * uv;
	f += 0.0625 * noise(uv); uv = m * uv;

	f = 0.5 + 0.5 * f;

	gl_FragColor = vec4(color * 0.4 + f * 0.4, 1.0);
}
