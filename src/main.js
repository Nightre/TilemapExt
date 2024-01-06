import Scratch from "Scratch";
import blockInfo from "./info";
import TileMap from "./tilemap";
import vs from "./shader/vs.vs?raw"
import fs from "./shader/fs.fs?raw"
import { getDrawable } from "./uitl";
import { SHOW_MODE } from "./constant"

// TODO:获取tile，设置tile超出是糊有bug

// TODO: 代码有待优化，赶时间做的，drawcall用elementdraw来优化
class TileMapExt {
    constructor() {
        this.vm = Scratch.vm;
        this.renderer = this.vm.renderer;
        this.twgl = this.renderer.exports.twgl;
        this.gl = this.renderer.gl

        this.originalDrawThese = this.renderer._drawThese;

        this.renderer._drawThese = (..._arguments) => {
            _arguments.unshift(this) // 在参数前加个自生，这样drawThese就可以获取到我自生的东西

            this.drawThese.call(this.renderer, ..._arguments) // 调用
        };

        this.maxTextureUnits = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        this.tileChanged = false
        // 设置宏，获取该设备支持的最多纹理单元，批量渲染时需要
        this.tileProgramInfo = this.twgl.createProgramInfo(this.gl, [
            '#define SKIN_NUM ' + this.maxTextureUnits + '\n' + vs,
            '#define SKIN_NUM ' + this.maxTextureUnits + '\n' + fs
        ]);
    }

    // 修改scratch-render webglrender的_drawThese函数
    // 我修改的地方都标注了 ”By: Nights“
    drawThese(ext, drawables, drawMode, projection, opts = {}, canSkip = true/* 是否允许跳过绘制 By: Nights */) {
        const gl = this._gl;
        
        // 检测是否需要tilemap（碰到x颜色GPU运算，选取颜色等都不渲染）
        // 根据我的研究，scratch-render在碰撞像素>一个cpu检测MAX值时会使用GPU颜色检测
        // 但CPU不会，为了避免这种恐怖bug，检测是否等于scratch物体的projection，是的化就绘制
        const allowSpecialDraw = projection == this._projection // By:nights

        let currentShader = null;

        const framebufferSpaceScaleDiffers = (
            'framebufferWidth' in opts && 'framebufferHeight' in opts &&
            opts.framebufferWidth !== this._nativeSize[0] && opts.framebufferHeight !== this._nativeSize[1]
        );

        const numDrawables = drawables.length;
        for (let drawableIndex = 0; drawableIndex < numDrawables; ++drawableIndex) {
            const drawableID = drawables[drawableIndex];
            const twgl = ext.twgl // By:nights 获取twgl

            // If we have a filter, check whether the ID fails
            if (opts.filter && !opts.filter(drawableID)) continue;

            const drawable = this._allDrawables[drawableID];
            /** @todo check if drawable is inside the viewport before anything else */

            // Hidden drawables (e.g., by a "hide" block) are not drawn unless
            // the ignoreVisibility flag is used (e.g. for stamping or touchingColor).
            if (!drawable.getVisible() && !opts.ignoreVisibility) continue;

            // drawableScale is the "framebuffer-pixel-space" scale of the drawable, as percentages of the drawable's
            // "native size" (so 100 = same as skin's "native size", 200 = twice "native size").
            // If the framebuffer dimensions are the same as the stage's "native" size, there's no need to calculate it.
            const drawableScale = framebufferSpaceScaleDiffers ? [
                drawable.scale[0] * opts.framebufferWidth / this._nativeSize[0],
                drawable.scale[1] * opts.framebufferHeight / this._nativeSize[1]
            ] : drawable.scale;

            // If the skin or texture isn't ready yet, skip it.
            if (!drawable.skin || !drawable.skin.getTexture(drawableScale)) continue;

            // Skip private skins, if requested.
            if (opts.skipPrivateSkins && drawable.skin.private) continue;

            if (drawable.skipDraw && canSkip) {
                // 有时候可能需要跳过绘制
                // 比如在tilemap图层里面的绘制的，普通的draw就允许跳过，如果在tilemap层里就禁止跳过
                continue
            }

            if (drawable.specialDraw) { //By:nights 检测是否是特殊绘制
                if (allowSpecialDraw) {
                    // 退出scratch绘制
                    this._doExitDrawRegion();

                    drawable.specialDraw(projection, drawableScale, drawMode, opts);
                    // 因为每次特殊绘制都会绘制scratch精灵
                    // 没必要自己再弄个区域，直接设为null
                    this._regionId = null;
                }
            }
            const uniforms = {};

            let effectBits = drawable.enabledEffects;
            effectBits &= Object.prototype.hasOwnProperty.call(opts, 'effectMask') ? opts.effectMask : effectBits;
            const newShader = this._shaderManager.getShader(drawMode, effectBits);

            // Manually perform region check. Do not create functions inside a
            // loop.
            if (this._regionId !== newShader) {
                this._doExitDrawRegion();
                this._regionId = newShader;

                currentShader = newShader;
                gl.useProgram(currentShader.program);
                twgl.setBuffersAndAttributes(gl, currentShader, this._bufferInfo);
                Object.assign(uniforms, {
                    u_projectionMatrix: projection
                });
            }

            Object.assign(uniforms,
                drawable.skin.getUniforms(drawableScale),
                drawable.getUniforms());

            // Apply extra uniforms after the Drawable's, to allow overwriting.
            if (opts.extraUniforms) {
                Object.assign(uniforms, opts.extraUniforms);
            }
            if (drawable.specialDrawZ) {
                // 设置 Z 图层，直接修改modelMatrix
                uniforms.u_modelMatrix[14] = drawable.specialDrawZ
                //debugger
                //twgl.m4.translate(uniforms.u_modelMatrix, [0, 0, 0.1], uniforms.u_modelMatrix)

            }
            if (uniforms.u_skin) {
                twgl.setTextureParameters(
                    gl, uniforms.u_skin, {
                    minMag: drawable.skin.useNearest(drawableScale, drawable) ? gl.NEAREST : gl.LINEAR
                }
                );
            }

            twgl.setUniforms(currentShader, uniforms);
            twgl.drawBufferInfo(gl, this._bufferInfo, gl.TRIANGLES);
        }

        this._doExitDrawRegion();
        this._regionId = null;
    }

    getInfo() {
        return blockInfo(Scratch);
    }
    initTileMap(drawable) {
        if (!drawable.tileMap) {
            // 初始化视点
            drawable.tileViewX = 0
            drawable.tileViewY = 0
            drawable.skipDraw = false
            drawable.tileMap = new TileMap(this)
        }
    }
    show(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)

        // 显示精灵？
        if (args.SHOW_MODE == SHOW_MODE.SPRITE) {
            // drawThese里面是通过该属性判断是否绘制tilemap的
            drawable.specialDraw = null
        } else {
            drawable.specialDraw = (projection, drawableScale, drawMode, opts) => {
                // TODO:改成option
                drawable.tileMap.tileMapRender(
                    this.tileProgramInfo,
                    this.twgl,
                    this.renderer,
                    drawable,
                    projection,
                    drawableScale,
                    drawMode,
                    opts
                )
            }
        }

        this.dirty()
    }
    setTileSize(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)

        // 重新设置大小
        drawable.tileMap.tileSize = {
            x: args.W,
            y: args.H
        }
        // 需要重新绘制一遍
        this.dirty()
    }
    setMapSize(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 重新设置大小
        drawable.tileMap.setMapSize(args.W, args.H)
        // 需要重新绘制一遍
        this.dirty()
    }
    setTileView(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 更新摄像机
        drawable.tileMap.view = {
            x: args.X,
            y: args.Y
        }
        // 需要重新绘制一遍
        this.dirty()
    }


    createTileSet(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)

        // 创建
        drawable.tileMap.createTileSet(args.TILE_ID, {
            texture: args.TEXTURE,
            x: args.X, // pos
            y: args.Y,
            w: args.W, // size
            h: args.H,
            ox: args.OX, // offset
            oy: args.OY,
        })
    }
    deleteTileSet(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 检测tileset中是否有该ID的tileset？
        if (drawable.tileMap.tileSet[args.TILE_ID]) {
            // 如果有就删除
            drawable.tileMap.deleteTileSet(args.TILE_ID)
        }
    }
    deleteAllTileSet(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 清空所有tileset
        drawable.tileMap.deleteAllTileSet()
    }
    getAllTileSet(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 获取tileset数据
        return JSON.stringify(drawable.tileMap.tileSet)
    }





    getTile(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 检测目标tile是否存在
        if (this.isTileExsit(drawable, args)) return '-1'
        // 获取tile
        return drawable.tileMap.getTile(args.X - 1, args.Y - 1)
    }
    setTile(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 检测目标tile是否存在
        if (this.isTileExsit(drawable, args)) return '-1'
        // 设置tile
        drawable.tileMap.setTile(args.X - 1, args.Y - 1, args.TILE_ID)
        // 需要重新绘制一遍
        // 不能每次调用都绘制因为可能在同一帧里面调用多次
        this.tileChanged = true
        this.renderer.dirty = true
    }
    clearTile(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 检测目标tile是否存在
        if (this.isTileExsit(drawable, args)) return '-1'

        // 设置tile
        drawable.tileMap.setTile(args.X - 1, args.Y - 1, -1)
        // 需要重新绘制一遍
        this.dirty()
    }
    clearAllTile(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // 清除
        drawable.tileMap.clearAllTile()
        // 需要重新绘制一遍
        this.dirty()
    }

    tileToPos(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // TODO:

        return '{}'
    }
    posToTile(args, util) {
        // 获取 drawable 并检测tilemap是否需要初始化
        const drawable = this.getDrawableInit(util)
        // TODO:

        return '{}'
    }
    joinTileMap(args, uitl) {
        // 获取 drawable
        const drawable = getDrawable(uitl, this.renderer)
        // 获取要加入的tilemap
        const target = this.renderer._allDrawables[args.TILEMAP]
        // 获取我之前的tilemap
        const parent = drawable.tileMapParent
        if (parent && parent.tileMap) {// 如果有就先退出
            parent.tileMap.removeChild(drawable)
        }
        drawable.skipDraw = false
        if (!target || !target.tileMap) return // 如果目标存在
        drawable.skipDraw = true
        drawable.tileMapParent = target // 那么就设置为父
        target.tileMap.addChild(drawable) // 并加入
    }
    setLayerInTileMap() { }
    dirty() {
        this.renderer.dirty = true
        this.renderer.draw()
    }
    /**
     * 获取drawable并且检测tilemap是否初始化，若未初始化则
     * 初始化
     */
    getDrawableInit(util) {
        const d = getDrawable(util, this.renderer)
        this.initTileMap(d)
        return d
    }
    /**
     * 更具drawable获取tilemap并检测该tile是否存在
     */
    isTileExsit(drawable, args) {
        return drawable.tileMap.isElementExist(drawable.tileMap, args.X - 1, args.Y - 1)
    }
}

Scratch.extensions.register(new TileMapExt());