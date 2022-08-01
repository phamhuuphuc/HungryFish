import { HudScene } from '../../scenes/HudScene'
import { Button } from '../buttons/Button'

export class EndGameDisplay {
    bg: Phaser.GameObjects.Graphics
    replayBtn: Button
    scene: Phaser.Scene
    container: Phaser.GameObjects.Container

    constructor(scene: HudScene) {
        this.scene = scene
        this.init()
        this.create()
    }

    init() {
        this.bg = this.scene.add.graphics()
        this.bg.fillStyle(0x222222, 0.7)
        this.bg.fillRect(0, 0, 894, 414)
        this.replayBtn = new Button(
            this.scene,
            450,
            300,
            0.3,
            'Retry',
            '26px monospace'
        )
        this.container = this.scene.add.container(0, 0)
        this.container.add([this.bg])
        this.container.add(this.replayBtn.get())
        this.container.setVisible(false)
    }

    create() {
        this.replayBtn.getButton().on('pointerdown', () => {
            this.scene.registry.set('alive', 1)
            this.scene.registry.set('kill', 0)
            this.scene.registry.set('score', 0)
            this.scene.scene.start('HudScene')
            this.scene.scene.bringToTop('HudScene')
        })
    }
}
