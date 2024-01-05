attribute vec2 aposition;
attribute vec2 atexcoord;
attribute float atextureid;
//uniform mat4 u_projectionMatrix;
//uniform mat4 u_modelMatrix;
uniform mat4 u_modelProjectionMatrix;
uniform vec2 u_skinSize;
uniform vec2 u_skinSizes[SKIN_NUM];

varying vec2 v_texcoord;

void main() {
    gl_Position = u_modelProjectionMatrix*vec4(aposition, 0.0, 1.0);
    v_texcoord = atexcoord/u_skinSize;
}