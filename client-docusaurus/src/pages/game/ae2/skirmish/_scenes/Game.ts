import { Scene } from 'phaser';

export class Game extends Scene {
  preload() {
    this.load.image("terrain", "/assets/terrain.png");
    // this.load.spritesheet("player", "../../assets/characters.png", {
    //     frameWidth: 52,
    //     frameHeight: 72,
    // });
  }

  async create() {
  }
}