import {
  Module,
  NestModule,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    GameModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {
}
