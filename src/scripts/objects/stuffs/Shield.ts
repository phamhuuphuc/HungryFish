export class Shield extends Phaser.GameObjects.Image {
    lastTime: number

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'shield')
        this.scene.add.existing(this)
        this.init()
    }

    private init() {
        this.setDepth(1)
        this.lastTime = this.scene.time.now + 4500
    }

    public move(x: number, y: number) {
        this.x = x
        this.y = y
        this.updateStatus()
    }

    public reShield() {
        this.setVisible(true)
        this.lastTime = this.scene.time.now
        this.setAlpha(1)
    }

    private updateStatus() {
        if (this.scene.time.now > this.lastTime + 2500) {
            this.setVisible(false)
        }
        if (this.scene.time.now > this.lastTime + 1800) {
            this.setAlpha(0.6)
        }
    }

    public havingShield(): boolean {
        if (this.visible) {
            return true
        }
        return false
    }

    public shieldEffect() {
        if (this.havingShield()) {
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.3,
                scaleY: 1.3,
                ease: 'Sine.easeInOut',
                duration: 300,
                repeat: 1,
                yoyo: true,
            })
        }
    }
}
