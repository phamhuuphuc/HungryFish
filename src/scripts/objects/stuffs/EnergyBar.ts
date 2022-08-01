const ENERGY_DROP_SPACE = 0.01
const ENERGY_DROP_MOUSE = 5
const ENERGY_RISE = 80
const MAX = 400
export class EnergyBar {
    scene: Phaser.Scene
    bar: Phaser.GameObjects.Graphics
    energy: Phaser.GameObjects.Graphics
    energyValue: number = 400
    lastTime: number

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.create()
        this.lastTime = this.scene.time.now
    }

    create() {
        this.bar = this.scene.add.graphics().setDepth(5)
        this.bar.fillStyle(0xfff6d3, 1)
        this.bar.fillRect(244, 18, 404, 24)
        this.bar.setScrollFactor(0)
        this.energy = this.scene.add.graphics().setDepth(5)
        this.energy.fillStyle(0x5dae47, 1)
        this.energy.fillRect(246, 20, 400, 20)
        this.energy.setScrollFactor(0)

        this.scene.add
            .image(240, 30, 'thunder')
            .setScale(0.15)
            .setDepth(6)
            .setScrollFactor(0)
    }

    update() {
        if (this.scene.time.now > this.lastTime + 5000) {
            this.energize()
            this.lastTime = this.scene.time.now
        }
    }

    public canDeEnergize(mouse: boolean): boolean {
        if (mouse) {
            return this.energyValue >= ENERGY_DROP_MOUSE
        } else {
            return this.energyValue >= ENERGY_DROP_SPACE
        }
    }

    public havingEnergy(): boolean {
        return this.energyValue > 0
    }

    public getEnergyValue() {
        return this.energyValue
    }

    public deEnergize(mouse: boolean) {
        this.energy.clear()
        this.energy.fillStyle(0x5dae47, 1)
        if (mouse) {
            this.energy.fillRect(
                246,
                20,
                this.energyValue - ENERGY_DROP_MOUSE,
                20
            )
            this.energyValue -= ENERGY_DROP_MOUSE
        } else {
            this.energy.fillRect(
                246,
                20,
                this.energyValue - ENERGY_DROP_SPACE,
                20
            )
            this.energyValue -= ENERGY_DROP_SPACE
        }
    }

    public energize() {
        if (this.energyValue < MAX) {
            this.energy.clear()
            this.energy.fillStyle(0x5dae47, 1)
            this.energyValue += ENERGY_RISE
            if (this.energyValue > MAX) {
                this.energyValue = MAX
            }
            this.energy.fillRect(246, 20, this.energyValue, 20)
        }
    }
}
