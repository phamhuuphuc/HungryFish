export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload(): void 
  {
    this.load.pack('preload', './assets/pack.json', 'preload');
    this.createLoadingbar();
    this.showLoading();
  }

  create() : void 
  {
    this.createText();
  }

  update(): void 
  {
    // this.scene.start('GameScene'); 
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

  private createLoadingbar(): void 
  {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x5dae47, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }

  private showLoading()
  {
    this.load.on(
      'progress',
      function (value: number) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xfff6d3, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    this.load.on(
      'complete',
      function () {
        console.log("morning");
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );
  }
}
