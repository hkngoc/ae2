import {
  Logger,
  Module,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,

      load: [
        configuration,
      ],
    }),
    MongooseModule.forRootAsync({
      connectionName: "ae2",
      imports: [
        ConfigModule,
      ],
      useFactory: (config: ConfigService) => {
        Logger.debug(config.get<string>("mongo.ae2.uri"));

        return {
          uri: config.get<string>("mongo.ae2.uri"),
          dbName: config.get<string>("mongo.ae2.database"),
          user: config.get<string>("mongo.user"),
          pass: config.get<string>("mongo.password"),
        }
      },
      inject: [
        ConfigService,
      ],
    }),
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
