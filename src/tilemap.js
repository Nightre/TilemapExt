
function round(floor, x) {
    return floor ? Math.floor(x) : Math.ceil(x)
}

function splitJSON(jsonObj, chunkSize) {
    const keys = Object.keys(jsonObj);
    const chunks = [];

    for (let i = 0; i < keys.length; i += chunkSize) {
        const chunkKeys = keys.slice(i, i + chunkSize);
        const chunkObj = {};

        for (const key of chunkKeys) {
            chunkObj[key] = jsonObj[key];
        }

        chunks.push(chunkObj);
    }

    return chunks;
}

class TileMap {
    constructor(tileExt) {
        this.twgl = tileExt.twgl
        this.renderer = tileExt.renderer
        this.gl = tileExt.gl

        this.view = {
            x: 0,
            y: 0
        }
        this.tileSize = {
            x: 0,
            y: 0
        }
        this.mapSize = {
            x: 0,
            y: 0
        }
        this.tileSet = {}
        this.tileData = []
        this.buffer = this.gl.createBuffer()
        this.maxTextureUnits = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);

    }

    //TODO:drawable缩放
    tileMapRender(tileProgramInfo, twgl, renderer, drawable, projection, drawableScale) {
        const m4 = twgl.m4
        /**@type {WebGLRenderingContext} */
        const gl = renderer._gl // :3


        const scale = {
            x: drawable._scale[0] / 100,
            y: drawable._scale[1] / 100
        }

        // 获取Tile的宽度和高度
        const tileSize = this.tileSize
        // 获取drawable的位置，就是渲染点
        const viewPos = this.view

        // 要绘制的tile数量

        const drawSize = {
            x: Math.ceil(renderer._nativeSize[0] / (tileSize.x * scale.x)) + 2,
            y: Math.ceil(renderer._nativeSize[1] / (tileSize.y * scale.y)) + 2,
        }

        // 偏移值
        const offset = {
            x: viewPos.x % tileSize.x,
            y: viewPos.y % tileSize.y,
        }

        // tile从哪里开始渲染（viewPos从那个tile开始）
        const viewId = {
            x: round(viewPos.x > 0, viewPos.x / tileSize.x),
            y: round(viewPos.y > 0, viewPos.y / tileSize.y),
        }

        // 从offset开始的位置偏移
        const renderOffset = {
            x: 0,
            y: 0
        }
        let attr = []
        let count = 0
        /**
         * tileTextureData用于记录每个tile.texture需要绘制的数据
         */
        // {number:number[]}
        let tilesTextureData = {}

        const skin = drawable.skin

        for (let y = viewId.y; y < viewId.y + drawSize.y; y++) {// 从下向上渲染
            renderOffset.x = 0
            for (let x = viewId.x; x < viewId.x + drawSize.x; x++) {
                /*
                每个tile都单独
                0--1
                |\ |
                | \|
                3--2
                */
                if (x > this.mapSize.x - 1 || x < 0 || y < 0 || y > this.mapSize.y - 1) {

                } else {
                    // 检测是否存在这个tiledata里
                    if (!this.isElementExist(this.tileData, x, y)) {
                        renderOffset.x += tileSize.x
                        continue
                    }
                    const tileId = this.tileData[y][x]
                    const tile = this.tileSet[tileId]

                    if (!tile) {
                        renderOffset.x += tileSize.x
                        continue
                    }
                    let textureUnit = Object.keys(tilesTextureData).indexOf(tile.texture.toString())
                    if (textureUnit == -1) {
                        // tilesTextureData 还没创建待会才创建
                        textureUnit = Object.keys(tilesTextureData).length
                    }
                    textureUnit = textureUnit % this.maxTextureUnits


                    const offsetX = renderOffset.x + (tile.ox ?? 0)
                    const offsetY = renderOffset.y + (tile.oy ?? 0)


                    const pos = [
                        [offsetX         , offsetY         ,     tile.x         ,   tile.y         , textureUnit],
                        [offsetX + tile.w, offsetY         ,     tile.x + tile.w,   tile.y         , textureUnit],
                        [offsetX + tile.w, offsetY + tile.h,     tile.x + tile.w,   tile.y + tile.h, textureUnit],
                        [offsetX         , offsetY + tile.h,     tile.x         ,   tile.y + tile.h, textureUnit]
                    ]

                    attr.push(
                        ...pos[0],
                        ...pos[1],
                        ...pos[2],

                        ...pos[0],
                        ...pos[2],
                        ...pos[3],

                    )
                    count += 6
                    /**
                     * tileTextureData用于记录每个tile.texture需要绘制的数据
                     */
                    if (!tilesTextureData[tile.texture]) {
                        tilesTextureData[tile.texture] = {
                            count: 0,
                            buffer: []
                        }
                    }
                    tilesTextureData[tile.texture].count += 6
                    tilesTextureData[tile.texture].buffer.push(
                        ...pos[0],
                        ...pos[1],
                        ...pos[2],

                        ...pos[0],
                        ...pos[2],
                        ...pos[3],
                    )
                }
                renderOffset.x += tileSize.x

            }
            renderOffset.y += tileSize.y
        }

        const program = tileProgramInfo.program
        gl.useProgram(program)

        const modelMatrix = m4.copy(drawable.getUniforms().u_modelMatrix)

        // drawable的矩阵缩放会根据skin大小缩放（比如svgSkin的mip纹理每个skin都不同大小），但是tilemap不需要所以除掉
        const skinSize = drawable.skin.size
        modelMatrix[0] /= -skinSize[0]
        modelMatrix[1] /= -skinSize[0]

        modelMatrix[4] /= skinSize[1]
        modelMatrix[5] /= skinSize[1]

        // 矩阵变换
        modelMatrix[12] = (-offset.x) * (drawable._scale[0] / 100) + drawable._position[0];
        modelMatrix[13] = (offset.y) * (drawable._scale[1] / 100) + drawable._position[1];

        const unifrom = {
            u_modelProjectionMatrix: m4.multiply(projection, modelMatrix)
        }

        Object.assign(unifrom, skin.getUniforms(drawableScale))
        twgl.setUniforms(tileProgramInfo, unifrom)

        const allData = splitJSON(tilesTextureData, this.maxTextureUnits)
        
        for (const dataForDrawCall of allData) {
            // one drawcall
            let _count = 0
            let arr = []
            let skins = []
            let skinSizes = []

            for (const skinId in dataForDrawCall) {
                const data = dataForDrawCall[skinId]
                _count += data.count
                arr.concat(data.buffer)
            }

            this.bindBufferAndDraw(attr, _count, program, gl)


        }
        //gl.disable(gl.DEPTH_TEST)
        //this.bindBufferAndDraw(attr, count, program, gl)
        // 根据硬件所支持的最大纹理单元，来设置绘制
        //tileTextureData用于记录每个tile.texture需要绘制的数据


    }

    bindBufferAndDraw(attr, count, program, gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attr), gl.DYNAMIC_DRAW)

        // 设置 aposition 属性指针
        var apositionLoc = gl.getAttribLocation(program, "aposition");
        gl.vertexAttribPointer(apositionLoc, 2, gl.FLOAT, false, 4 * 5, 0);
        gl.enableVertexAttribArray(apositionLoc);

        // 设置 atexcoord 属性指针
        var atexcoordLoc = gl.getAttribLocation(program, "atexcoord");
        gl.vertexAttribPointer(atexcoordLoc, 2, gl.FLOAT, false, 4 * 5, 4 * 2);
        gl.enableVertexAttribArray(atexcoordLoc);

        // 设置 atextureid 属性指针
        var atexcoordLoc = gl.getAttribLocation(program, "atextureid");
        gl.vertexAttribPointer(atexcoordLoc, 1, gl.FLOAT, false, 4 * 5, 4 * 4);
        gl.enableVertexAttribArray(atexcoordLoc);

        gl.drawArrays(gl.TRIANGLES, 0, count)
    }

    setTile(x, y, t) {
        this.tileData[y][x] = t
    }
    getTile(x, y) {
        return this.tileData[y][x]
    }
    clearAllTile() {
        for (const y in this.tileData) {
            for (const x in this.tileData[y]) {
                this.setTile(x, y, -1)
            }
        }
    }
    setMapSize(w, h) {
        // 重设瓦片地图大小
        if (w == this.mapSize.x && h == this.mapSize.y) {
            // 大小一样，不修改
            console.log("大小一样，不修改")
            return
        }
        this.mapSize.x = w
        this.mapSize.y = h

        let newTileData = []
        for (let y = 0; y < h; y++) {
            let row = []
            for (let x = 0; x < w; x++) {
                // 如果原地图有就用原地图。如果超出了原地图那么就设为-1（空）
                if (y > this.tileData.length - 1) {
                    row.push(-1)
                    continue
                }
                // 判断x是否超出
                if (x > this.tileData[0].length - 1) {
                    row.push(-1)
                    continue
                }
                // 若没超出
                row.push(this.tileData[y][x])
            }
            newTileData.push(row)
        }
        // 修改
        this.tileData = newTileData
    }
    deleteTileSet(id) {
        delete this.tileSet[id]
    }
    createTileSet(id, data) {
        this.tileSet[id] = data
    }
    deleteAllTileSet() {
        this.tileSet = {}
    }
    isElementExist(arr, x, y) {
        if (x < arr.length && y < arr[x].length) {
            return true;  // 如果存在，返回 true
        } else {
            return false;  // 如果不存在，返回 false
        }
    }
}

export default TileMap

export function tileMapRender(tileProgramInfo, twgl, renderer, drawable, projection, drawableScale) {
    const m4 = twgl.m4
    /**@type {WebGLRenderingContext} */
    const gl = renderer._gl // :3

    const data = this
    if (!thisBuffer) {
        thisBuffer = gl.createBuffer()
        thisElementBuffer = gl.createBuffer()
        console.log("创建buffer")
    }

    const scale = {
        x: drawable._scale[0] / 100,
        y: drawable._scale[1] / 100
    }

    // 获取Tile的宽度和高度
    const tileSize = data.tileSize
    // 获取drawable的位置，就是渲染点
    const viewPos = data.view

    // 要绘制的tile数量
    const drawSize = {
        x: Math.ceil(renderer._nativeSize[0] / (tileSize.x * scale.x)) + 2,
        y: Math.ceil(renderer._nativeSize[1] / (tileSize.y * scale.y)) + 2,
    }

    // 偏移值
    const offset = {
        x: viewPos.x % tileSize.x,
        y: viewPos.y % tileSize.y,
    }

    // tile从哪里开始渲染（viewPos从那个tile开始）
    const viewId = {
        x: round(viewPos.x > 0, viewPos.x / tileSize.x),
        y: round(viewPos.y > 0, viewPos.y / tileSize.y),
    }

    // 从offset开始的位置偏移
    const renderOffset = {
        x: 0,
        y: 0
    }
    let attr = []
    let count = 0

    const skin = drawable.skin

    for (let y = viewId.y; y < viewId.y + drawSize.y; y++) {// 从下向上渲染
        renderOffset.x = 0
        for (let x = viewId.x; x < viewId.x + drawSize.x; x++) {

            let tile = {
                x: 0,
                y: 0,
                width: 18,
                height: 18
            }
            /*
            每个tile都单独
            0--1
            |\ |
            | \|
            3--2
            */
            if (x > 50 || x < 0 || y < 0 || y > 50) {

            } else {
                const anchorX = renderOffset.x + (tile.anchorX ?? 0)
                const anchorY = renderOffset.y + (tile.anchorY ?? 0)

                const pos = [
                    [anchorX, anchorY, tile.x, tile.y],
                    [anchorX + tile.width, anchorY, tile.x + tile.width, tile.y],
                    [anchorX + tile.width, anchorY + tile.height, tile.x + tile.width, tile.y + tile.height],
                    [anchorX, anchorY + tile.height, tile.x, tile.y + tile.height]
                ]

                attr.push(
                    ...pos[0],
                    ...pos[1],
                    ...pos[2],

                    ...pos[0],
                    ...pos[2],
                    ...pos[3],
                )
                count += 6
            }
            renderOffset.x += tileSize.x

        }
        renderOffset.y += tileSize.y
    }
    const program = tileProgramInfo.program
    gl.useProgram(program)

    gl.bindBuffer(gl.ARRAY_BUFFER, thisBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attr), gl.DYNAMIC_DRAW)

    // 设置 aposition 属性指针
    var apositionLoc = gl.getAttribLocation(program, "aposition");
    gl.vertexAttribPointer(apositionLoc, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.enableVertexAttribArray(apositionLoc);

    // 设置 atexcoord 属性指针
    var atexcoordLoc = gl.getAttribLocation(program, "atexcoord");
    gl.vertexAttribPointer(atexcoordLoc, 2, gl.FLOAT, false, 4 * 4, 4 * 2);
    gl.enableVertexAttribArray(atexcoordLoc);

    const modelMatrix = m4.copy(drawable.getUniforms().u_modelMatrix)

    // drawable的矩阵缩放会根据skin大小缩放（比如svgSkin的mip纹理每个skin都不同大小），但是tilemap不需要所以除掉
    const skinSize = drawable.skin.size
    modelMatrix[0] /= -skinSize[0]
    modelMatrix[1] /= -skinSize[0]

    modelMatrix[4] /= skinSize[1]
    modelMatrix[5] /= skinSize[1]

    // 矩阵变换
    modelMatrix[12] = (-offset.x) * (drawable._scale[0] / 100) + drawable._position[0];
    modelMatrix[13] = (offset.y) * (drawable._scale[1] / 100) + drawable._position[1];

    const unifrom = {
        u_modelProjectionMatrix: m4.multiply(projection, modelMatrix)
    }

    Object.assign(unifrom, skin.getUniforms(drawableScale))
    gl.activeTexture(gl.TEXTURE0)

    twgl.setUniforms(tileProgramInfo, unifrom)

    // TODO:或许可以改成drawElements以提升性能 :3
    gl.drawArrays(gl.TRIANGLES, 0, count)
}