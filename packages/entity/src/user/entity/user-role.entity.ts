import { BaseEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@/role';
import { UserEntity } from '@/user';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_role')
@ObjectType({
  description: '用户角色关联信息',
})
export default class UserRole extends BaseEntity {
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Field(() => Role)
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field()
  @Timestamp({
    name: 'expires_at',
    comment: '过期时间',
    nullable: true,
  })
  expiresAt?: Date;
}
