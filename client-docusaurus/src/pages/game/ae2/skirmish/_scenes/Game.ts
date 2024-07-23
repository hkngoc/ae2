import GridEngine from 'grid-engine';
import { Scene } from 'phaser';

import Network from '@site/src/services/Network';

export class Game extends Scene {
  gridEngine: GridEngine;
  network: Network;

  constructor() {
    super({ key: "game", active: true });
  }

  preload() {
    this.load.image("terrain", "/assets/terrain.png");
    // this.load.spritesheet("player", "../../assets/characters.png", {
    //     frameWidth: 52,
    //     frameHeight: 72,
    // });
  }

  async create(data)  {
    console.log("data", data, this.gridEngine);
  }
}