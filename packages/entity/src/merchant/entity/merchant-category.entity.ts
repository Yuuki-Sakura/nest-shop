import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@ObjectType('MerchantCategoryQualification', {
  description: '商户类目所需资质',
})
export class MerchantCategoryQualification {
  @Field({
    description: '资质名称',
  })
  name: string;

  @Field({
    description: '资质详情',
  })
  description: string;
}

@Entity('merchant_category')
@ObjectType('MerchantCategory', {
  description: '商户经营类目',
})
export default class MerchantCategoryEntity extends CommonEntity {
  @Field({
    description: '商户类目名称',
  })
  @Column({
    comment: '商户类目名称',
  })
  name: string;

  @Field(() => MerchantCategoryEntity, {
    description: '商户父类目',
  })
  @ManyToOne(() => MerchantCategoryEntity, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: MerchantCategoryEntity;

  @Field(() => [MerchantCategoryEntity], {
    description: '商户子类目',
  })
  @OneToMany(() => MerchantCategoryEntity, (category) => category.parent, {
    cascade: true,
    eager: true,
  })
  children: MerchantCategoryEntity[];

  @Field(() => [MerchantCategoryQualification], {
    description: '类目所需资质',
  })
  @Column('json', {
    comment: '类目所需资质',
  })
  qualification: MerchantCategoryQualification[];
}
