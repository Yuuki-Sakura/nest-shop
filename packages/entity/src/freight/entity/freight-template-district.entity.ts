import { DistrictEntity } from '@/district';
import { FreightTemplateEntity } from '@/freight';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('freight_template_district')
@ObjectType('FreightTemplateDistrict', {
  description: '配送区域',
})
export class FreightTemplateDistrictEntity extends CommonEntity {
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
    transformer: DecimalTransformer(),
  })
  first: Decimal;

  @Field({
    description: '首件/首重/首件体积价格',
  })
  @Column('decimal', {
    comment: '首件/首重/首件体积价格',
    precision: 10,
    scale: 2,
    unsigned: true,
    name: 'first_price',
    transformer: DecimalTransformer(),
  })
  firstPrice: Decimal;

  @Field({
    description: '续件/续重/续件体积',
  })
  @Column('decimal', {
    comment: '续件/续重/续件体积',
    precision: 10,
    scale: 2,
    unsigned: true,
    transformer: DecimalTransformer(),
  })
  additional: Decimal;

  @Field({
    description: '续件/续重/续件体积价格',
  })
  @Column('decimal', {
    comment: '续件/续重/续件体积',
    precision: 10,
    scale: 2,
    unsigned: true,
    name: 'additional_price',
    transformer: DecimalTransformer(),
  })
  additionalPrice: Decimal;
}
