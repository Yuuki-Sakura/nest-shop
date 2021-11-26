import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity('carrier')
@ObjectType('Carrier', {
  description: '承运人',
})
export class CarrierEntity extends CommonEntity {
  @Column({
    comment: '承运人名称',
  })
  name: string;

  @Column({
    comment: '承运人代码',
  })
  code: string;
}
