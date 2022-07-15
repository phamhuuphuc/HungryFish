import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'HungryFish',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '1.0',
  type: Phaser.AUTO,
  scene: [BootScene, MenuScene, GameScene],
  width: 896,
  height: 414,
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    parent: 'game',
    // width: 896,
    // height: 414
  },
  backgroundColor: 0x262626,
  // render: { pixelArt: true }
};
