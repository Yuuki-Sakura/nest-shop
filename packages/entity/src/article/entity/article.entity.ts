import { ArticleCategoryEntity } from '@/article/entity/article-category.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';

export enum PublishStatus {
  Recycle = -1, // 回收站
  Draft, // 草稿
  Published, // 已发布
}

registerEnumType(PublishStatus, {
  name: 'PublishStatus',
  valuesMap: {
    Recycle: {
      description: '回收站',
    },
    Draft: {
      description: '草稿',
    },
    Published: {
      description: '已发布',
    },
  },
});

@Entity('article')
@ObjectType('Article', {
  description: '文章',
})
export default class ArticleEntity extends CommonEntity {
  @Field({
    description: '文章标题',
  })
  @Column({ comment: '文章标题' })
  title: string;

  @Field({
    description: '概述',
  })
  @Column('text', { comment: '概述' })
  summary: string;

  @Field({
    description: '文章主图',
  })
  @Column({
    comment: '文章主图',
  })
  image: string;

  @Field({
    description: '文章',
  })
  @Column('text', { comment: '文章' })
  body: string;

  @Field(() => ArticleCategoryEntity)
  @ManyToOne(() => ArticleCategoryEntity, (category) => category.articles)
  @JoinColumn({
    name: 'category_id',
  })
  category: ArticleCategoryEntity;

  @Field(() => [String])
  @Column('json')
  tags: string[];

  @Field({
    description: '作者',
  })
  @Column({
    comment: '作者',
  })
  author: string;

  @Field(() => PublishStatus, {
    description: '发布状态',
  })
  @Column('smallint', { comment: '发布状态' })
  status: PublishStatus;
}
