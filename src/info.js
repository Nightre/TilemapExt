import { SHOW_MODE, POSITION, MODE } from "./constant"
import translation_map from "./lang"

export default (Scratch, mode) => {
    const label = (s) => {
        switch (mode) {
            case MODE.GANDI:
                return `---${translate(s)}`
            case MODE.TURBOWARP:
                return {
                    blockType: Scratch.BlockType.LABEL,
                    text: translate(s)
                }
        }
    }
    const translate = (s) => {
        return Scratch.translate({ id: s, default: translation_map.en[s] })
    }
    Scratch.translate.setup(translation_map)
    const info = {
        id: 'nightstilemap',
        name: translate('nights.tilemap.name'),
        blocks: [
            label('nights.tilemap.basic')
            ,
            {
                opcode: 'show',
                blockType: Scratch.BlockType.COMMAND,
                text: translate('nights.tilemap.show'),
                arguments: {
                    SHOW_MODE: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'SHOW_MODE'
                    }
                }
            },
            {
                opcode: 'setTileSize',
                text: translate('nights.tilemap.setTileSize'),
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
                text: translate('nights.tilemap.setMapSize'),
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
                text: translate('nights.tilemap.setTileView'),
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
            label('nights.tilemap.tileset'),
            {
                opcode: 'createTileSet',
                text: translate('nights.tilemap.createTileSet'),
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
                text: translate('nights.tilemap.deleteTileSet'),
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
                text: translate('nights.tilemap.deleteAllTileSet'),
                blockType: Scratch.BlockType.COMMAND,
            },
            {
                opcode: 'getAllTileSet',
                text: translate('nights.tilemap.getAllTileSet'),
                blockType: Scratch.BlockType.REPORTER,
            },
            label('nights.tilemap.tile'),
            {
                opcode: 'getTile',
                text: translate('nights.tilemap.getTile'),
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
                    LAYER: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            {
                opcode: 'setTile',
                text: translate('nights.tilemap.setTile'),
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
                    LAYER: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            {
                opcode: 'clearTile',
                text: translate('nights.tilemap.clearTile'),
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
                    LAYER: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            {
                opcode: 'clearAllTile',
                text: translate('nights.tilemap.clearAllTile'),
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LAYER: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "default_layer",
                    }
                }
            },
            label('nights.tilemap.mapLayer'),
            {
                opcode: 'createTileLayer',
                text: translate('nights.tilemap.createTileLayer'),
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
                text: translate('nights.tilemap.deleteTileLayer'),
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
                text: translate('nights.tilemap.getTileLayers'),
                blockType: Scratch.BlockType.REPORTER,
            },
            label('nights.tilemap.layer'),
            {
                opcode: 'joinTileMap',
                text: translate('nights.tilemap.joinTileMap'),
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
                text: translate('nights.tilemap.setLayerInTileMap'),
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LAYER: {
                        type: Scratch.ArgumentType.NUMBER,
                        menu: 0
                    },
                    ROW: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }

                }
            },
            {
                opcode: 'quitTilemap',
                text: translate('nights.tilemap.quitTilemap'),
                blockType: Scratch.BlockType.COMMAND,
            },
            label('nights.tilemap.position'),
            {
                opcode: 'tileToPos',
                text: translate('nights.tilemap.tileToPos'),
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
                text: translate('nights.tilemap.posToTile'),
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
                    POSITION_TILEMAP: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'POSITION_TILEMAP'
                    }
                }
            },
        ],
        menus: {
            SHOW_MODE: {
                items: [
                    {
                        value: SHOW_MODE.TILEMAP,
                        text: translate('nights.tilemap.showTilemap'),
                    },
                    {
                        value: SHOW_MODE.SPRITE,
                        text: translate('nights.tilemap.hideTilemap'),
                    },
                ]
            },
            POSITION: {
                items: [
                    {
                        value: POSITION.X,
                        text: translate('x'),
                    },
                    {
                        value: POSITION.Y,
                        text: translate('y'),
                    },
                ]
            },
            POSITION_TILEMAP: {
                items: [
                    {
                        value: POSITION.X,
                        text: translate('列'),
                    },
                    {
                        value: POSITION.Y,
                        text: translate('行'),
                    },
                ]
            },
            SPRITE_MENU_WITH_ALL: {
                acceptReporters: false,
                items: 'drawablesMenu',
            },
        },
        translation_map: translation_map
    }


    return info
}