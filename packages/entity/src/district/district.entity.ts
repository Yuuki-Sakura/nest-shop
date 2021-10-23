import { nanoid } from '@adachi-sakura/nest-shop-common';
import { Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

export enum DistrictLevel {
  Country = 'country',
  Province = 'province',
  City = 'city',
  District = 'district',
}

registerEnumType(DistrictLevel, {
  name: 'DistrictLevel',
});

export default class DistrictEntity {
  @Field(() => ID)
  @ApiProperty()
  @PrimaryColumn({
    default: () => nanoid(10),
  })
  id: string;

  @Field(() => Int)
  @Column('int')
  code: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  location: string;

  @Field(() => DistrictLevel)
  @Column('simple-enum', {
    enum: DistrictLevel,
  })
  level: DistrictLevel;

  @Field(() => DistrictEntity)
  @ManyToOne(() => DistrictEntity)
  @JoinColumn({
    name: 'parent_id',
  })
  parent: DistrictEntity;

  @Field(() => [DistrictEntity])
  @OneToMany(() => DistrictEntity, (district) => district.parent)
  children: DistrictEntity[];
}
