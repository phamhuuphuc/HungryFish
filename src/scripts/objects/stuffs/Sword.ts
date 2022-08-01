const SWORD_WIDTH = 30
const SWORD_HEIGHT = 120

const BLADE_SIZE = 10

const JOYSTICK_R = 60

const STACK_SIZE: Array<number> = [4, 7, 10]
const FISH_DEAD_SIZE = 40

export class Sword extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body
    blade: Array<Phaser.GameObjects.Arc> = new Array()
    bladeGap: number = 20
    width: number
    height: number

    currentFishDeadStackSize: number
    levelUp: boolean = false
    img: string

    fishDeadStack: Array<Phaser.GameObjects.Image> = new Array()
    fishDeadSize: number = FISH_DEAD_SIZE
    fishDeadRadius: number = JOYSTICK_R
    fishDeadGap: number = 10

    stack_size: number = STACK_SIZE[0]

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)

        this.scene.add.existing(this)
        this.init()
        this.img = texture
    }

    init() {
        this.scene.physics.world.enable(this)
        this.setDepth(1)
        this.setOrigin(0.5, 1)
        this.setDisplaySize(SWORD_WIDTH, SWORD_HEIGHT)
        this.currentFishDeadStackSize = this.stack_size

        for (let i = 0; i < 4; i++) {
            this.blade[i] = this.scene.add.arc(this.x, this.y, BLADE_SIZE)
            this.scene.physics.world.enable(this.blade[i])
        }
    }

    update() {}

    public checkLevelUp() {
        if (this.levelUp) {
            this.setTexture(this.img + '0')
            this.setDisplaySize(this.displayWidth + 10, this.displayHeight + 10)
            let x = this.fishDeadStack.length
            for (let i = 0; i < x; i++) {
                let y = this.fishDeadStack.pop()
                if (y instanceof Phaser.GameObjects.Image) {
                    y.destroy()
                }
            }
            for (let i = 0; i < 4; i++) {
                this.blade[i].radius += 5
            }
            this.bladeGap += 10
            this.levelUp = false
            this.fishDeadSize += 10
            this.fishDeadRadius += 10
        }
    }

    public getLevelUpValue(): boolean {
        return this.levelUp
    }

    public setLevelUpValue(b: boolean) {
        this.levelUp = b
    }

    public checkSwordFull(): boolean {
        if (this.fishDeadStack.length - 1 == this.stack_size) {
            this.stack_size = STACK_SIZE[0]
            return true
        }
        return false
    }

    public addFishDead() {
        if (this.fishDeadStack.length <= this.currentFishDeadStackSize) {
            this.fishDeadStack[this.fishDeadStack.length] =
                this.scene.add.image(this.x, this.y, 'fishdead')
            this.fishDeadStack[this.fishDeadStack.length - 1]
                .setDepth(5)
                .setDisplaySize(this.fishDeadSize, this.fishDeadSize)
        }
    }

    public destroyAll() {
        for (let i = 0; i < 4; i++) {
            this.blade[i].destroy()
        }
        let x = this.fishDeadStack.length
        for (let i = 0; i < x; i++) {
            let y = this.fishDeadStack.pop()
            if (y instanceof Phaser.GameObjects.Image) {
                y.destroy()
            }
        }
        this.destroy()
    }

    public setInVisible() {
        for (let i = 0; i < 4; i++) {
            this.blade[i].x = 4200
        }
        let x = this.fishDeadStack.length
        for (let i = 0; i < x; i++) {
            let y = this.fishDeadStack.pop()
            if (y instanceof Phaser.GameObjects.Image) {
                y.destroy()
            }
        }
        this.setVisible(false)
    }

    public setOnVisible() {
        this.setVisible(true)
        this.setDisplaySize(SWORD_WIDTH, SWORD_HEIGHT)
        this.bladeGap = 20
        this.fishDeadSize = FISH_DEAD_SIZE
        this.fishDeadRadius = JOYSTICK_R
    }

    public move(
        x: number,
        y: number,
        angle: number,
        flip: number,
        speed: number
    ) {
        this.x = x
        this.y = y
        if (flip >= 0) {
            this.flipY = true
            this.setOrigin(0.5, 0)
            this.moveRight(
                (Math.asin(angle) * 180) / Math.PI - 90,
                angle,
                speed
            )
        } else {
            this.flipY = false
            this.setOrigin(0.5, 1)
            this.moveLeft((Math.asin(angle) * 180) / Math.PI - 90, angle, speed)
        }
    }

    private moveRight(a: number, angle: number, speed: number) {
        if (a < 0) {
            this.setAngle(180 + Math.abs(a))
            for (let i = 0; i < this.fishDeadStack.length; i++) {
                this.fishDeadStack[i].y =
                    this.y -
                    angle * (this.fishDeadRadius + i * this.fishDeadGap)
                this.fishDeadStack[i].x =
                    this.x +
                    Math.sqrt(1 - Math.pow(angle, 2)) *
                        (this.fishDeadRadius + i * 10)
                this.fishDeadStack[i].flipY = true
                this.fishDeadStack[i].setAngle(180 + Math.abs(a))
            }
        } else {
            this.setAngle(180 - a)
            for (let i = 0; i < this.fishDeadStack.length; i++) {
                this.fishDeadStack[i].y =
                    this.y -
                    angle * (this.fishDeadRadius + i * this.fishDeadGap)
                this.fishDeadStack[i].x =
                    this.x +
                    Math.sqrt(1 - Math.pow(angle, 2)) *
                        (this.fishDeadRadius + i * 10)
                this.fishDeadStack[i].flipY = true
                this.fishDeadStack[i].setAngle(180 - a)
            }
        }
        this.body.setVelocityY(-angle * speed)
        this.body.setVelocityX(Math.sqrt(1 - Math.pow(angle, 2)) * speed)
        for (let i = 0; i < 4; i++) {
            this.blade[i].y =
                this.y -
                angle * (this.displayHeight - (4 - i - 1) * this.bladeGap)
            this.blade[i].x =
                this.x +
                Math.sqrt(1 - Math.pow(angle, 2)) *
                    (this.displayHeight - (4 - i - 1) * this.bladeGap)
        }
    }

    private moveLeft(a: number, angle: number, speed: number) {
        if (a < 0) {
            this.setAngle(360 + a)
            for (let i = 0; i < this.fishDeadStack.length; i++) {
                this.fishDeadStack[i].y =
                    this.y -
                    angle * (this.fishDeadRadius + i * this.fishDeadGap)
                this.fishDeadStack[i].x =
                    this.x -
                    Math.sqrt(1 - Math.pow(angle, 2)) *
                        (this.fishDeadRadius + i * 10)
                this.fishDeadStack[i].flipY = false
                this.fishDeadStack[i].setAngle(360 + a)
            }
        } else {
            this.setAngle(a)
            for (let i = 0; i < this.fishDeadStack.length; i++) {
                this.fishDeadStack[i].y =
                    this.y -
                    angle * (this.fishDeadRadius + i * this.fishDeadGap)
                this.fishDeadStack[i].x =
                    this.x -
                    Math.sqrt(1 - Math.pow(angle, 2)) *
                        (this.fishDeadRadius + i * 10)
                this.fishDeadStack[i].flipY = false
                this.fishDeadStack[i].setAngle(a)
            }
        }
        this.body.setVelocityY(-angle * speed)
        this.body.setVelocityX(-Math.sqrt(1 - Math.pow(angle, 2)) * speed)
        for (let i = 0; i < 4; i++) {
            this.blade[i].y =
                this.y -
                angle * (this.displayHeight - (4 - i - 1) * this.bladeGap)
            this.blade[i].x =
                this.x -
                Math.sqrt(1 - Math.pow(angle, 2)) *
                    (this.displayHeight - (4 - i - 1) * this.bladeGap)
        }
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }
}
