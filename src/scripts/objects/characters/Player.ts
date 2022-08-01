import { Fish } from './Fish'
import { Sword } from '../stuffs/Sword'
import { Shield } from '../stuffs/Shield'
import { fishInterface } from '../fishInterface'

export class Player extends Fish {
    body: Phaser.Physics.Arcade.Body
    deadTime: number
    deadIndex: Array<number> = new Array()
    zone: number = 270

    constructor(itf: fishInterface) {
        super(itf)
        this.angleMove = -0.8
        this.direction = 1
    }

    update() {
        if (this.dead) {
            if (this.scene.time.now > this.deadTime + 3000) {
                this.over()
            }
        } else {
            this.move(this.angleMove, this.direction)
            this.updateFish()
        }
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }

    public getPlayerShield(): Shield {
        return this.getShield()
    }

    public checkLevelUp() {
        if (this.sword.checkSwordFull()) {
            this.sword.setLevelUpValue(true)
            this.levelUp = true
            this.zone += 40
        }
    }

    public destroyPlayer() {
        this.deadTime = this.scene.time.now
        this.setInVisibleAll()
    }

    public addFishDeadToPlayerSword() {
        this.addFishDeadToSword()
    }

    public getPlayerDeadValue(): boolean {
        return this.dead
    }

    public getPlayerSword(): Sword {
        return this.getSword()
    }

    public updatePlayerMovingData(
        x: number,
        y: number,
        rotation: number,
        direction: number,
        angle: number
    ) {
        this.updateMovingData(x, y, rotation, direction, angle)
    }

    public acceleratePlayer() {
        this.accelerate()
    }

    public resetPlayerSpeed() {
        this.resetSpeed()
    }

    public over() {
        this.setVisible(false)
        this.x = 4200
        this.scene.registry.set('alive', 0)
        this.angleMove = -0.8
        this.direction = 1
    }

    public getPlayerScore(): number {
        return this.getScore()
    }

    public setPlayerScore(x: number) {
        this.setScore(x)
    }
}
