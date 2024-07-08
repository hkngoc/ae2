import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

import { Room, Server } from 'colyseus';

import { AppModule } from './app.module';

import {
  Part0Room,
  Part1Room,
  Part2Room,
  Part3Room,
  Part4Room,
} from './modules/game/rooms';

// https://stackoverflow.com/questions/77563388/injecting-a-service-into-a-class-not-instantiated-by-nestjs-trying-to-implement
function injectDeps<T extends { new (...args: any[]): Room }>(
  app: INestApplication,
  target: T,
): T {
  const selfDeps = Reflect.getMetadata('self:paramtypes', target) || [];
  const dependencies = Reflect.getMetadata('design:paramtypes', target) || [];

  selfDeps.forEach((dep: any) => {
    dependencies[dep.index] = dep.param;
  });

  const injectables =
    dependencies.map((dependency: any) => {
      return app.get(dependency);
    }) || [];

  return class extends target {
    constructor(...args: any[]) {
      super(...injectables);
    }
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:1234",
    ]
  });

  const gameServer  = app.get(Server);
  // define supported Room with injectable
  gameServer.define("part0_room", injectDeps(app, Part0Room));
  gameServer.define("part1_room", injectDeps(app, Part1Room));
  gameServer.define("part2_room", injectDeps(app, Part2Room));
  gameServer.define("part3_room", injectDeps(app, Part3Room));
  gameServer.define("part4_room", injectDeps(app, Part4Room));

  gameServer.attach({ server: app.getHttpServer() });

  await app.listen(3001);
}

bootstrap();
