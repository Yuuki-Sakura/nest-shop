import GoodsCommentEntity from '@/goods/entity/goods-comment.entity';
import GoodsSpuEntity from '@/goods/entity/goods-spu.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('goods_sku')
@ObjectType('GoodsSku', {
  description: '商品SKU',
})
export default class GoodsSkuEntity extends BaseEntity {
  @Field(() => Int, {
    description: '商品SKU编号',
  })
  @Column('int', {
    unique: true,
    unsigned: true,
    comment: '商品SKU编号',
  })
  sn: number;

  @Field(() => GoodsSpuEntity, {
    description: '商品SKU关联SPU',
  })
  @ManyToOne(() => GoodsSpuEntity, (spu) => spu.sku)
  @JoinColumn({
    name: 'spu_id',
  })
  spu: GoodsSpuEntity;

  @Field({
    description: '商品名称',
  })
  @Column({
    comment: '商品名称',
  })
  name: string;

  @Field({
    description: '商品主图',
  })
  @Column({
    comment: '商品主图',
  })
  image: string;

  @Field({
    description: '商品轮播图',
  })
  @Column('simple-array', {
    comment: '商品轮播图',
  })
  images: string[];

  @Field({
    description: '商品视频',
    nullable: true,
  })
  @Column({
    comment: '商品视频',
    nullable: true,
  })
  video: string;

  @Field({
    description: '商品价格',
  })
  @Column('decimal', {
    comment: '商品价格',
    unsigned: true,
    precision: 11,
    scale: 2,
  })
  price: string;

  @Field({
    description: '商品原价',
  })
  @Column('decimal', {
    comment: '商品划线价',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'line_price',
  })
  linePrice: string;

  @Field({
    description: '商品库存',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品库存',
  })
  stock: number;

  @Field({
    description: '商品销量',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品销量',
  })
  sales: number;

  @Field({
    description: '商品介绍',
  })
  @Column('text', {
    comment: '商品介绍',
  })
  content: string;

  @Field(() => GoodsCommentEntity, {
    description: '商品评论',
  })
  @OneToMany(() => GoodsCommentEntity, (comment) => comment.sku)
  comments: GoodsCommentEntity[];
}
