import ArticleEntity from '@/article/entity/article.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';

@Entity('article_category')
@ObjectType('ArticleCategory', {
  description: '文章分类',
})
export class ArticleCategoryEntity extends BaseEntity {
  @Field({
    description: '分类名称',
  })
  @Column({
    comment: '分类名称',
  })
  name: string;

  @Field({
    description: '分类主图',
  })
  @Column({
    comment: '分类主图',
  })
  image: string;

  @Field(() => [ArticleEntity])
  @OneToMany(() => ArticleEntity, (article) => article.category)
  articles: ArticleEntity[];
}
