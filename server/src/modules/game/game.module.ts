import {
  Module,
} from '@nestjs/common';

import {
  Server,
} from 'colyseus';

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
export class GameModule {
}
