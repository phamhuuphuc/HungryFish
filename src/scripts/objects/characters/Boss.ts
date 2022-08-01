import { Fish } from './Fish'
import { Sword } from '../stuffs/Sword'
import { Shield } from '../stuffs/Shield'
import { fishInterface } from '../fishInterface'
export class Boss extends Fish {
    body: Phaser.Physics.Arcade.Body
    lastTimeMove: number
    interval: number
    lastTimeAcc: number
    lastTimeDirect: number
    deadTime: number

    constructor(itf: fishInterface) {
        super(itf)
        this.lastTimeMove = this.scene.time.now
        this.lastTimeAcc = this.scene.time.now
        this.lastTimeDirect = this.scene.time.now
        this.interval = 4000
        this.angleMove = 0
        this.direction = 1
        this.speed = 200
        for (let i = 0; i < 45; i++) {
            this.addFishDeadToEnemySword()
            this.checkLevelUp()
        }
    }

    update() {
        if (this.dead) {
            if (this.scene.time.now > this.deadTime + 2500) {
                this.dispose()
            }
        } else {
            if (this.scene.time.now - this.lastTimeAcc > 700) {
                this.speed += 5
                this.lastTimeAcc = this.scene.time.now
            }
            this.leaveBounce()
            if (this.scene.time.now > this.lastTimeMove + this.interval) {
                this.angleMove *= -1
                this.direction *= -1

                this.lastTimeMove = this.scene.time.now
            }
            if (this.scene.time.now > this.lastTimeDirect + this.interval * 2) {
                this.angleMove = Phaser.Math.FloatBetween(-1, 1)
                this.lastTimeDirect = this.scene.time.now
            }
            this.scene.tweens.addCounter({
                from: this.lastAngle,
                to: Phaser.Math.RAD_TO_DEG * this.angleMove,
                duration: this.interval,
                repeat: 0,
                onUpdate: (tween) => {
                    this.move(
                        Phaser.Math.DEG_TO_RAD * tween.getValue(),
                        this.direction
                    )
                },
            })
            this.lastAngle = Phaser.Math.RAD_TO_DEG * this.angleMove
        }
        this.updateFish()
    }

    public setEnemyName(value: string) {
        this.setFishName(value)
    }

    public leaveBounce() {
        if (this.onBounce[0]) {
            this.y += 10
            this.angleMove *= -1
            this.direction *= -1
            this.onBounce[0] = false
            this.lastTimeDirect = this.scene.time.now
        }
        if (this.onBounce[1]) {
            this.x -= 10
            this.onBounce[1] = false
            this.direction = -1
            this.lastTimeDirect = this.scene.time.now
        }
        if (this.onBounce[2]) {
            this.y -= 10
            this.angleMove *= -1
            this.direction *= -1
            this.onBounce[2] = false
            this.lastTimeDirect = this.scene.time.now
        }
        if (this.onBounce[3]) {
            this.x += 10
            this.direction = 1
            this.onBounce[3] = false
            this.lastTimeDirect = this.scene.time.now
        }
    }

    public addFishDeadToEnemySword() {
        this.addFishDeadToSword()
    }

    public checkLevelUp() {
        if (this.sword.checkSwordFull()) {
            this.sword.setLevelUpValue(true)
            this.levelUp = true
        }
    }

    public changeDirection() {
        if (this.scene.time.now > this.lastTimeMove + this.interval * 6) {
            this.direction = Phaser.Math.Between(-1, 1)
            this.lastTimeMove = this.scene.time.now
        } else {
            this.accelerate()
            this.lastTimeAcc = this.scene.time.now
        }
    }

    public getName(): string {
        return this.fishName
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }

    public getEnemyShield(): Shield {
        return this.getShield()
    }

    public getEnemySword(): Sword {
        return this.getSword()
    }

    public destroyEnemy() {
        this.deadTime = this.scene.time.now
        this.setInVisibleAll()
    }

    public disposeEnemy() {
        this.dispose()
    }

    public getEnemyDeadValue(): boolean {
        return this.getDeadValue()
    }

    public setAngleDirection(angle: number, direction: number) {
        let a = Math.asin(angle)
        this.angleMove = Phaser.Math.DEG_TO_RAD * a
        this.direction = direction
    }

    public updateEnemyMovingData(
        x: number,
        y: number,
        rotation: number,
        direction: number,
        angle: number
    ) {
        this.updateMovingData(x, y, rotation, direction, angle)
    }

    public accelerateEnemy() {
        this.accelerate()
        this.lastTimeAcc = this.scene.time.now
    }

    public resetSpeedEnemy() {
        this.resetSpeed()
    }

    public getEnemyScore(): number {
        return this.getScore()
    }

    public setEnemyScore(x: number) {
        this.setScore(x)
    }
}
