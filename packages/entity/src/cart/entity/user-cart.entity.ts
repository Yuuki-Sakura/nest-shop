import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import { UserEntity } from '@/user';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_cart')
@ObjectType('UserCart', {
  description: '用户购物车',
})
export default class UserCartEntity extends BaseEntity {
  @Field(() => UserEntity, {
    description: '购物车关联用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @ManyToOne(() => GoodsSkuEntity, (sku) => sku.id)
  @JoinColumn({
    name: 'sku_id',
  })
  sku: GoodsSkuEntity;

  @Column('decimal', {
    comment: '加入购物车价格',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'add_price',
  })
  addPrice: string;

  @Column('int', {
    comment: '数量',
  })
  count: number;
}
