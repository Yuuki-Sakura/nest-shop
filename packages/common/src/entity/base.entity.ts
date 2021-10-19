import { nanoid } from '@/utils/nanoid';
import {
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

  @Field()
  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_at',
  })
  @Timestamp()
  createAt: Date;

  @Field()
  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_at',
  })
  @Timestamp()
  updateAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    name: 'delete_at',
  })
  @Timestamp()
  deleteAt: Date;
}
