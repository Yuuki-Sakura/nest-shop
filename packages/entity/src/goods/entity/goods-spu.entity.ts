import GoodsCategoryEntity from '@/goods/entity/goods-category.entity';
import GoodsCommentEntity from '@/goods/entity/goods-comment.entity';
import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('goods_spu')
@ObjectType('GoodsSpu', {
  description: '商品SPU',
})
export default class GoodsSpuEntity extends BaseEntity {
  @ManyToOne(() => GoodsCategoryEntity, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: GoodsCategoryEntity;

  @OneToMany(() => GoodsSkuEntity, (sku) => sku.spu)
  sku: GoodsSkuEntity[];

  @ManyToOne(() => GoodsSkuEntity)
  @JoinColumn({
    name: 'default_sku',
  })
  defaultSku: GoodsSkuEntity;

  @Column('int', {
    unsigned: true,
    comment: '商品销量',
  })
  sales: number;

  @OneToMany(() => GoodsCommentEntity, (comment) => comment.spu)
  comments: GoodsCommentEntity[];
}
