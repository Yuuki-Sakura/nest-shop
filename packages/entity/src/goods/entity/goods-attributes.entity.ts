import { GoodsAttributesTemplateAttributesEntity } from '@/goods';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';

@Entity('goods_attributes')
@ObjectType('GoodsAttributes')
export class GoodsAttributesEntity extends CommonEntity {
  @ManyToOne(() => GoodsAttributesTemplateAttributesEntity)
  @JoinColumn({
    name: 'goods_attributes_template_attributes_id',
  })
  template: GoodsAttributesTemplateAttributesEntity;

  @Field({
    description: '属性名称',
  })
  @Column({
    comment: '属性名称',
  })
  name: string;

  @Field({
    description: '属性单位',
  })
  @Column({
    comment: '属性单位',
  })
  unit: string;

  @Field({
    description: '属性值',
  })
  @Column({
    comment: '属性值',
  })
  value: string;

  @Field({
    description: '属性组名称',
  })
  @Column({
    comment: '属性组名称',
    name: 'group_name',
  })
  groupName: string;
}
