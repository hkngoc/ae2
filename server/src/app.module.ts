import {
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';

import { monitor } from '@colyseus/monitor';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(monitor())
      .forRoutes('/monitor');
  }
}
