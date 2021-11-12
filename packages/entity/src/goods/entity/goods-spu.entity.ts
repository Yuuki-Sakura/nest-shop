import GoodsCategoryEntity from '@/goods/entity/goods-category.entity';
import GoodsCommentEntity from '@/goods/entity/goods-comment.entity';
import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import MerchantCategoryEntity from '@/merchant/entity/merchant-category.entity';
import MerchantEntity from '@/merchant/entity/merchant.entity';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('goods_spu')
@ObjectType('GoodsSpu', {
  description: '商品SPU',
})
export default class GoodsSpuEntity extends CommonEntity {
  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({
    name: 'merchant_id',
  })
  merchant: MerchantEntity;

  @ApiProperty({ type: () => GoodsCategoryEntity })
  @Field(() => GoodsCategoryEntity, {
    description: 'SPU关联分类',
  })
  @ManyToOne(() => GoodsCategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: GoodsCategoryEntity;

  @ApiProperty({ type: () => [MerchantCategoryEntity] })
  @Field(() => [MerchantCategoryEntity], {
    description: 'SKU关联商家分类',
  })
  @ManyToMany(() => MerchantCategoryEntity, (category) => category.id)
  @JoinTable({
    name: 'merchant_category_spu',
    joinColumn: {
      name: 'spu_id',
    },
    inverseJoinColumn: {
      name: 'merchant_category_id',
    },
  })
  merchantCategory: MerchantCategoryEntity[];

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
  @Field(() => Int, {
    description: '商品销量',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品销量',
    default: 0,
  })
  sales: number;

  @ApiProperty({ type: () => [GoodsCommentEntity] })
  @Field(() => [GoodsCommentEntity], {
    description: 'SPU关联评论',
  })
  @OneToMany(() => GoodsCommentEntity, (comment) => comment.spu)
  comments: GoodsCommentEntity[];
}
