import {
  Module,
} from '@nestjs/common';

import {
  Server,
  Room,
} from 'colyseus';


import { GameController } from './game.controller';
import { GameService } from './game.service';
import rooms from './rooms';

@Module({
  providers: [
    Server,
    GameService,
  ],
  controllers: [
    GameController,
  ],
  exports: [
    GameService,
  ]
})
export class GameModule {
  constructor(
    gameService: GameService,
  ) {
    for (const { name, room } of rooms) {
      gameService.defineRoom(name, room);
    }
  }
}
