import { Fish } from "./Fish";

export class Player extends Fish {

    body: Phaser.Physics.Arcade.Body;
    

    private speed: number;

    constructor(scene: Phaser.Scene, 
                x: number, 
                y: number, 
                texture: string, 
                frame: number = 0)
    {
        super(scene, x, y, texture, frame);
        this.init();
    }

    init() 
    {
        this.speed = 0.05;
        this.scene.physics.world.enable(this);
    }
    public move(x: number, y: number, flip: boolean, angle: number)
    {
        // console.log(x);
        // console.log(y);
        
        this.x += x;
        this.y += y;
        let a = Math.asin(angle)*180/Math.PI;
        if(flip)
        {
            this.flipY = true;
            if(a < 0)
            {
                this.setAngle(180 + Math.abs(a));
            }else{
                this.setAngle(180 - a);
            }
        }else{
            this.flipY = false;
            if(a < 0)
            {
                this.setAngle(360 + a);
            }else{
                this.setAngle(a);
            }
        }
    }

    public constantMove(x: number, y: number)
    {
        this.x += x*0.12;//this.speed;
        this.y -= y*0.12;//this.speed;
        // this.body.setVelocityX(x/x *20);
        // this.body.setVelocityY(-y/y *20);
    }
    
    public getX(): number
    {
        return this.x;
    }

    public getY(): number
    {
        return this.y;
    }

    public setXY(x: number = this.x, y: number = this.y)
    {
        this.x = x;
        this.y = y;
    }
}