import { nanoid } from '@/utils/nanoid';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from '@/decorator';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class BaseEntity {
  @Field(() => ID)
  @ApiProperty()
  @PrimaryColumn({
    default: () => nanoid(10),
  })
  id: string;

  @Field({
    description: '创建时间',
  })
  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_at',
  })
  @Timestamp()
  createAt: Date;

  @Field({
    description: '更新时间',
  })
  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_at',
  })
  @Timestamp()
  updateAt: Date;

  @Field({
    description: '删除时间',
  })
  @ApiProperty()
  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    name: 'delete_at',
  })
  @Timestamp()
  deleteAt: Date;

  @Field({
    description: '排序编号',
  })
  @ApiProperty()
  @Column({ default: 0 })
  sort: number;

  @Field({
    description: '是否隐藏',
  })
  @ApiProperty()
  @Column('boolean', { default: false })
  hidden: boolean;
}