import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ItemsModule} from "../items/items.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Item} from "../items/entities/item.entity";
import {Variant} from "../items/entities/variant.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: 'db/gddy.sqlite',
        entities: [Item, Variant],
        synchronize: false,
      }),
    }),
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {
}
