attribute vec2 a_position;
attribute vec2 a_texcoord;
attribute float a_textureid;
attribute float a_depth;

uniform mat4 u_modelProjectionMatrix;
uniform vec2 u_skinSizes[SKIN_NUM];

varying vec2 v_texcoord;
varying float v_textureid;

void main() {
    int textureid = int(a_textureid);
    gl_Position = u_modelProjectionMatrix*vec4(a_position, a_depth, 1.0);
    v_texcoord = a_texcoord/u_skinSizes[textureid];
    v_textureid = a_textureid;
}