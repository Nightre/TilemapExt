precision mediump float;

varying vec2 v_texcoord;
varying float v_textureid;
uniform sampler2D u_skins[SKIN_NUM];

void main() {
    int textureid = int(v_textureid);

    vec4 color = texture2D(u_skins[0], v_texcoord);
    if (color.a == 0.0) discard;
    //color = vec4(0.1,0.1,0.1,1);
    gl_FragColor = color;
}