import 'phaser'
import { BootScene } from './scenes/BootScene'
import { MenuScene } from './scenes/MenuScene'
import { GameScene } from './scenes/GameScene'
import { HudScene } from './scenes/HudScene'

const DEFAULT_WIDTH = 894
const DEFAULT_HEIGHT = 414

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '0x262626',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [BootScene, MenuScene, HudScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 },
        },
    },
    input: {
        activePointers: 3,
    },
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(config)
})
