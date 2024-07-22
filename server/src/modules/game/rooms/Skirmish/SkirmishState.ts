import {
  Schema,
  type,
  MapSchema,
} from '@colyseus/schema';

import {
  GridEngineHeadless,
  TiledTilemap,
  CharacterDataHeadless,
  Direction,
  Position,
} from 'grid-engine';

import {
  Subscription,
  interval,
} from 'rxjs';

import * as MapJonData from "../../assets/skirmish_001_001.json";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
}

export class SkirmishState extends Schema {
  @type("number") mapWidth: number;
  @type("number") mapHeight: number;

  @type({ map: Player }) players = new MapSchema<Player>();

  subscriptions = new Subscription();

  private gridEngine: GridEngineHeadless;

  constructor() {
    super();

    this.gridEngine = new GridEngineHeadless();
    const tilemap = new TiledTilemap(MapJonData);
    this.gridEngine.create(tilemap, { characters: [] });

    const intervalSubscription = interval(50).subscribe(() => {
      this.gridEngine.update(0, 50);
    });

    const positionChangeFinishedSubCription = this.gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
      this.positionChangeFinished(charId, enterTile);
    });

    this.subscriptions.add(intervalSubscription);
    this.subscriptions.add(positionChangeFinishedSubCription);
  }

  positionChangeFinished(id: string, position: Position) {
    const { x, y } = position;
    const player = this.players.get(id);

    player.x = x;
    player.y = y;
  }

  addCharacter(data: CharacterDataHeadless) {
    this.gridEngine.addCharacter(data);
  }

  removeCharacter(id: string) {
    this.players.delete(id);
    this.gridEngine.removeCharacter(id);
  }

  move(id: string, direction: Direction) {
    // console.log("move", id, direction);

    this.gridEngine.move(id, direction);
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

}
