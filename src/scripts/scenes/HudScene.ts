import { DataDisplay } from '../objects/displays/DataDisplay'
import { EndGameDisplay } from '../objects/displays/EndGameDisplay'

export class HudScene extends Phaser.Scene {
    endGame: EndGameDisplay
    dataGame: DataDisplay

    constructor() {
        super('HudScene')
    }

    create() {
        this.endGame = new EndGameDisplay(this)
        this.dataGame = new DataDisplay(this)
    }

    update() {
        if (this.registry.get('alive') == 0) {
            this.endGame.container.setVisible(true)
            this.dataGame.container.setAlpha(0.6)
        }
        if (!this.endGame.container.visible) {
            this.dataGame.container.setAlpha(1)
        }
        this.dataGame.update()
    }
}
