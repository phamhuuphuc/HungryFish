import { Fish } from "./Fish";

export class Player extends Fish {

    constructor(scene: Phaser.Scene, 
                x: number, 
                y: number, 
                texture: string, 
                frame: number = 0)
    {
        super(scene, x, y, texture, frame);
    }

    public move(x: number, y: number)
    {
        // console.log(x);
        // console.log(y);
        this.x += x;
        this.y += y;
    }
}