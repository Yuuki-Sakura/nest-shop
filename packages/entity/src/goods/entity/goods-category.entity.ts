import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import GoodsAttributesTemplateEntity from '@/goods/entity/goods-attributes-template.entity';

@Entity('goods_category')
@ObjectType('GoodsCategory', {
  description: '商品分类',
})
export default class GoodsCategoryEntity extends BaseEntity {
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
  @ManyToOne(() => GoodsCategoryEntity, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: GoodsCategoryEntity;

  @Field(() => [GoodsCategoryEntity], {
    description: '商品子分类',
  })
  @OneToMany(() => GoodsCategoryEntity, (category) => category.parent, {
    cascade: true,
    eager: true,
  })
  children: GoodsCategoryEntity[];

  @OneToOne(() => GoodsAttributesTemplateEntity)
  @JoinColumn({
    name: 'attributes_template_id',
  })
  attributesTemplate: GoodsAttributesTemplateEntity;
}
