import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_feedback')
@ObjectType('Feedback', {
  description: '用户反馈',
})
export class FeedbackEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '反馈用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field({
    description: '反馈内容',
  })
  @Column({
    comment: '反馈内容',
  })
  content: string;

  @Field(() => [GraphQLString], {
    description: '反馈图片',
  })
  @Column('json', {
    comment: '反馈图片',
  })
  images: string[];

  @Field({
    description: '手机号',
  })
  @Column({ comment: '手机号', unique: true })
  phone: string;
}
