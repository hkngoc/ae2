import {
  Module,
  MiddlewareConsumer,
  NestModule,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  Server,
  ServerOptions,
  Presence,
  matchMaker,
} from 'colyseus';
import { RedisPresence } from '@colyseus/redis-presence';
import { MongooseDriver } from '@colyseus/mongoose-driver';

import { monitor } from '@colyseus/monitor';
import { playground } from "@colyseus/playground";

import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  controllers: [
    GameController,
  ],
  imports: [
  ],
  providers: [
    {
      provide: "Presence",
      useFactory: (config: ConfigService) => {
        Logger.debug("create Presence option");

        return new RedisPresence({
          host: config.get<string>("redis.host"),
          port: config.get<number>("redis.port"),
          password: config.get<string>("redis.password"),
        });
      },
      inject: [
        ConfigService,
      ],
    },
    {
      provide: "Driver",
      useFactory: (config: ConfigService) => {
        return new MongooseDriver(config.get<string>("mongo.uri"),);
      },
      inject: [
        ConfigService,
      ],
    },
    {
      provide: "ServerOptions",
      useFactory: (
        config: ConfigService,
        presence?: Presence,
        driver?: matchMaker.MatchMakerDriver,
      ) => {
        Logger.debug("create ServerOptions option");

        return {
          presence: presence,
          driver: driver,
        } as ServerOptions;
      },
      inject: [
        ConfigService,
        "Presence",
        "Driver",
      ],
    },
    {
      provide: Server,
      useFactory: (config: ConfigService, options?: ServerOptions) => {
        Logger.debug("create server colyseus");

        return new Server(options);
      },
      inject: [
        ConfigService,
        "ServerOptions",
      ]
    },
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
