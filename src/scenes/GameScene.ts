import { Fish } from "../Objects/Characters/Fish";
import { Player } from "../Objects/Characters/Player";

export class GameScene extends Phaser.Scene {
    
    private player: Player;

    // control fish zone
    private controlPlayerZone: Phaser.GameObjects.Zone;
    private zoneGraphic: Phaser.GameObjects.Graphics;
    private zoneActive: boolean = false;
    private zoneIndex: Array<number> = [-1, -1];

    constructor()
    {
        super("GameScene");
    }

    create()
    {   
        this.player = new Player(this, 300, 300, "player");
        this.createControlPlayerZone();
        
    }

    update()
    {
        this.checkPlayerZone();
        this.handlePlayerZoneInput();
        // console.log(this.controlPlayerZone);
    }

    private createControlPlayerZone()
    {
        this.controlPlayerZone = this.add.zone(
                this.sys.game.canvas.width - 150, 
                this.sys.game.canvas.height - 150, 
                100, 
                100
            ).setCircleDropZone(90).setOrigin(0);
        this.zoneGraphic = this.add.graphics()
            .lineStyle(2, 0xffff00)
            .strokeCircle(  
                this.controlPlayerZone.x, 
                this.controlPlayerZone.y, 
                this.controlPlayerZone.input.hitArea.radius
            );
        this.controlPlayerZone.setInteractive();
    }

    private checkPlayerZone()
    {
        this.mouseInMove();
        this.mouseOut();
    }

    private mouseInMove()
    {   
        if(!this.zoneActive)
        {
        this.controlPlayerZone.on("pointerdown", function(pointer : Phaser.Input.Pointer){
            this.zoneActive = true;
            this.zoneGraphic.clear();
            this.zoneGraphic.lineStyle(2, 0x00ffff);
            this.zoneGraphic.strokeCircle(  
                this.controlPlayerZone.x, 
                this.controlPlayerZone.y, 
                this.controlPlayerZone.input.hitArea.radius
            );
        }.bind(this));
        }
    }

    private mouseOut()
    {
        if(this.zoneActive)
        {
        this.controlPlayerZone.on("pointerout", function(pointer : Phaser.Input.Pointer) {
            this.zoneActive = false;
            this.zoneGraphic.clear();
            this.zoneGraphic.lineStyle(2, 0xffff00);
            this.zoneGraphic.strokeCircle(  
                this.controlPlayerZone.x, 
                this.controlPlayerZone.y, 
                this.controlPlayerZone.input.hitArea.radius
            );
        }.bind(this));
        }
    }
    
    private checkPointOutOfZone(x: number, y: number) : boolean
    {
        let distance = this.distance([x, y], [this.controlPlayerZone.x, this.controlPlayerZone.y]);
        if(distance > this.controlPlayerZone.width)
            return true;
        return false;
    }

    private checkPointOnBounce(x: number, y: number) : boolean
    {
        let distance = this.distance([x, y], [this.controlPlayerZone.x, this.controlPlayerZone.y]);
        if(distance >= (this.controlPlayerZone.width - 25) && distance <= 100)
            return true;
        return false;
    }

    private distance(a: Array<number>, b: Array<number>) : number
    {
       return Math.sqrt(Math.pow((a[0] - b[0]),2) + Math.pow((a[1] - b[1]),2)) 
    }

    private handlePlayerZoneInput()
    {
        if(this.zoneActive)
        { 
            this.input.on("pointermove", function(pointer : Phaser.Input.Pointer){
                if(this.zoneIndex[0] == -1 && this.zoneIndex[1] == -1)
                {
                    this.zoneIndex[0] = pointer.x;
                    this.zoneIndex[1] = pointer.y;
                }else{
                    if(this.checkPointOnBounce(pointer.x, pointer.y))
                    {
                        if(pointer.x < this.controlPlayerZone.x && pointer.y < this.controlPlayerZone.y)
                        {
                        this.player.constantMove(-1, 1);
                        }else if(pointer.x > this.controlPlayerZone.x && pointer.y < this.controlPlayerZone.y)
                        {
                        this.player.constantMove(1,1);
                        }else if(pointer.x < this.controlPlayerZone.x && pointer.y > this.controlPlayerZone.y)
                        {
                        this.player.constantMove(-1,-1);
                        }else if(pointer.x > this.controlPlayerZone.x && pointer.y > this.controlPlayerZone.y)
                        {
                        this.player.constantMove(1,-1);
                        }
                    }
                    if(this.checkPointOutOfZone(pointer.x, pointer.y))
                    {
                        this.zoneIndex[0] = -1;
                        this.zoneIndex[1] = -1;
                    }else{
                        let angle = (this.controlPlayerZone.y - pointer.y) /this.distance([pointer.x, pointer.y], [this.controlPlayerZone.x, this.controlPlayerZone.y]);
                    if(pointer.x > this.controlPlayerZone.x)
                    {
                        this.player.move(pointer.x - this.zoneIndex[0], pointer.y - this.zoneIndex[1], true, angle);
                    }else{
                        this.player.move(pointer.x - this.zoneIndex[0], pointer.y - this.zoneIndex[1], false, angle);
                    }
                    this.zoneIndex[0] = pointer.x;
                    this.zoneIndex[1] = pointer.y;
                    }
                }
            }.bind(this));
        }
    }
}