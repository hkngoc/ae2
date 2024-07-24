import GridEngine from 'grid-engine';
import { Scene } from 'phaser';
import { Room } from 'colyseus.js';

import Network from '@site/src/services/Network';
import { BACKEND_HTTP_URL } from '@site/src/utils/backend';
export class Game extends Scene {
  room: Room;
  gridEngine: GridEngine;
  network: Network;
  playerId: string;
  playerEntities: { [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | Phaser.GameObjects.GameObject } = {};

  constructor() {
    super({ key: "game" });
  }

  preload() {
    this.load.image("terrain", "/assets/terrain.png");
    this.load.spritesheet("player", "/assets/characters.png", {
        frameWidth: 52,
        frameHeight: 72,
    });
  }

  async create() {
    const room = this.game.registry.get("room");
    this.room = room;

    this.cameras.main.setBackgroundColor("#48C4F8");

    try {
      this.load.tilemapTiledJSON("skirmish", `${BACKEND_HTTP_URL}/game/room/${room.roomId}/tilemap`);
      this.load.start();
    
      this.load.once("complete", () => {
        const tilemap = this.make.tilemap({
          key: "skirmish",
        });

        tilemap.addTilesetImage("terrain", "terrain", 24, 24, 1, 1);

        for (const [index, layer] of tilemap.layers.entries()) {
          const { x, y } = layer;

          const l = tilemap.createLayer(index, "terrain", x, y);
          l.scale = 3;
        }

        const gridEngineConfig = {
          characters: [],
        };

        console.log("after", tilemap);

        this.gridEngine.create(tilemap, gridEngineConfig);

        this.input.on(
          "wheel",
          (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            // Get the current world point under pointer.
            const worldPoint = this.cameras.main.getWorldPoint(
              pointer.x,
              pointer.y
            );
            const newZoom =
              this.cameras.main.zoom - this.cameras.main.zoom * 0.001 * deltaY;

            console.log("newZoom", newZoom);
            this.cameras.main.zoomTo(newZoom, 100);
          }
        );

        this.room.state.players.onAdd((player, sessionId) => {
          const playerSprite = this.add.sprite(0, 0, "player");
          playerSprite.scale = 1.5;
          this.playerEntities[sessionId] = playerSprite;

          if (room.sessionId === sessionId) {
            this.cameras.main.startFollow(
              playerSprite,
              true,
              1,
              1,
              -playerSprite.width,
              -playerSprite.height
            );
            console.log(tilemap);
            this.cameras.main.setBounds(
              0,
              0,
              3 * tilemap.widthInPixels,
              3 * tilemap.heightInPixels
            );
          }

          this.gridEngine.addCharacter({
            id: sessionId,
            sprite: playerSprite,
            walkingAnimationMapping: 6,
            startPosition: { x: player.x, y: player.y },
          });

          // // listening for server updates
          player.onChange(() => {
            this.gridEngine.moveTo(sessionId, { x: player.x, y: player.y });
          });
        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((player, sessionId) => {
          const entity = this.playerEntities[sessionId];
          if (entity) {
            entity.destroy();
            delete this.playerEntities[sessionId];
          }

          if (room.sessionId === sessionId) {
            this.playerId = null;
          }

          this.gridEngine.removeCharacter(sessionId);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  update(time: number, delta: number): void {
    // skip loop if not connected with room yet.
    if (!this.room) {
        return; 
    }

    // send input to the server
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        this.room.send("move", "left");
    } else if (cursors.right.isDown) {
        this.room.send("move", "right");
    } else if (cursors.up.isDown) {
        this.room.send("move", "up");
    } else if (cursors.down.isDown) {
        this.room.send("move", "down");
    }
  }

}