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

import {
    BACKEND_URL,
    BACKEND_HTTP_URL,
} from "../backend";

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

        // connect with the room
        const room = await this.connect();

        console.log(room);

        const cloudCityTilemap = this.make.tilemap({
            key: "cloud-city-map",
        });

        console.log("before", cloudCityTilemap);
        cloudCityTilemap.addTilesetImage("cloud_tileset", "tiles");
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
            const layer = cloudCityTilemap.createLayer(i, "cloud_tileset", 0, 0);
            layer.scale = 3;
        }

        console.log("after", cloudCityTilemap);

        const gridEngineConfig = {
            characters: [],
        };

        this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
        this.playerId = room.sessionId;

        console.log(cloudCityTilemap);

        this.room.state.players.onAdd((player, sessionId) => {

            const playerSprite = this.add.sprite(0, 0, "player");
            playerSprite.scale = 1.5;
            this.playerEntities[sessionId] = playerSprite;

            if (room.sessionId === sessionId) {
                this.cameras.main.startFollow(playerSprite, true);
                this.cameras.main.setFollowOffset(
                    -playerSprite.width,
                    -playerSprite.height,
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
                delete this.playerEntities[sessionId]
            }

            if (room.sessionId === sessionId) {
                this.playerId = null;
            }

            this.gridEngine.removeCharacter(sessionId);
        });

        // dynamic load map from backend, to support in future
        // this.load.tilemapTiledJSON("cloud-city-map", `${BACKEND_HTTP_URL}/game/room/${room.roomId}/tilemap`);
        // this.load.start();

        // this.load.once("complete", () => {
            
        // });
    }

    async connect() {
        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)

        const client = new Client(BACKEND_URL);

        try {
            const room = await client.joinOrCreate("part0_room", {});

            this.room = room;

            // connection successful!
            connectionStatusText.destroy();

            return room;
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