import { NestFactory } from '@nestjs/core';
import {
  INestApplication,
  Logger,
} from '@nestjs/common';

import {
  ConfigService,
} from '@nestjs/config';

import {
  Room,
  Server,
  // matchMaker,
} from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';

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
  gameServer.define("part0_room", injectDeps(app, Part0Room), {
    autoDispose: false,
  }).enableRealtimeListing();
  gameServer.define("part1_room", injectDeps(app, Part1Room));
  gameServer.define("part2_room", injectDeps(app, Part2Room));
  gameServer.define("part3_room", injectDeps(app, Part3Room));
  gameServer.define("part4_room", injectDeps(app, Part4Room));

  gameServer.attach({
    transport: new WebSocketTransport({
      server: app.getHttpServer()
    }),
  });

  // matchMaker.controller.exposedMethods = ["join", "joinById", "reconnect"];

  const configService = app.get(ConfigService);

  const port = configService.get<number>("PORT");
  Logger.debug("Server start at", port);
  await app.listen(port);
}

bootstrap();
