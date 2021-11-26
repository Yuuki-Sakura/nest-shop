import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DistrictLevel {
  Country = 'country', //国家
  Province = 'province', //省份
  City = 'city', //城市
  District = 'district', //县/区
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
  },
});
@Entity('district')
@ObjectType('District', {
  description: '地区信息列表',
})
export class DistrictEntity {
  @Field(() => ID)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, {
    description: '地区码',
  })
  @Column('int')
  code: number;

  @Field({
    description: '地区名称',
  })
  @Column()
  name: string;

  @Field(() => GraphQLString, {
    description: '经纬度',
  })
  get location() {
    return this.longitude + ',' + this.latitude;
  }

  @Field({
    description: '经度',
  })
  @Column('point', {
    comment: '经度',
  })
  longitude: string;

  @Field({
    description: '纬度',
  })
  @Column('point', {
    comment: '纬度',
  })
  latitude: string;

  @Field(() => DistrictLevel, {
    description: '地区级别',
  })
  @Column('simple-enum', {
    comment: '地区级别',
    enum: DistrictLevel,
  })
  level: DistrictLevel;

  @Field(() => DistrictEntity, {
    description: '父级地区',
  })
  @ManyToOne(() => DistrictEntity)
  @JoinColumn({
    name: 'parent_id',
  })
  parent: DistrictEntity;

  @Field(() => [DistrictEntity], {
    description: '子级地区',
  })
  @OneToMany(() => DistrictEntity, (district) => district.parent)
  children: DistrictEntity[];
}
