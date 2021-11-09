import DistrictEntity from '@/district/entity/district.entity';
import FreightTemplateDistrictEntity from '@/freight/entity/freight-template-district.entity';
import MerchantEntity from '@/merchant/entity/merchant.entity';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum FreightTemplateType {
  Amount, //数量
  Weight, //重量
  Volume, //体积
}

registerEnumType(FreightTemplateType, {
  name: 'FreightTemplateType',
  description: '运费计费方式',
});

@Entity('freight_template')
@ObjectType('FreightTemplate', {
  description: '运费模板信息',
})
export default class FreightTemplateEntity extends BaseEntity {
  @Field(() => MerchantEntity)
  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({
    name: 'merchant_id',
  })
  merchant: MerchantEntity;

  @Field()
  @Column('varchar', {
    length: 32,
    comment: '模板名称',
  })
  name: string;

  @Field(() => FreightTemplateType)
  @Column('simple-enum', {
    enum: FreightTemplateType,
    comment: '计费方式',
  })
  type: FreightTemplateType;

  @Field(() => DistrictEntity, {
    description: '包邮区域',
  })
  @ManyToMany(() => DistrictEntity, (district) => district.id)
  @JoinTable({
    name: 'freight_templates_free_area',
    joinColumn: {
      name: 'freight_template_id',
    },
    inverseJoinColumn: {
      name: 'free_district_id',
    },
  })
  freeArea: DistrictEntity[];

  @Field(() => DistrictEntity, {
    description: '不配送区域',
  })
  @ManyToMany(() => DistrictEntity, (district) => district.id)
  @JoinTable({
    name: 'freight_templates_no_delivery_area',
    joinColumn: {
      name: 'freight_template_id',
    },
    inverseJoinColumn: {
      name: 'no_delivery_district_id',
    },
  })
  noDeliveryArea: DistrictEntity[];

  @Field({
    description: '运费说明',
  })
  @Column({
    comment: '运费说明',
  })
  info: string;

  @Field(() => FreightTemplateDistrictEntity)
  @OneToMany(() => FreightTemplateDistrictEntity, (district) => district.id)
  districts: FreightTemplateDistrictEntity[];
}
