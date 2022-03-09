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
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { SnowflakeIdv1 } from 'simple-flakeid';

export const snowflake = new SnowflakeIdv1({
  workerId: 1,
});

@Entity()
@ObjectType()
export class CommonEntity {
  @Field(() => ID)
  @ApiProperty({
    readOnly: true,
  })
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string = snowflake.NextBigId().toString();

  @Field({
    description: '创建时间',
  })
  @ApiProperty({
    readOnly: true,
    description: '创建时间',
    type: 'integer',
    maximum: 9999999999999,
    example: Date.now(),
  })
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
  @ApiProperty({
    nullable: true,
    readOnly: true,
    description: '更新时间',
    type: 'integer',
    maximum: 9999999999999,
    example: Date.now(),
  })
  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_at',
  })
  @Timestamp()
  updateAt: Date;

  @Field({
    description: '删除时间',
    nullable: true,
  })
  @ApiProperty({
    nullable: true,
    readOnly: true,
    required: false,
    description: '删除时间',
    type: 'integer',
    maximum: 9999999999999,
    example: Date.now(),
  })
  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    name: 'delete_at',
  })
  @Timestamp()
  deleteAt: Date;

  @Field(() => Int, {
    description: '排序编号',
  })
  @ApiProperty({
    description: '排序编号',
    readOnly: true,
  })
  @Column({ default: 0, comment: '排序编号' })
  sort: number;

  @Field({
    description: '是否隐藏',
  })
  @ApiProperty({
    description: '是否隐藏',
    readOnly: true,
  })
  @Column('boolean', { default: false, name: 'is_hidden', comment: '是否隐藏' })
  isHidden: boolean;
}
