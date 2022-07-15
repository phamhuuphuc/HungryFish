export class Fish extends Phaser.GameObjects.Sprite {

    body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number = 0)
    {
        super(scene, x, y, texture, frame);
        this.setDisplaySize(60, 60);
        this.setOrigin(0.5,0.5);
        this.scene.add.existing(this);
    }


}