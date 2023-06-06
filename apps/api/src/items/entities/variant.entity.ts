import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {Item} from "./item.entity";

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int'})
  item_id: number;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column({type: 'decimal', precision: 6, scale: 2})
  price: number;

  @Column({type: 'int'})
  quantity: number;

  @ManyToOne(() => Item, item => item.variants)
  @JoinColumn([{name: "item_id", referencedColumnName: "id"}])
  item: Item;
}
