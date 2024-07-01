import { Injectable } from '@nestjs/common';

import {
  Server,
  Room,
} from "colyseus";

import * as CloudCityLarge from "./assets/cloud_city_large.json";

type Type<T> = new (...args: any[]) => T;

@Injectable()
export class GameService {
  private latencySimulationMs: number = 100;

  constructor(
    private server: Server,
  ) {
  }

  getServer() {
    return this.server;
  }

  defineRoom(name: string, room: Type<Room<any, any>>) {
    this.server.define(name, room);
  }

  simulateLatency(milliseconds: number) {
    this.latencySimulationMs = milliseconds;
    this.server.simulateLatency(milliseconds);
  }

  getLatency() {
    return this.latencySimulationMs;
  }

  async getRoomTileMap(roomId: string) {
    return CloudCityLarge;
  }
}
