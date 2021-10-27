import GoodsCategoryEntity from '@/goods/entity/goods-category.entity';
import GoodsCommentEntity from '@/goods/entity/goods-comment.entity';
import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('goods_spu')
@ObjectType('GoodsSpu', {
  description: '商品SPU',
})
export default class GoodsSpuEntity extends BaseEntity {
  @ApiProperty({ type: () => GoodsCategoryEntity })
  @Field(() => GoodsCategoryEntity, {
    description: 'SPU关联分类',
  })
  @ManyToOne(() => GoodsCategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: GoodsCategoryEntity;

  @ApiProperty({ type: () => [GoodsSkuEntity] })
  @Field(() => [GoodsSkuEntity], {
    description: 'SPU关联SKU',
  })
  @OneToMany(() => GoodsSkuEntity, (sku) => sku.spu, {
    cascade: true,
  })
  sku: GoodsSkuEntity[];

  @ApiProperty({ type: () => GoodsSkuEntity })
  @Field(() => GoodsSkuEntity, {
    description: 'SPU关联默认SKU',
  })
  @ManyToOne(() => GoodsSkuEntity, (sku) => sku.id)
  @JoinColumn({
    name: 'default_sku_id',
  })
  defaultSku: GoodsSkuEntity;

  @ApiProperty()
  @Field(() => Int)
  @Column('int', {
    unsigned: true,
    comment: '商品销量',
  })
  sales: number;

  @ApiProperty({ type: () => [GoodsCommentEntity] })
  @Field(() => [GoodsCommentEntity], {
    description: 'SPU关联评论',
  })
  @OneToMany(() => GoodsCommentEntity, (comment) => comment.spu)
  comments: GoodsCommentEntity[];
}
