import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
@Entity('district')
@ObjectType('District', {
  description: '地区信息列表',
})
export default class DistrictEntity {
  @Field(() => ID)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

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
