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
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class CommonEntity {
  @Field(() => ID)
  @ApiProperty({
    readOnly: true,
  })
  @PrimaryColumn({
    type: 'varchar',
    length: '11',
  })
  id: string = nanoid(10);

  @Field({
    description: '创建时间',
  })
  @ApiProperty({
    readOnly: true,
    description: '创建时间',
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
    description: '删除时间',
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
