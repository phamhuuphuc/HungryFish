export class MenuScene extends Phaser.Scene {
    a: Phaser.GameObjects.Text
    constructor() {
        super('MenuScene')
    }

    create() {
        this.createText()
    }

    private createText() {
        this.add.image(450, 210, 'bg').setDisplaySize(900, 420)
        this.a = this.make
            .text({
                x: this.sys.game.canvas.width / 2,
                y: this.sys.game.canvas.height / 2,
                text: 'PlayNow',
                style: {
                    font: '30px monospace',
                    strokeThickness: 3,
                },
            })
            .setOrigin(0.5, 0.5)
            .setInteractive()

        this.a.on('pointerdown', () => {
            this.scene.start('GameScene')
            this.scene.start('HudScene')
            this.scene.bringToTop('HudScene')
        })

        this.registry.set('alive', 1)
        this.registry.set('kill', 0)
        this.registry.set('score', 0)
        this.registry.set('firstplace', '')
        this.registry.set('secondplace', '')
        this.registry.set('thirdplace', '')
        this.registry.set('firstscore', 0)
        this.registry.set('secondscore', 0)
        this.registry.set('thirdscore', 0)
    }
    update(): void {}
}
