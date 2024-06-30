/**
 * ---------------------------
 * Phaser + Colyseus - Part 1.
 * ---------------------------
 * - Connecting with the room
 * - Sending inputs at the user's framerate
 * - Update each player's positions WITHOUT interpolation
 */

import Phaser from "phaser";
import { Room, Client } from "colyseus.js";
import {
    GridEngine,
    Direction,
} from "grid-engine";

import { BACKEND_URL } from "../backend";

export class Part0Scene extends Phaser.Scene {
    room: Room;
    playerId: string;
    playerEntities: { [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | Phaser.GameObjects.GameObject } = {};

    debugFPS: Phaser.GameObjects.Text;

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
    };
    gridEngine: GridEngine;

    constructor() {
        super({
            key: "part0",
        });
    }

    preload() {
        this.load.image("tiles", "../../assets/cloud_tileset.png");
        this.load.tilemapTiledJSON("cloud-city-map", "../../assets/cloud_city_large.json");
        this.load.spritesheet("player", "../../assets/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });
    }

    async create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000", });
        
        this.cameras.main.setBackgroundColor("48C4F8");
        const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
        cloudCityTilemap.addTilesetImage("cloud_tileset", "tiles");
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
            const layer = cloudCityTilemap.createLayer(i, "cloud_tileset", 0, 0);
            layer.scale = 3;
        }

        const gridEngineConfig = {
            characters: [],
        };

        this.gridEngine.create(cloudCityTilemap, gridEngineConfig);

        // connect with the room
        await this.connect();

        this.room.state.players.onAdd((player, sessionId) => {
            console.log("player", player);

            this.playerId = sessionId;

            const playerSprite = this.add.sprite(0, 0, "player");
            playerSprite.scale = 1.5;
            this.playerEntities[sessionId] = playerSprite;

            this.cameras.main.startFollow(playerSprite, true);
            this.cameras.main.setFollowOffset(
                -playerSprite.width,
                -playerSprite.height,
            );

            this.gridEngine.addCharacter({
                id: sessionId,
                sprite: playerSprite,
                walkingAnimationMapping: 6,
                startPosition: { x: player.x, y: player.y },
            });

            // // listening for server updates
            player.onChange(() => {
                //
                // update local position immediately
                // (WE WILL CHANGE THIS ON PART 2)
                //
                // entity.x  = player.x;
                // entity.y = player.y;
                this.gridEngine.moveTo(sessionId, { x: player.x, y: player.y });
            });
        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((player, sessionId) => {
            const entity = this.playerEntities[sessionId];
            if (entity) {
                entity.destroy();
                delete this.playerEntities[sessionId]
            }

            this.playerId = null;
            this.gridEngine.removeCharacter(sessionId);
        });
    }

    async connect() {
        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)

        const client = new Client(BACKEND_URL);

        try {
            this.room = await client.joinOrCreate("part0_room", {});

            // connection successful!
            connectionStatusText.destroy();

        } catch (e) {
            // couldn't connect
            connectionStatusText.text = "Could not connect with the server.";
        }

    }

    update(time: number, delta: number): void {
        // skip loop if not connected with room yet.
        if (!this.room) {
            return; 
        }

        // send input to the server
        const cursors = this.input.keyboard.createCursorKeys();
        // this.inputPayload.left = this.cursorKeys.left.isDown;
        // this.inputPayload.right = this.cursorKeys.right.isDown;
        // this.inputPayload.up = this.cursorKeys.up.isDown;
        // this.inputPayload.down = this.cursorKeys.down.isDown;

        if (cursors.left.isDown) {
            this.room.send("move", "left");
        } else if (cursors.right.isDown) {
            this.room.send("move", "right");
        } else if (cursors.up.isDown) {
            this.room.send("move", "up");
        } else if (cursors.down.isDown) {
            this.room.send("move", "down");
        }
        // this.room.send("move", this.inputPayload);

        this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
    }

}