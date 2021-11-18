import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import GoodsSpuEntity from '@/goods/entity/goods-spu.entity';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('merchant_goods_category')
@ObjectType('MerchantGoodsCategory', {
  description: '商户商品分类',
})
export default class MerchantGoodsCategoryEntity extends CommonEntity {
  @Field({
    description: '商户商品分类名称',
  })
  @Column({
    comment: '商户商品分类名称',
  })
  name: string;

  @Field(() => MerchantGoodsCategoryEntity, {
    description: '商户商品父分类',
  })
  @ManyToOne(() => MerchantGoodsCategoryEntity, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: MerchantGoodsCategoryEntity;

  @Field(() => [MerchantGoodsCategoryEntity], {
    description: '商户商品子分类',
  })
  @OneToMany(() => MerchantGoodsCategoryEntity, (category) => category.parent, {
    cascade: true,
    eager: true,
  })
  children: MerchantGoodsCategoryEntity[];

  @Field(() => [GoodsSpuEntity], {
    description: '分类下spu',
  })
  @OneToMany(() => GoodsSpuEntity, (spu) => spu.merchantCategory)
  goodsSpu: GoodsSpuEntity[];

  @Field(() => [GoodsSkuEntity], {
    description: '分类下sku',
  })
  @OneToMany(() => GoodsSkuEntity, (sku) => sku.merchantCategory)
  goodsSku: GoodsSkuEntity[];
}
