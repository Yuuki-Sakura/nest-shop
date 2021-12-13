import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

export enum DistrictLevel {
  Country = 'country', //国家
  Province = 'province', //省份
  City = 'city', //城市
  District = 'district', //县/区
  Street = 'street', //街道
}

registerEnumType(DistrictLevel, {
  name: 'DistrictLevel',
  description: '地区级别',
  valuesMap: {
    Country: {
      description: '国家',
    },
    Province: {
      description: '省份',
    },
    City: {
      description: '城市',
    },
    District: {
      description: '县/区',
    },
    Street: {
      description: '镇/街道',
    },
  },
});
@Entity('district')
@ObjectType('District', {
  description: '地区信息列表',
})
@Tree('materialized-path')
export class DistrictEntity {
  @Field(() => ID)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, {
    description: '地区码',
  })
  @ApiProperty({
    description: '地区码',
  })
  @Column('varchar', {
    length: 6,
  })
  @Index()
  code: string;

  @Field({
    description: '地区名称',
  })
  @ApiProperty({
    description: '地区名称',
  })
  @Column()
  @Index()
  name: string;

  @Field(() => GraphQLString, {
    description: '经纬度',
  })
  @ApiProperty({
    description: '经纬度',
  })
  get location() {
    return this.longitude + ',' + this.latitude;
  }

  @Field({
    description: '经度',
  })
  @ApiProperty({
    description: '经度',
  })
  @Column({
    comment: '经度',
  })
  longitude: string;

  @Field({
    description: '纬度',
  })
  @ApiProperty({
    description: '纬度',
  })
  @Column({
    comment: '纬度',
  })
  latitude: string;

  @Field(() => DistrictLevel, {
    description: '地区级别',
  })
  @ApiProperty({
    description: '地区级别',
  })
  @Column('simple-enum', {
    comment: '地区级别',
    enum: DistrictLevel,
  })
  level: DistrictLevel;

  @Field(() => DistrictEntity, {
    description: '父级地区',
    nullable: true,
  })
  @ApiProperty({
    description: '父级地区',
  })
  @TreeParent()
  @JoinColumn({
    name: 'parent_id',
  })
  parent: DistrictEntity;

  @Field(() => [DistrictEntity], {
    description: '子级地区',
    nullable: true,
  })
  @ApiProperty({
    description: '子级地区',
  })
  @TreeChildren({
    cascade: true,
  })
  children: DistrictEntity[];
}
