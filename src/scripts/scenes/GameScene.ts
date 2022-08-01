import { Player } from '../objects/characters/Player'
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js'
import { Enemy } from '../objects/characters/Enemy'
import { EnergyBar } from '../objects/stuffs/EnergyBar'
import { Boss } from '../objects/characters/Boss'

export class GameScene extends Phaser.Scene {
    private player: Player

    private lastIndex: Array<number> = [-1, -1]
    //
    private joyStick: VirtualJoystick
    private accelerateStick: VirtualJoystick
    //
    private oceanBackground: Phaser.GameObjects.TileSprite
    private map: Phaser.Tilemaps.Tilemap
    private minimap: Phaser.Cameras.Scene2D.Camera
    //
    private energyBar: EnergyBar
    //
    private enemies: Phaser.GameObjects.Group
    private lastTimeAddEnemy: number
    //
    private meat: Array<number> = [-1, -1]
    private rankScore: Array<number> = [-1, -1, -1]
    private rankName: Array<string> = ['', '', '']

    // private boss: Boss
    // private bossPopUp: boolean = false

    constructor() {
        super('GameScene')
    }

    create() {
        // create background

        this.map = this.make.tilemap({ key: 'map' })
        this.oceanBackground = this.add
            .tileSprite(0, 0, 0, 0, 'background')
            .setOrigin(0, 0)
            .setDepth(0)
            .setDisplaySize(this.map.widthInPixels, this.map.heightInPixels)
        // create enemy
        this.enemies = this.add.group({
            runChildUpdate: true,
        })

        this.lastTimeAddEnemy = this.time.now

        this.loadObjectsFromTilemap()

        this.addCollider()

        // create Sticks
        this.createJoyStick()
        this.createAccelerateStick()

        this.energyBar = new EnergyBar(this)

        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        )
        this.cameras.main.setZoom(1)
        this.minimap = this.cameras.add(10, 5, 200, 100).setZoom(0.1)
        this.minimap.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        )
        this.minimap.ignore([
            this.energyBar.energy,
            this.energyBar.bar,
            this.joyStick.thumb,
            this.joyStick.base,
            this.accelerateStick.thumb,
            this.accelerateStick.base,
        ])
        this.minimap.startFollow(this.player)
    }

    update() {
        if (this.registry.get('alive') == 1) {
            // this.handleKeyboardInput()
            if (this.player.getX() == 4200) {
                this.player.x = Math.floor(Math.random() * 30) * 100 + 200
                this.player.reCreate()
                this.cameras.main.startFollow(this.player)
            }
            if (!this.player.getPlayerDeadValue()) {
                this.updatePlayerViaAccelerateStick()
                this.updatePlayerViaJoyStick()
                this.energyBar.update()
                this.handleKeyboardInput()
            }
        }
        this.player.update()
        this.addExtraEnemy()
        this.directEnemy()
        this.checkRank()
    }

    private directEnemy() {
        if (this.time.now > this.lastTimeAddEnemy + 1000) {
            this.enemies.children.each(
                (enemy: Phaser.GameObjects.GameObject) => {
                    if (enemy instanceof Enemy) {
                        if (this.meat[0] != -1) {
                            let r = this.distance(
                                [(enemy.getX(), enemy.getY())],
                                [this.meat[0], this.meat[1]]
                            )
                            if (r < 1000) {
                                enemy.setAngleDirection(
                                    (enemy.getY() - this.meat[1]) / r,
                                    this.meat[0] - enemy.getX()
                                )
                                enemy.accelerateEnemy()
                            }
                        }
                        if (
                            this.distance(
                                [this.player.getX(), this.player.getY()],
                                [enemy.getX(), enemy.getY()]
                            ) < this.player.zone
                        ) {
                            if (this.player.visible) {
                                enemy.changeDirection()
                            }
                        }
                    }
                },
                this
            )
            this.lastTimeAddEnemy = this.time.now
        }
    }

    private checkRank() {
        let inRank = false
        this.enemies.children.each((child) => {
            if (child instanceof Enemy) {
                if (child.x != 4200) {
                    inRank = false
                    if (child.getScore() >= this.rankScore[0] && !inRank) {
                        this.rankScore[0] = child.getScore()
                        this.registry.set('firstscore', child.getScore())
                        this.registry.set('firstplace', child.getName())
                        inRank = true
                    } else if (
                        child.getScore() >= this.rankScore[1] &&
                        !inRank
                    ) {
                        this.rankScore[1] = child.getScore()
                        this.registry.set('secondscore', child.getScore())
                        this.registry.set('secondplace', child.getName())
                        inRank = true
                    } else if (
                        child.getScore() >= this.rankScore[2] &&
                        !inRank
                    ) {
                        this.rankScore[2] = child.getScore()
                        this.registry.set('thirdscore', child.getScore())
                        this.registry.set('thirdplace', child.getName())
                        inRank = true
                    }
                }
            }
        })
        inRank = false
        if (this.registry.get('score') >= this.rankScore[0] && !inRank) {
            this.rankScore[0] = this.registry.get('score')
            this.registry.set('firstscore', this.registry.get('score'))
            this.registry.set('firstplace', 'you')
            inRank = true
        } else if (this.registry.get('score') >= this.rankScore[1] && !inRank) {
            this.rankScore[1] = this.registry.get('score')
            this.registry.set('secondscore', this.registry.get('score'))
            this.registry.set('secondplace', 'you')
            inRank = true
        } else if (this.registry.get('score') >= this.rankScore[2] && !inRank) {
            this.rankScore[2] = this.registry.get('score')
            this.registry.set('thirdscore', this.registry.get('score'))
            this.registry.set('thirdplace', 'you')
            inRank = true
        }
    }

    private addExtraEnemy() {
        if (this.time.now > this.lastTimeAddEnemy + 1000) {
            this.enemies.children.each((child) => {
                if (child instanceof Enemy) {
                    if (child.x == 4200) {
                        let x = Math.random() * 120 * 25 + 100
                        while (
                            x <= this.player.getX() + 400 &&
                            x >= this.player.getX() - 400 &&
                            this.player.getX() < 4000
                        ) {
                            x = Math.random() * 120 * 25 + 100
                        }
                        child.x = x
                        child.y = (Math.random() * 10 + 1) * 100
                        child.reCreate()
                    }
                }
            })
            this.lastTimeAddEnemy = this.time.now
        }
    }

    private handleKeyboardInput() {
        this.input.keyboard.on(
            'keydown-SPACE',
            (event: KeyboardEvent) => {
                if (this.energyBar.canDeEnergize(false) == true) {
                    this.player.acceleratePlayer()
                    this.energyBar.deEnergize(false)
                } else {
                    this.player.resetPlayerSpeed()
                }
            },
            this
        )
        this.input.keyboard.on(
            'keyup-SPACE',
            (event: KeyboardEvent) => {
                this.player.resetPlayerSpeed()
            },
            this
        )
    }

    private handleEnemyStabbing(
        b: Phaser.GameObjects.GameObject,
        a: Phaser.GameObjects.GameObject
    ) {
        if (!this.player.getPlayerShield().havingShield()) {
            this.meat = [this.player.getX(), this.player.getY()]
            this.player.destroyPlayer()
            this.cameras.main.stopFollow()
        } else {
            this.player.getPlayerShield().shieldEffect()
        }
    }
    // private handleEnemyStabbingBoss(
    //     b: Phaser.GameObjects.GameObject,
    //     a: Phaser.GameObjects.GameObject
    // ) {
    //     if (!this.boss.getEnemyDeadValue()) {
    //         this.boss.destroyEnemy()
    //     }
    // }

    private handlePlayerStabbing(
        b: Phaser.GameObjects.GameObject,
        a: Phaser.GameObjects.GameObject
    ) {
        if (a instanceof Enemy) {
            if (a.getEnemyShield().havingShield()) {
                a.getEnemyShield().shieldEffect()
            } else {
                if (!a.getEnemyDeadValue()) {
                    this.registry.set('kill', this.registry.get('kill') + 1)
                    this.player.addFishDeadToPlayerSword()
                    this.player.checkLevelUp()
                    this.meat = [a.getX(), a.getY()]
                    this.registry.set(
                        'score',
                        this.registry.get('score') + a.getScore()
                    )
                    a.destroyEnemy()
                }
            }
        }
    }

    // private handleBossStabbing(
    //     b: Phaser.GameObjects.GameObject,
    //     a: Phaser.GameObjects.GameObject
    // ) {
    //     if (a instanceof Enemy) {
    //         if (a.getEnemyShield().havingShield()) {
    //             a.getEnemyShield().shieldEffect()
    //         } else {
    //             if (!a.getEnemyDeadValue()) {
    //                 this.boss.addFishDeadToEnemySword()
    //                 this.boss.checkLevelUp()
    //                 this.meat = [a.getX(), a.getY()]
    //                 a.destroyEnemy()
    //             }
    //         }
    //     }
    // }

    // private handlePlayerStabbingBoss(
    //     b: Phaser.GameObjects.GameObject,
    //     a: Phaser.GameObjects.GameObject
    // ) {
    //     if (!this.boss.getEnemyDeadValue()) {
    //         this.boss.destroyEnemy()
    //     }
    // }

    private enemyStabbingEnemy() {}

    private handlePlayerEatMeat(
        b: Phaser.GameObjects.GameObject,
        a: Phaser.GameObjects.GameObject
    ) {
        if (a instanceof Enemy) {
            if (a.getEnemyDeadValue()) {
                a.disposeEnemy()
                this.energyBar.energize()
            }
        }
    }

    private handleBossEatMeatEnemy(
        b: Phaser.GameObjects.GameObject,
        a: Phaser.GameObjects.GameObject
    ) {
        if (a instanceof Enemy) {
            if (a.getEnemyDeadValue()) {
                a.disposeEnemy()
            }
        }
    }

    // private handlePlayerEatBoss(
    //     b: Phaser.GameObjects.GameObject,
    //     a: Phaser.GameObjects.GameObject
    // ) {
    //     if (this.boss.getEnemyDeadValue()) {
    //         this.boss.disposeEnemy()
    //         this.player.setScore(this.player.getScore() + 100)
    //         this.energyBar.energize()
    //     }
    //     if (this.player.getPlayerDeadValue()) {
    //         this.player.over()
    //     }
    // }

    private handleEnemyEatEnemy(
        b: Phaser.GameObjects.GameObject,
        a: Phaser.GameObjects.GameObject
    ) {
        if (a instanceof Enemy) {
            if (a.getEnemyDeadValue()) {
                a.disposeEnemy()
            }
        }
        if (b instanceof Enemy) {
            if (b.getEnemyDeadValue()) {
                b.disposeEnemy()
            }
        }
    }

    private handleEnemyEatMeat(
        b: Phaser.GameObjects.GameObject,
        a: Phaser.GameObjects.GameObject
    ) {
        if (this.player.getPlayerDeadValue()) {
            this.player.over()
        }
    }

    private handleBossEatMeat(
        b: Phaser.GameObjects.GameObject,
        a: Phaser.GameObjects.GameObject
    ) {
        if (this.player.getPlayerDeadValue()) {
            this.player.over()
        }
    }

    private loadObjectsFromTilemap(): void {
        const objects = this.map.getObjectLayer('objects').objects as any[]
        objects.forEach((object) => {
            if (object.name === 'enemy') {
                this.enemies.add(
                    new Enemy({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'fish' + Math.floor(Math.random() * 5),
                        frame: 0,
                        name: object.properties[0].value,
                    })
                )
            }
            if (object.name === 'player') {
                this.player = new Player({
                    scene: this,
                    // x: Math.floor(
                    //     Math.random() * (this.map.widthInPixels - 200) + 200
                    // ),
                    // y: Math.floor(
                    //     Math.random() * (this.map.heightInPixels - 200) + 200
                    // ),
                    x: object.x,
                    y: object.y,
                    texture: 'fish' + Math.floor(Math.random() * 5),
                    frame: 0,
                    name: 'player',
                })
            }
        })
        // this.boss = new Boss({
        //     scene: this,
        //     x: 4200,
        //     y: 300,
        //     texture: 'fish' + Math.floor(Math.random() * 5),
        //     frame: 0,
        //     name: 'Boss',
        // })
    }

    private createJoyStick() {
        var b = this.add
            .image(770, 310, 'joybase')
            .setScale(0.7)
            .setDepth(10)
            .setAlpha(0.7)
        var t = this.add
            .image(770, 310, 'joythumb')
            .setScale(0.4)
            .setDepth(11)
            .setAlpha(0.8)
        this.joyStick = new VirtualJoystick(this, {
            x: 130,
            y: 310,
            radius: 60,
            base: b,
            thumb: t,
            // dir: '8dir',
            // forceMin: 16,
            fixed: true,
            // enable: true
        })
    }

    private updateJoyStickPosition() {}

    private createAccelerateStick() {
        var a = this.add
            .zone(770, 310, 60, 60)
            .setCircleDropZone(60)
            .setDepth(10)
        var b = this.add
            .image(770, 310, 'acc')
            .setScale(0.7)
            .setDepth(11)
            .setAlpha(0.7)
        this.accelerateStick = new VirtualJoystick(this, {
            x: 770,
            y: 310,
            radius: 60,
            base: b,
            thumb: a,
            // dir: '8dir',
            // forceMin: 16,
            fixed: true,
            // enable: true
        })
    }

    private updatePlayerViaAccelerateStick() {
        if (this.accelerateStick.pointer !== undefined) {
            if (this.energyBar.canDeEnergize(true) == true) {
                this.player.acceleratePlayer()
                this.energyBar.deEnergize(true)
            } else {
                this.player.resetPlayerSpeed()
            }
        } else {
            this.player.resetPlayerSpeed()
        }
    }

    private updatePlayerViaJoyStick() {
        if (this.joyStick.pointer !== undefined) {
            if (this.lastIndex[0] == -1 && this.lastIndex[1] == -1) {
                this.changeLastIndex(
                    this.joyStick.pointer.x,
                    this.joyStick.pointer.y
                )
            } else {
                let angle = this.getAngle(
                    this.joyStick.pointer.x,
                    this.joyStick.pointer.y
                )
                if (this.thumbInBase()) {
                    this.player.updatePlayerMovingData(
                        this.joyStick.pointer.x - this.lastIndex[0],
                        this.joyStick.pointer.y - this.lastIndex[1],
                        this.joyStick.rotation,
                        this.joyStick.pointer.x - this.joyStick.x,
                        angle
                    )
                } else {
                    this.player.updatePlayerMovingData(
                        0,
                        0,
                        0,
                        this.joyStick.pointer.x - this.joyStick.x,
                        angle
                    )
                }
                this.changeLastIndex(
                    this.joyStick.pointer.x,
                    this.joyStick.pointer.y
                )
            }
        } else {
            this.resetLastIndex()
        }
    }

    private distance(a: Array<number>, b: Array<number>): number {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
    }

    private getAngle(x: number, y: number): number {
        return (
            (this.joyStick.y - y) /
            this.distance([x, y], [this.joyStick.x, this.joyStick.y])
        )
    }

    private changeLastIndex(x: number, y: number) {
        this.lastIndex[0] = x
        this.lastIndex[1] = y
    }

    private resetLastIndex() {
        this.lastIndex[0] = -1
        this.lastIndex[1] = -1
    }

    private thumbInBase(): boolean {
        return (
            this.joyStick.pointer.x > this.joyStick.x - 50 &&
            this.joyStick.pointer.x < this.joyStick.x + 50 &&
            this.joyStick.pointer.y < this.joyStick.y + 50 &&
            this.joyStick.pointer.y > this.joyStick.y - 50
        )
    }

    private addCollider() {
        this.physics.add.overlap(
            this.player.getPlayerSword().blade,
            this.enemies,
            this.handlePlayerStabbing,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerEatMeat,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.enemies,
            this.enemies,
            this.handleEnemyEatEnemy,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.enemies,
            this.player,
            this.handleEnemyEatMeat,
            undefined,
            this
        )

        // boss

        // this.physics.add.overlap(
        //     this.player,
        //     this.boss.getEnemySword().blade,
        //     this.handleBossEatMeat,
        //     undefined,
        //     this
        // )

        // this.physics.add.overlap(
        //     this.player.getPlayerSword().blade,
        //     this.boss,
        //     this.handlePlayerStabbingBoss,
        //     undefined,
        //     this
        // )

        // this.physics.add.overlap(
        //     this.player,
        //     this.boss,
        //     this.handlePlayerEatBoss,
        //     undefined,
        //     this
        // )
        // this.physics.add.overlap(
        //     this.boss.getEnemySword().blade,
        //     this.enemies,
        //     this.handleBossStabbing,
        //     undefined,
        //     this
        // )

        // this.physics.add.overlap(
        //     this.boss,
        //     this.enemies,
        //     this.handleBossEatMeatEnemy,
        //     undefined,
        //     this
        // )

        this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof Enemy) {
                this.physics.add.overlap(
                    this.player,
                    enemy.getEnemySword().blade,
                    this.handleEnemyStabbing,
                    undefined,
                    this
                )
                // this.physics.add.overlap(
                //     this.boss,
                //     enemy.getEnemySword().blade,
                //     this.handleEnemyStabbingBoss,
                //     undefined,
                //     this
                // )
                this.physics.add.overlap(
                    this.enemies,
                    enemy.getEnemySword().blade,
                    (e) => {
                        if (e instanceof Enemy) {
                            if (
                                e.getName() != enemy.getName() &&
                                !e.getEnemyDeadValue()
                            ) {
                                if (e.getEnemyShield().havingShield()) {
                                    e.getEnemyShield().shieldEffect()
                                } else {
                                    enemy.addFishDeadToEnemySword()
                                    enemy.checkLevelUp()
                                    enemy.setScore(
                                        enemy.getScore() + e.getScore()
                                    )
                                    e.destroyEnemy()
                                }
                            }
                        }
                    },
                    undefined,
                    this
                )
            }
        }, this)
    }
}
