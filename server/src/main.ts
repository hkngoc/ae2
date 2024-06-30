import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { GameService } from './modules/game/game.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:1234",
    ]
  });

  const gameServer  = app.get(GameService).getServer();
  gameServer.attach({ server: app.getHttpServer() });

  await app.listen(3000);
}

bootstrap();
