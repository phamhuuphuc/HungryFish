import { Fish } from "../Objects/Characters/Fish";
import { Player } from "../Objects/Characters/Player";
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';


export class GameScene extends Phaser.Scene {
    
    private player: Player;

    //
    private joyStick: VirtualJoystick;
    private lastIndex: Array<number> = [-1, -1];

    private accelerateStick: Phaser.GameObjects.Zone;

    constructor()
    {
        super("GameScene");
    }

    create()
    {   
        // create player
        this.player = new Player(this, 300, 300, "player");
        // create Sticks
        this.createJoyStick();
        this.createAccelerateStick();
    }

    update()
    {
        this.updatePlayerViaJoyStick();
        this.updatePlayerViaAccelerateStick();
        
    }
    
    private createJoyStick()
    {   
        this.joyStick = new VirtualJoystick(this,
            {
                x: 770,
                y: 310,
                radius: 60,
                // base: zone,
                // thumb: zone,
                // dir: '8dir',
                // forceMin: 16,
                fixed: true,
                // enable: true
            });
    }

    private updateJoyStick()
    {
    }

    private createAccelerateStick()
    {
        this.accelerateStick = this.add.zone(130, 310, 60,60).setCircleDropZone(60);

        var graphics = this.add.graphics()
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeCircle(this.accelerateStick.x, this.accelerateStick.y, this.accelerateStick.input.hitArea.radius);
    }

    private updatePlayerViaAccelerateStick()
    {   
        this.input.keyboard.on('keydown-SPACE', function (event :KeyboardEvent) {
            console.log("evening")
            this.player.accelerate();
        }, this);
        this.input.keyboard.on('keyup-SPACE', function (event :KeyboardEvent) {
            this.player.resetSpeed();
        }, this);
    }

    private updatePlayerViaJoyStick()
    {   
        if(this.joyStick.pointer !== undefined)
        {   
            if(this.lastIndex[0] == -1 && this.lastIndex[1] == -1)
            {
                this.changeLastIndex(this.joyStick.pointer.x, this.joyStick.pointer.y);
            }else{
                let angle = this.getAngle(this.joyStick.pointer.x, this.joyStick.pointer.y);
                if( this.thumbInBase())
                {
                    this.player.move(   this.joyStick.pointer.x - this.lastIndex[0], 
                                        this.joyStick.pointer.y - this.lastIndex[1], 
                                        this.joyStick.pointer.x - this.joyStick.x, 
                                        angle
                                    );
                }else{
                    this.player.move( 0, 0, this.joyStick.pointer.x - this.joyStick.x, angle);
                }
                this.changeLastIndex(this.joyStick.pointer.x, this.joyStick.pointer.y);
            }
        }else{
            this.resetLastIndex();
        }
    }

    private distance(a: Array<number>, b: Array<number>) : number
    {
       return Math.sqrt(Math.pow((a[0] - b[0]),2) + Math.pow((a[1] - b[1]),2)) 
    }
 
    private getAngle(x: number, y: number) : number
    {
        return (this.joyStick.y - y) /this.distance( [x, y], [this.joyStick.x, this.joyStick.y]);
    }   

    private changeLastIndex(x: number, y: number)
    {
        this.lastIndex[0] = x;
        this.lastIndex[1] = y;
    }

    private resetLastIndex()
    {
        this.lastIndex[0] = -1;
        this.lastIndex[1] = -1;
    }

    private thumbInBase() : boolean
    {
        return ( this.joyStick.pointer.x > this.joyStick.x - 50
            && this.joyStick.pointer.x < this.joyStick.x + 50
            && this.joyStick.pointer.y < this.joyStick.y + 50
            && this.joyStick.pointer.y > this.joyStick.y - 50
        )
    }


}