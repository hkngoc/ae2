import { Injectable } from '@nestjs/common';

import {
  Server,
  Room,
} from "colyseus";

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
    this.server.define(name, room)
  }

  simulateLatency(milliseconds: number) {
    this.latencySimulationMs = milliseconds;
    this.server.simulateLatency(milliseconds);
  }

  getLatency() {
    return this.latencySimulationMs;
  }
}
