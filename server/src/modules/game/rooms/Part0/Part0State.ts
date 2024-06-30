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

import * as CloudCityLarge from "../../assets/cloud_city_large.json";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
}

export class Part0State extends Schema {
  @type("number") mapWidth: number;
  @type("number") mapHeight: number;

  @type({ map: Player }) players = new MapSchema<Player>();
  subriptions = new Subscription();

  private gridEngine: GridEngineHeadless;

  constructor() {
    super();

    this.gridEngine = new GridEngineHeadless();
    const tilemap = new TiledTilemap(CloudCityLarge);
    this.gridEngine.create(tilemap, { characters: [] });

    const intervalSubcription = interval(50).subscribe(() => {
      this.gridEngine.update(0, 50);
    });

    const positionChangeFinishedSubCription = this.gridEngine.positionChangeFinished().subscribe(({ charId, enterTile }) => {
      this.positionChangeFinished(charId, enterTile);
    });

    this.subriptions.add(intervalSubcription);
    this.subriptions.add(positionChangeFinishedSubCription);
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
    this.subriptions.unsubscribe();
  }

}
