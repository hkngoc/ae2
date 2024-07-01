import {
  Controller,
  Get,
  Req,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { GameService } from './game.service';

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get("latency")
  getLatency(): number {
    return this.gameService.getLatency();
  }

  @Get("/simulate-latency/:milliseconds")
  simulateLatency(@Req() req: Request) {
    const milliseconds = parseInt(req.params.milliseconds || "100");

    this.gameService.simulateLatency(milliseconds);

    return {
      success: true
    }
  }

  @Get("/room/:roomId/tilemap")
  async getRoomTileMap(@Param() params: { roomId: string }) {
    const { roomId } = params;

    return await this.gameService.getRoomTileMap(roomId);
  }
}
