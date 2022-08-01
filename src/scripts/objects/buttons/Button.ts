export class Button {
    private scene: Phaser.Scene

    private button: Phaser.GameObjects.Sprite
    private text: Phaser.GameObjects.Text

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        scale: number,
        text: string,
        font: string
    ) {
        this.scene = scene
        this.button = this.scene.add
            .sprite(x, y, 'button')
            .setScale(scale)
            .setInteractive()

        this.text = this.scene.make
            .text({
                x: x,
                y: y,
                text: text,
                style: {
                    font: font,
                },
            })
            .setOrigin(0.5, 0.5)
    }

    create() {}

    update() {}

    public get(): Array<Phaser.GameObjects.GameObject> {
        return [this.button, this.text]
    }

    public getButton(): Phaser.GameObjects.GameObject {
        return this.button
    }

    public getText(): Phaser.GameObjects.Text {
        return this.text
    }

    public setText(text: string) {
        this.text.setText(text)
    }
}
