import {
  Controller,
  Get,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GameService } from './game.service';

@Controller()
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
}
