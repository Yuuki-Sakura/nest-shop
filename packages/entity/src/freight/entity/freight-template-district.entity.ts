import DistrictEntity from '@/district/entity/district.entity';
import FreightTemplateEntity from '@/freight/entity/freight-template.entity';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('freight_template_district')
@ObjectType('FreightTemplateDistrict', {
  description: '配送区域',
})
export default class FreightTemplateDistrictEntity extends BaseEntity {
  @Field(() => FreightTemplateEntity, {
    description: '运费模板',
  })
  @ManyToOne(() => FreightTemplateEntity, (template) => template.id)
  @JoinColumn({
    name: 'template_id',
  })
  template: FreightTemplateEntity;

  @Field(() => DistrictEntity, {
    description: '地区',
  })
  @ManyToOne(() => DistrictEntity, (district) => district.id)
  @JoinColumn({
    name: 'district_id',
  })
  district: DistrictEntity;

  @Field({
    description: '首件/首重/首件体积',
  })
  @Column('decimal', {
    comment: '首件/首重/首件体积',
    precision: 10,
    scale: 2,
    unsigned: true,
  })
  first: string;

  @Field({
    description: '首件/首重/首件体积价格',
  })
  @Column('decimal', {
    comment: '首件/首重/首件体积价格',
    precision: 10,
    scale: 2,
    unsigned: true,
    name: 'first_price',
  })
  firstPrice: string;

  @Field({
    description: '续件/续重/续件体积',
  })
  @Column('decimal', {
    comment: '续件/续重/续件体积',
    precision: 10,
    scale: 2,
    unsigned: true,
  })
  additional: string;

  @Field({
    description: '续件/续重/续件体积价格',
  })
  @Column('decimal', {
    comment: '续件/续重/续件体积',
    precision: 10,
    scale: 2,
    unsigned: true,
    name: 'additional_price',
  })
  additionalPrice: string;
}
