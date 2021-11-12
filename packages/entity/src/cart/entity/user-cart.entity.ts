import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_cart')
@ObjectType('UserCart', {
  description: '用户购物车',
})
export default class UserCartEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '购物车关联用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => GoodsSkuEntity)
  @ManyToOne(() => GoodsSkuEntity, (sku) => sku.id)
  @JoinColumn({
    name: 'sku_id',
  })
  sku: GoodsSkuEntity;

  @Field({
    description: '加入购物车价格',
  })
  @Column('decimal', {
    comment: '加入购物车价格',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'add_price',
    transformer: DecimalTransformer(),
  })
  addPrice: Decimal;

  @Field({
    description: '商品数量',
  })
  @Column('int', {
    comment: '商品数量',
  })
  quantity: number;
}
