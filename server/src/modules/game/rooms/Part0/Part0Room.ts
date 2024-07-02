import { Injectable } from '@nestjs/common';
import {
  Room,
  Client,
} from 'colyseus';
import {
  Direction,
} from 'grid-engine';

import { Part0State, Player } from './Part0State';

@Injectable()
export class Part0Room extends Room<Part0State> {
  constructor() {
    super();
  }

  onCreate(options: any) {
    this.setState(new Part0State());

    // handle player input
    this.onMessage("move", (client, direction) => {
      const { sessionId } = client;

      if (direction === "left") {
        this.state.move(sessionId, Direction.LEFT);
      } else if (direction === "right") {
        this.state.move(sessionId, Direction.RIGHT);
      } else if (direction === "up") {
        this.state.move(sessionId, Direction.UP);
      } else if (direction === "down") {
        this.state.move(sessionId, Direction.DOWN);
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // create player at random position.
    const player = new Player();
    // need to random initial position of player
    const x = this.getRandomInt(10, 30);
    const y = this.getRandomInt(31, 40);

    player.x = x;
    player.y = y;

    this.state.players.set(client.sessionId, player);
    this.state.addCharacter({
      id: client.sessionId,
      startPosition: { x, y },
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.removeCharacter(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.state.unsubscribe();
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
