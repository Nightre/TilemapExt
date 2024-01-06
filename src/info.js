import { SHOW_MODE, POSITION } from "./constant"

export default (Scratch) => {
    return {
        id: 'ui',
        name: '瓦片地图',
        blocks: [
            {
                blockType: Scratch.BlockType.LABEL,
                text: '🍘 基本操作'
            },
            {
                opcode: 'show',
                blockType: Scratch.BlockType.COMMAND,
                text: '设置[SHOW_MODE]',
                arguments: {
                    SHOW_MODE: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'SHOW_MODE'
                    }
                }
            },
            {
                opcode: 'setTileSize',
                text: '设置瓦片大小 宽:[W]像素 高:[H]像素',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    W: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    H: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                }
            },
            {
                opcode: 'setMapSize',
                text: '设置地图大小 宽:[W]个瓦片 高:[H]个瓦片',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    W: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    H: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                }
            },
            {
                opcode: 'setTileView',
                text: '设置地图摄像机 x:[X] y:[Y]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                }
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: '📝 创建瓦片集'
            },
            {
                opcode: 'createTileSet',
                text: '创建从图片[TEXTURE]的 坐标:[X][Y] 大小:[W][H] 偏移:[OX][OY] 的瓦片命名为[TILE_ID]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    TEXTURE: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    W: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    H: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    OX: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    OY: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    TILE_ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "草坪",
                    }
                }
            },
            {
                opcode: 'deleteTileSet',
                text: '删除瓦片集名为[TILE_ID]的瓦片',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    TILE_ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "草坪",
                    },
                }
            },
            {
                opcode: 'deleteAllTileSet',
                text: '删除全部瓦片集',
                blockType: Scratch.BlockType.COMMAND,
            },
            {
                opcode: 'getAllTileSet',
                text: '所有瓦片集',
                blockType: Scratch.BlockType.REPORTER,
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: '📐 瓦片操作'
            },
            {
                opcode: 'getTile',
                text: '获取[LAYER]层的瓦片的[X][Y]的瓦片名称',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    LAYER:{
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            {
                opcode: 'setTile',
                text: '设置地图中[LAYER]层的[X][Y]瓦片为[TILE_ID]瓦片',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    TILE_ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "草坪",
                    },
                    LAYER:{
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            {
                opcode: 'clearTile',
                text: '擦除地图中[LAYER]层的[X][Y]的瓦片',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    TILE_ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "草坪",
                    },
                    LAYER:{
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            {
                opcode: 'clearAllTile',
                text: '擦除[LAYER]层',
                blockType: Scratch.BlockType.COMMAND,
                arguments:{
                    LAYER:{
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: '🎰 瓦片层'
            },
            {
                opcode: 'createTileLayer',
                text: '创建瓦片层，命名为[LAYER_NAME]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LAYER_NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "建筑物"
                    }
                }
            },
            {
                opcode: 'deleteTileLayer',
                text: '删除瓦片层[LAYER_NAME]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LAYER_NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "建筑物"
                    }
                }
            },
            {
                opcode: 'getTileLayers',
                text: '获取所有瓦片层',
                blockType: Scratch.BlockType.REPORTER,
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: '🎴 图层'
            },
            {
                opcode: 'joinTileMap',
                text: '加入[TILEMAP]的瓦片地图',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    TILEMAP: {
                        type: Scratch.ArgumentType.STRING,
                        menu: "SPRITE_MENU_WITH_ALL"
                    }
                }
            },
            {
                opcode: 'setLayerInTileMap',
                text: '图层(非原版图层)设为地图中的第[LAYER]行瓦片',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LAYER: {
                        type: Scratch.ArgumentType.NUMBER,
                        menu: 0
                    }

                }
            },
            {
                opcode: 'quitTilemap',
                text: '退出当前地图',
                blockType: Scratch.BlockType.COMMAND,
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: '📍 坐标变换',
            },
            {
                opcode: 'tileToPos',
                text: '获取地图中[X][Y]瓦片的[POSITION]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    POSITION: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'POSITION'
                    }
                }
            },
            {
                opcode: 'posToTile',
                text: '获取[X][Y]位置的瓦片在地图中[POSITION]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    POSITION: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'POSITION'
                    }
                }
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: '🎳 碰撞（敬请期待）'
            },
        ],
        menus: {
            SHOW_MODE: {
                items: [
                    {
                        value: SHOW_MODE.TILEMAP,
                        text: '显示瓦片地图和角色',
                    },
                    {
                        value: SHOW_MODE.SPRITE,
                        text: '仅显示角色',
                    },
                ]
            },
            POSITION: {
                items: [
                    {
                        value: POSITION.X,
                        text: 'x',
                    },
                    {
                        value: POSITION.Y,
                        text: 'y',
                    },
                ]
            },
            SPRITE_MENU_WITH_ALL: {
                acceptReporters: false,
                items: 'drawablesMenu',
            },
        },
    }
}