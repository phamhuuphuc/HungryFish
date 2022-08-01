import { HudScene } from '../../scenes/HudScene'
import { Button } from '../buttons/Button'

export class DataDisplay {
    bg: Phaser.GameObjects.Graphics
    scene: Phaser.Scene
    kill: Phaser.GameObjects.Text
    score: Phaser.GameObjects.Text

    firstPlace: Phaser.GameObjects.Text
    firstPlaceScore: Phaser.GameObjects.Text
    goldbadge: Phaser.GameObjects.Image

    secondPlace: Phaser.GameObjects.Text
    secondPlaceScore: Phaser.GameObjects.Text
    silverbadge: Phaser.GameObjects.Image

    thirdPlace: Phaser.GameObjects.Text
    thirdPlaceScore: Phaser.GameObjects.Text
    bronzebadge: Phaser.GameObjects.Image

    container: Phaser.GameObjects.Container

    constructor(scene: HudScene) {
        this.scene = scene
        this.init()
    }

    init() {
        this.bg = this.scene.add.graphics()
        this.bg.fillStyle(0x222222, 0.15)
        this.bg.fillRect(670, 20, 200, 150)

        this.createText()
        this.createBadge()

        this.container = this.scene.add.container(0, 0)
        this.container.add([
            this.bg,
            this.score,
            this.kill,
            this.firstPlace,
            this.secondPlace,
            this.thirdPlace,
            this.goldbadge,
            this.silverbadge,
            this.bronzebadge,
        ])
        this.container.setVisible(true)
    }

    update() {
        this.kill.setText('Killed: ' + this.scene.registry.get('kill'))
        this.score.setText('Score:  ' + this.scene.registry.get('score'))
        this.firstPlace.setText(this.scene.registry.get('firstplace'))
        this.firstPlaceScore.setText(this.scene.registry.get('firstscore'))
        this.secondPlace.setText(this.scene.registry.get('secondplace'))
        this.secondPlaceScore.setText(this.scene.registry.get('secondscore'))
        this.thirdPlace.setText(this.scene.registry.get('thirdplace'))
        this.thirdPlaceScore.setText(this.scene.registry.get('thirdscore'))
    }

    createBadge() {
        this.goldbadge = this.scene.add.image(690, 40, 'gold').setScale(0.15)

        this.silverbadge = this.scene.add
            .image(690, 80, 'silver')
            .setScale(0.15)

        this.bronzebadge = this.scene.add
            .image(690, 120, 'bronze')
            .setScale(0.15)
    }

    createText() {
        this.firstPlace = this.scene.make.text({
            x: 730,
            y: 30,
            text: this.scene.registry.get('firstplace'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })
        this.firstPlaceScore = this.scene.make.text({
            x: 820,
            y: 30,
            text: this.scene.registry.get('firstscore'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })
        this.secondPlace = this.scene.make.text({
            x: 730,
            y: 70,
            text: this.scene.registry.get('secondplace'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })
        this.secondPlaceScore = this.scene.make.text({
            x: 820,
            y: 70,
            text: this.scene.registry.get('secondscore'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })
        this.thirdPlace = this.scene.make.text({
            x: 730,
            y: 110,
            text: this.scene.registry.get('thirdplace'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })
        this.thirdPlaceScore = this.scene.make.text({
            x: 820,
            y: 110,
            text: this.scene.registry.get('thirdscore'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })

        this.kill = this.scene.make.text({
            x: 260,
            y: 50,
            text: 'Killed: ' + this.scene.registry.get('kill'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })
        this.score = this.scene.make.text({
            x: 500,
            y: 50,
            text: 'Score:  ' + this.scene.registry.get('score'),
            style: {
                font: '20px monospace',
                strokeThickness: 1,
            },
        })
    }
}
