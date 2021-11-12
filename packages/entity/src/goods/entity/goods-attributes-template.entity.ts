import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import GoodsAttributesTemplateAttributesEntity from '@/goods/entity/goods-attributes-template-attributes.entity';
import { Entity, OneToMany, OneToOne } from 'typeorm';
import GoodsCategoryEntity from '@/goods/entity/goods-category.entity';

import { ObjectType } from '@nestjs/graphql';
@Entity('goods_attributes_template')
@ObjectType('GoodsAttributesTemplate', {
  description: '商品属性模板',
})
export default class GoodsAttributesTemplateEntity extends CommonEntity {
  @OneToMany(
    () => GoodsAttributesTemplateAttributesEntity,
    (attrs) => attrs.template,
  )
  attributes: GoodsAttributesTemplateAttributesEntity[];

  @OneToOne(() => GoodsCategoryEntity)
  category: GoodsCategoryEntity;
}
