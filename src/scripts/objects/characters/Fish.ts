import { Sword } from '../stuffs/Sword'
import { Shield } from '../stuffs/Shield'
import { fishInterface } from '../fishInterface'

const BASE_SPEED: number = 160
const MAX_SPEED: number = 300
const WORLD_HEIGHT: number = 1408
const WORLD_WIDTH: number = 4000
const LEVEL_MAX: number = 2

export class Fish extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    protected speed: number
    protected angleMove: number
    protected direction: number

    protected dead: boolean

    protected sword: Sword

    protected shield: Shield

    protected onBounce: Array<boolean> = [false, false, false, false]

    protected level: number = 0
    protected levelUp: boolean = false

    protected textName: Phaser.GameObjects.Text
    protected fishName: string

    protected lastAngle: number

    protected score: number = 5

    constructor(itf: fishInterface) {
        super(itf.scene, itf.x, itf.y, itf.texture, itf.frame)
        this.fishName = itf.name
        this.scene.add.existing(this)
        this.init()
    }

    init() {
        this.setDisplaySize(100, 60)
        this.setOrigin(0.5, 0.5)
        this.setDepth(2)

        this.speed = BASE_SPEED
        this.angleMove = Phaser.Math.FloatBetween(-1, 1)
        this.direction = Phaser.Math.Between(-1, 1)
        this.dead = false
        this.lastAngle = Phaser.Math.RAD_TO_DEG * this.angleMove
        // name
        this.textName = this.scene.make
            .text({
                x: this.x,
                y: this.y - this.displayHeight,
                text: this.fishName,
                style: {
                    font: '22px monospace',
                    strokeThickness: 1,
                },
            })
            .setOrigin(0.5, 0.5)
            .setDepth(8)
        // create sword
        this.sword = new Sword(
            this.scene,
            this.x,
            this.y,
            'sword' + Math.floor(Math.random() * 4)
        )

        this.shield = new Shield(this.scene, this.x, this.y)

        this.scene.physics.world.enable(this)
    }

    protected updateFish() {
        this.sword.checkLevelUp()
        if (this.levelUp) {
            this.level += 1
            this.setDisplaySize(this.displayWidth + 20, this.displayHeight + 10)
            this.setSize(this.width + 30, this.height + 10)
            this.levelUp = false
        }
    }

    protected addFishDeadToSword() {
        this.sword.addFishDead()
    }

    public getScore(): number {
        return this.score
    }

    public setScore(x: number) {
        this.score = x
    }

    protected getShield(): Shield {
        return this.shield
    }

    protected destroyStuffs() {
        this.sword.destroyAll()
        this.shield.destroy()
        this.setTexture('fishdead')
        this.dead = true
        this.body.setVelocity(0)
        this.setDisplaySize(60, 60)
        this.textName.destroy()
    }

    protected setFishName(x: string) {
        this.fishName = x
    }

    public setInVisibleAll() {
        this.shield.setVisible(false)
        this.sword.setInVisible()
        this.setTexture('fishdead')
        this.dead = true
        this.body.setVelocity(0)
        this.setDisplaySize(60, 60)
        this.textName.setVisible(false)
        this.score = 5
    }

    protected dispose() {
        this.setVisible(false)
        this.x = 4200
        this.shield.setX(4200)
        this.sword.setX(4200)
        this.textName.setX(4200)
    }

    public reCreate() {
        this.setDisplaySize(100, 60)
        this.sword.setOnVisible()
        this.shield.reShield()
        this.setTexture('fish' + Math.floor(Math.random() * 5))
        this.sword.setTexture('sword' + Math.floor(Math.random() * 4))
        this.dead = false
        this.setDisplaySize(100, 60)
        this.textName.setVisible(true)
        this.setVisible(true)
    }

    protected getDeadValue(): boolean {
        return this.dead
    }

    protected move(angle: number, flip: number) {
        if (!this.dead) {
            this.textName.setPosition(this.x, this.y - this.displayHeight)
            this.sword.move(this.x, this.y, angle, flip, this.speed)
            this.shield.move(this.x, this.y)
            if (flip >= 0) {
                this.flipY = true
                this.moveRight((Math.asin(angle) * 180) / Math.PI, angle)
            } else {
                this.flipY = false
                this.moveLeft((Math.asin(angle) * 180) / Math.PI, angle)
            }

            this.forceThisInWorld()
        }
    }

    protected forceThisInWorld() {
        if (this.angleMove <= 0 && this.angleMove >= -1) {
            this.forceThisOnbase()
        }
        if (this.angleMove > 0 && this.angleMove <= 1) {
            this.forceThisUnderTop()
        }
        if (this.flipY == false) {
            this.forceThisBesideLeft()
        }
        if (this.flipY == true) {
            this.forceThisBesideRight()
        }
    }

    protected forceThisBesideRight() {
        if (this.x >= WORLD_WIDTH - this.displayWidth) {
            this.body.setVelocityX(0)
            this.sword.body.setVelocityX(0)
            this.onBounce[1] = true
        }
    }

    protected forceThisOnbase() {
        if (this.y >= WORLD_HEIGHT - this.displayHeight) {
            this.body.setVelocityY(0)
            this.sword.body.setVelocityY(0)
            this.onBounce[2] = true
        }
    }

    protected forceThisUnderTop() {
        if (this.y <= this.displayHeight) {
            this.body.setVelocityY(0)
            this.sword.body.setVelocityY(0)
            this.onBounce[0] = true
        }
    }

    protected forceThisBesideLeft() {
        if (this.x <= this.displayWidth) {
            this.body.setVelocityX(0)
            this.sword.body.setVelocityX(0)
            this.onBounce[3] = true
        }
    }

    protected getSword(): Sword {
        return this.sword
    }

    protected updateMovingData(
        x: number,
        y: number,
        rotation: number,
        direction: number,
        angle: number
    ) {
        this.x += x * 0.1
        this.y += y * 0.1
        this.scene.physics.velocityFromRotation(
            rotation,
            this.speed,
            this.body.velocity
        )
        this.angleMove = angle
        this.direction = direction
    }

    private moveRight(a: number, angle: number) {
        if (a < 0) {
            this.setAngle(180 + Math.abs(a))
            this.body.setVelocityY(-angle * this.speed)
            this.body.setVelocityX(
                Math.sqrt(1 - Math.pow(angle, 2)) * this.speed
            )
        } else {
            this.setAngle(180 - a)
            this.body.setVelocityY(-angle * this.speed)
            this.body.setVelocityX(
                Math.sqrt(1 - Math.pow(angle, 2)) * this.speed
            )
        }
    }

    private moveLeft(a: number, angle: number) {
        if (a < 0) {
            this.setAngle(360 + a)
            this.body.setVelocityY(-angle * this.speed)
            this.body.setVelocityX(
                -Math.sqrt(1 - Math.pow(angle, 2)) * this.speed
            )
        } else {
            this.setAngle(a)
            this.body.setVelocityY(-angle * this.speed)
            this.body.setVelocityX(
                -Math.sqrt(1 - Math.pow(angle, 2)) * this.speed
            )
        }
    }

    protected accelerate() {
        this.speed = MAX_SPEED
    }

    protected resetSpeed() {
        this.speed = BASE_SPEED
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }

    public setXY(x: number = this.x, y: number = this.y) {
        this.x = x
        this.y = y
    }

    public getSpeed(): number {
        return this.speed
    }

    public getName(): string {
        return this.fishName
    }
}
