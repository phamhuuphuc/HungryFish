import { Fish } from "./Fish";

const BASE_SPEED: number = 120;
const MAX_SPEED: number = 300;
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
        this.speed = BASE_SPEED;

        this.scene.physics.world.enable(this);
        
        this.initfirstPlace();
    }

    private initfirstPlace()
    {
        this.setAngle(240);
        this.body.setVelocityY(this.speed);
        this.flipY = true;
        this.body.setVelocityY((Math.sin(240))*this.speed);
        this.body.setVelocityX(Math.sqrt(1- Math.pow(Math.sin(240),2))*this.speed);
    }

    public move(x: number, y: number, flip: number, angle: number)
    {
        this.x += x;
        this.y += y;
        let a = Math.asin(angle)*180/Math.PI;
        if(flip > 0)
        {
            this.flipY = true;
            if(a < 0)
            {
                this.setAngle(180 + Math.abs(a));
                this.body.setVelocityY(-angle*this.speed);
                this.body.setVelocityX(Math.sqrt(1- Math.pow(angle,2))*this.speed);
            }else{
                this.setAngle(180 - a);
                this.body.setVelocityY(-angle*this.speed);
                this.body.setVelocityX(Math.sqrt(1- Math.pow(angle,2))*this.speed);
            }
        }else{
            this.flipY = false;
            if(a < 0)
            {
                this.setAngle(360 + a);
                this.body.setVelocityY(-angle*this.speed);
                this.body.setVelocityX(-Math.sqrt(1- Math.pow(angle,2))*this.speed);
            }else{
                this.setAngle(a);
                this.body.setVelocityY(-angle*this.speed);
                this.body.setVelocityX(-Math.sqrt(1- Math.pow(angle,2))*this.speed);
            }
        }
    }

    public accelerate()
    {   
       this.speed = MAX_SPEED;
    }

    public resetSpeed()
    {
        this.speed = BASE_SPEED;
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