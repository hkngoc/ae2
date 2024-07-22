import Phaser from "phaser";

export class SceneSelector extends Phaser.Scene {

    parts = [
        {
            index: 0,
            key: "skirmish",
            label: "Skirmish"
        },
        {
            index: 1,
            key: "part0",
            label: "part0"
        },
    //     '0': ,
    // '1': "Basic Player Movement",
    // '2': "Interpolation",
    // '3': "Client-predicted Input",
    // '4': "Fixed Tickrate",
    ];

    constructor() {
        super({ key: "selector", active: true });
    }

    preload() {
        // update menu background color
        this.cameras.main.setBackgroundColor(0x000000);

        // preload demo assets
        // this.load.image('ship_0001', 'assets/ship_0001.png');
        // this.load.image('ship_0001', 'https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png?v=1649945243288');
    }

    create() {
        // automatically navigate to hash scene if provided
        if (window.location.hash) {
            this.runScene(window.location.hash.substring(1));
            return;
        }

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: "#ff0000",
            fontSize: "32px",
            // fontSize: "24px",
            fontFamily: "Arial"
        };

        for (const part of this.parts) {
            const {
                index,
                key,
                label,
            } = part;

            this.add.text(130, 150 + 70 * index, label, textStyle)
                .setInteractive()
                .setPadding(6)
                .on("pointerdown", () => {
                    this.runScene(key);
                });
        }
    }

    runScene(key: string) {
        this.game.scene.switch("selector", key)
    }

}