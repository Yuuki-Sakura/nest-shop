import { DistrictEntity } from '@/district';
import { FreightTemplateDistrictEntity } from '@/freight';
import { MerchantEntity } from '@/merchant';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
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
  Amount, //件数
  Weight, //重量
  Volume, //体积
}

registerEnumType(FreightTemplateType, {
  name: 'FreightTemplateType',
  description: '运费计费方式',
  valuesMap: {
    Amount: {
      description: '件数',
    },
    Weight: {
      description: '重量',
    },
    Volume: {
      description: '体积',
    },
  },
});

@Entity('freight_template')
@ObjectType('FreightTemplate', {
  description: '运费模板信息',
})
export class FreightTemplateEntity extends CommonEntity {
  @Field(() => MerchantEntity, {
    description: '运费模板所属商家',
  })
  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({
    name: 'merchant_id',
  })
  merchant: MerchantEntity;

  @Field({
    description: '模板名称',
  })
  @Column('varchar', {
    length: 32,
    comment: '模板名称',
  })
  name: string;

  @Field(() => FreightTemplateType, {
    description: '计费方式',
  })
  @Column('smallint', {
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

  @Field(() => FreightTemplateDistrictEntity, {
    description: '运费区域设置',
  })
  @OneToMany(() => FreightTemplateDistrictEntity, (district) => district.id)
  districts: FreightTemplateDistrictEntity[];
}
