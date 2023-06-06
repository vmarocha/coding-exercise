import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from "typeorm";
import {Item} from "./entities/item.entity";

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {
  }

  findAll(): Promise<Item[]> {
    return this.itemRepository.find({
      relations: {
        variants: true,
      },
    });
  }
}
