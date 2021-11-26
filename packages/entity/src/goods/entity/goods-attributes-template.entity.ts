import {
  GoodsAttributesTemplateAttributesEntity,
  GoodsCategoryEntity,
} from '@/goods';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Entity, OneToMany, OneToOne } from 'typeorm';

import { ObjectType } from '@nestjs/graphql';
@Entity('goods_attributes_template')
@ObjectType('GoodsAttributesTemplate', {
  description: '商品属性模板',
})
export class GoodsAttributesTemplateEntity extends CommonEntity {
  @OneToMany(
    () => GoodsAttributesTemplateAttributesEntity,
    (attrs) => attrs.template,
  )
  attributes: GoodsAttributesTemplateAttributesEntity[];

  @OneToOne(() => GoodsCategoryEntity)
  category: GoodsCategoryEntity;
}
