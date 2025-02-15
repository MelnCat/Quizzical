#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722,
                    -0.09991, -0.33609, 0.43600,
                    0.615, -0.5586, -0.05639);

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    
mat3 yuv2rgb = mat3(1.000 + cos(u_time), cos(1. * u_time) + 0.4 * sin(0.4 + u_time * 1.), 1.004 + 1. + sin(u_time),
                    2.016, -0.39465, 0.2 * cos(u_time * 1.2 + 21.048),
                    1.000 + cos(u_time * 2.) * 0.1, 1.928, -0.056);
    st -= 0.5;
    st *= 2.0;
    color = yuv2rgb * vec3(0.5, st.x, st.y);

    gl_FragColor = vec4(color,1.0);
}
