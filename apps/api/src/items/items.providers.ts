import {DataSource} from 'typeorm';
import {Item} from './entities/item.entity';
import {Variant} from './entities/variant.entity';
import {Repositories} from '../constants';
import {Constants} from '../constants';

export const itemProviders = [
  {
    provide: Repositories.Item,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Item),
    inject: [Constants.GoodDayDataSource],
  },
  {
    provide: Repositories.Variant,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Variant),
    inject: [Constants.GoodDayDataSource],
  },
];
