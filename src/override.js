export const _calculateTransform = (rotationCenter) => {
    if (drawable._rotationTransformDirty) {
        const rotation = (270 - drawable._direction) * Math.PI / 180;

        // Calling rotationZ sets the destination matrix to a rotation
        // around the Z axis setting matrix components 0, 1, 4 and 5 with
        // cosine and sine values of the rotation.
        // twgl.m4.rotationZ(rotation, drawable._rotationMatrix);

        // twgl assumes the last value set to the matrix was anything.
        // Drawable knows, it was another rotationZ matrix, so we can skip
        // assigning the values that will never change.
        const c = Math.cos(rotation);
        const s = Math.sin(rotation);
        drawable._rotationMatrix[0] = c;
        drawable._rotationMatrix[1] = s;
        // drawable._rotationMatrix[2] = 0;
        // drawable._rotationMatrix[3] = 0;
        drawable._rotationMatrix[4] = -s;
        drawable._rotationMatrix[5] = c;
        // drawable._rotationMatrix[6] = 0;
        // drawable._rotationMatrix[7] = 0;
        // drawable._rotationMatrix[8] = 0;
        // drawable._rotationMatrix[9] = 0;
        // drawable._rotationMatrix[10] = 1;
        // drawable._rotationMatrix[11] = 0;
        // drawable._rotationMatrix[12] = 0;
        // drawable._rotationMatrix[13] = 0;
        // drawable._rotationMatrix[14] = 0;
        // drawable._rotationMatrix[15] = 1;

        drawable._rotationTransformDirty = false;
    }

    {
        const rotationCenter = rotationCenter;
        const center0 = rotationCenter[0];
        const center1 = rotationCenter[1];
        const scale0 = drawable._scale[0];
        const scale1 = drawable._scale[1];

        const rotationAdjusted = drawable._rotationAdjusted;
        rotationAdjusted[0] = (center0) * scale0 / 100;
        rotationAdjusted[1] = ((center1) * scale1 / 100) * -1;        
    }

    // rotationAdjusted[2] = 0;

    drawable._rotationCenterDirty = false;


    const modelMatrix = drawable._uniforms.u_modelMatrix;

    // twgl version of the following in function work.
    // twgl.m4.identity(modelMatrix);
    // twgl.m4.translate(modelMatrix, drawable._position, modelMatrix);
    // twgl.m4.multiply(modelMatrix, drawable._rotationMatrix, modelMatrix);
    // twgl.m4.translate(modelMatrix, drawable._rotationAdjusted, modelMatrix);
    // twgl.m4.scale(modelMatrix, scaledSize, modelMatrix);

    // Drawable configures a 3D matrix for drawing in WebGL, but most values
    // will never be set because the inputs are on the X and Y position axis
    // and the Z rotation axis. Drawable can bring the work inside
    // _calculateTransform and greatly reduce the ammount of math and array
    // assignments needed.

    const scale0 = drawable._scale[0] / 100;
    const scale1 = drawable._scale[1] / 100;
    const rotation00 = drawable._rotationMatrix[0];
    const rotation01 = drawable._rotationMatrix[1];
    const rotation10 = drawable._rotationMatrix[4];
    const rotation11 = drawable._rotationMatrix[5];
    const adjusted0 = drawable._rotationAdjusted[0];
    const adjusted1 = drawable._rotationAdjusted[1];
    const position0 = drawable._position[0];
    const position1 = drawable._position[1];

    // Commented assignments show what the values are when the matrix was
    // instantiated. Those values will never change so they do not need to
    // be reassigned.
    modelMatrix[0] = scale0 * rotation00;
    modelMatrix[1] = scale0 * rotation01;
    // modelMatrix[2] = 0;
    // modelMatrix[3] = 0;
    modelMatrix[4] = scale1 * rotation10;
    modelMatrix[5] = scale1 * rotation11;
    // modelMatrix[6] = 0;
    // modelMatrix[7] = 0;
    // modelMatrix[8] = 0;
    // modelMatrix[9] = 0;
    // modelMatrix[10] = 1;
    // modelMatrix[11] = 0;
    modelMatrix[12] = (rotation00 * adjusted0) + (rotation10 * adjusted1) + position0;
    modelMatrix[13] = (rotation01 * adjusted0) + (rotation11 * adjusted1) + position1;
    // modelMatrix[14] = 0;
    // modelMatrix[15] = 1;

    drawable._transformDirty = false;
}