export class MenuScene extends Phaser.Scene {

    constructor()
    {
        super("MenuScene");
    }

    create()
    {
        this.createText();
    }

    private createText()
    {
    this.make.text({
      x: this.sys.game.canvas.width/2,
      y: this.sys.game.canvas.height/2 - 50,
      text: "PlayNow",
      style: {
        font: "30px monospace",
        strokeThickness: 3,
      }
    }).setOrigin(0.5,0.5);
    }
    update() : void
    {
        this.scene.start("GameScene");
    }
}