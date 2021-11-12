import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import GoodsAttributesTemplateEntity from '@/goods/entity/goods-attributes-template.entity';

@Entity('goods_attributes_template_attributes')
@ObjectType('GoodsAttributesTemplateAttributes', {
  description: '商品属性模板',
})
export default class GoodsAttributesTemplateAttributesEntity extends CommonEntity {
  @Field(() => GoodsAttributesTemplateEntity, {
    description: '属性模板',
  })
  @ManyToOne(() => GoodsAttributesTemplateEntity)
  @JoinColumn({
    name: 'goods_attributes_template_id',
  })
  template: GoodsAttributesTemplateEntity;

  @Field({
    description: '属性名称',
  })
  @Column({
    comment: '属性名称',
  })
  name: string;

  @Field({
    description: '单位',
  })
  @Column({
    comment: '单位',
  })
  unit: string;

  @Field({
    description: '类型',
  })
  @Column({
    comment: '类型',
  })
  type: string;

  @Field({
    description: '是否参加搜索',
  })
  @Column('boolean', {
    comment: '是否参加搜索',
  })
  isSearch: boolean;

  @Field({
    description: '是否为必选项',
  })
  @Column('boolean', {
    comment: '是否为必选项',
  })
  require: boolean;

  @Field(() => [GraphQLString], {
    description: '属性可选值',
  })
  @Column('simple-json', {
    comment: '属性可选值',
  })
  values: string[];

  @Field({
    description: '属性组名称',
  })
  @Column({
    comment: '属性组名称',
    name: 'group_name',
  })
  groupName: string;
}
