import {
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';

import {
  Server,
  matchMaker,
} from 'colyseus';

import { monitor } from '@colyseus/monitor';
import { playground } from "@colyseus/playground";

import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  controllers: [
    GameController,
  ],
  providers: [
    Server,
    GameService,
  ],
  exports: [
    GameService,
  ],
})
export class GameModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(monitor())
      .forRoutes('/game/monitor');

    consumer
      .apply(playground)
      .forRoutes('/game/playground');
  }
}
