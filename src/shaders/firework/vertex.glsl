uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;

// Save this function
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main(){

  // New position, b/c position is a attribute and can't be modified
  vec3 newPosition = position;

  // Exploding
  float explodingProgress = remap(uProgress, 0.0, 0.1, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
  newPosition = mix(vec3(0.0), newPosition, explodingProgress); //apply

  // Falling
    float fallingProgress = remap(uProgress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * .2; // apply

  // Position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
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
