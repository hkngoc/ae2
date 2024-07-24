import { Scene } from 'phaser';

export class Loading extends Scene {
  constructor() {
    super({ key: "loading", active: true });
  }

  preload() {
  }

  create() {
    this.cameras.main.setBackgroundColor("#FF0000");
  }
}
