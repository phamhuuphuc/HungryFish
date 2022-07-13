import { Fish } from "../Objects/Characters/Fish";
import { Player } from "../Objects/Characters/Player";

export class GameScene extends Phaser.Scene {
    
    private player: Player;

    // controll fish zone
    private controlPlayerZone: Phaser.GameObjects.Zone;
    private zoneGraphic: Phaser.GameObjects.Graphics;
    private zoneActive: boolean = false;
    private zoneIndex: Array<number> = [0, 0];

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
    }

    private createControlPlayerZone()
    {
        this.controlPlayerZone = this.add.zone(
                this.sys.game.canvas.width - 150, 
                this.sys.game.canvas.height - 150, 
                100, 
                100
            ).setCircleDropZone(90);
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
        this.controlPlayerZone.on("pointermove", function(pointer : Phaser.Input.Pointer){
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

    private handlePlayerZoneInput()
    {
        if(this.zoneActive)
        {
            this.input.on("pointermove", function(pointer : Phaser.Input.Pointer){
                // this.player.move(pointer.x - this.zoneIndex[0], pointer.y - this.zoneIndex[1]);
            }.bind(this));
        }
    }
}