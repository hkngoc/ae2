import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  Server,
} from 'colyseus';

import * as CloudCityLarge from './assets/cloud_city_large.json';

@Injectable()
export class GameService {
  private latencySimulationMs: number = 100;
  @Inject()
  private server: Server;

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
