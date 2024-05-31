uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;

void main(){

  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  // Final position
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize * uResolution.y * aSize;
  // apply perspective
  gl_PointSize *= 1.0 /  - viewPosition.z; // This allows the points to increase size on zoom
}

/*
  NOTE:
    In the standard shader material we have acces to 3 matrices
      1) uniform mat4 projectionMatrix;
        - This is used to calculate the final gl_position
      2) uniform mat4 viewMatrix;
        - This is added to the modelPosition to create the view Position
      3) uniform mat4 modelMatrix;
        - This is used to calculate the modelPostion by adding
          a vec4 with the position (also supplied) along with a scaling
          factor 'w' (1.0 is a defualt)

*/
