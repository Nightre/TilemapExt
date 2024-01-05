precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_skin;
uniform sampler2D u_skins[SKIN_NUM];


void main() {
    vec4 color = texture2D(u_skin, v_texcoord);
    if (color.a == 0.0) discard;
    //color = vec4(0.1,0.1,0.1,1);
    gl_FragColor = color;
}