import {
  GoodsAttributesTemplateEntity,
  GoodsSkuEntity,
  GoodsSpuEntity,
} from '@/goods';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('goods_category')
@Tree('materialized-path')
@ObjectType('GoodsCategory', {
  description: '商品分类',
})
export class GoodsCategoryEntity extends CommonEntity {
  @Field({
    description: '商品分类名称',
  })
  @Column({
    comment: '商品分类名称',
  })
  name: string;

  @Field(() => GoodsCategoryEntity, {
    description: '商品父分类',
  })
  @TreeParent()
  @JoinColumn({
    name: 'parent_id',
  })
  parent: GoodsCategoryEntity;

  @Field(() => [GoodsCategoryEntity], {
    description: '商品子分类',
  })
  @TreeChildren()
  children: GoodsCategoryEntity[];

  @OneToOne(() => GoodsAttributesTemplateEntity)
  @JoinColumn({
    name: 'attributes_template_id',
  })
  attributesTemplate: GoodsAttributesTemplateEntity;

  @Field(() => GoodsSpuEntity, {
    description: '分类spu',
  })
  @OneToMany(() => GoodsSpuEntity, (spu) => spu.category)
  goodsSpu: GoodsSpuEntity[];

  @Field(() => GoodsSkuEntity, {
    description: '分类sku',
  })
  @OneToMany(() => GoodsSkuEntity, (sku) => sku.category)
  goodsSku: GoodsSkuEntity[];
}
