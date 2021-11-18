import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import GoodsSpuEntity from '@/goods/entity/goods-spu.entity';
import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('goods_comment')
@ObjectType('GoodsComment', {
  description: '商品评价',
})
export default class GoodsCommentEntity extends CommonEntity {
  @Field({
    description: '评论内容',
  })
  @Column({
    comment: '评论内容',
  })
  content: string;

  @Field(() => [GraphQLString], {
    description: '评论图片',
  })
  @Column('json', {
    comment: '评论图片',
  })
  images: string[];

  @Field({
    description: '评论视频',
  })
  @Column({
    comment: '评论视频',
  })
  video: string;

  @Field(() => GoodsSkuEntity, {
    description: '评论关联SKU',
  })
  @ManyToOne(() => GoodsSkuEntity, (sku) => sku.id)
  @JoinColumn({ name: 'sku_id' })
  sku: GoodsSkuEntity;

  @Field(() => GoodsSpuEntity, {
    description: '评论关联SPU',
  })
  @ManyToOne(() => GoodsSpuEntity, (spu) => spu.id)
  @JoinColumn({ name: 'spu_id' })
  spu: GoodsSpuEntity;

  @Field(() => UserEntity, {
    description: '评论关联用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Column('json')
  ratings: string;
}
