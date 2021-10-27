import GoodsCommentEntity from '@/goods/entity/goods-comment.entity';
import GoodsSpuEntity from '@/goods/entity/goods-spu.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import GoodsAttributesEntity from '@/goods/entity/goods-attributes.entity';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';

@Entity('goods_sku')
@ObjectType('GoodsSku', {
  description: '商品SKU',
})
export default class GoodsSkuEntity extends BaseEntity {
  @ApiProperty()
  @Field(() => Int, {
    description: '商品SKU编号',
  })
  @Column('int', {
    unique: true,
    unsigned: true,
    comment: '商品SKU编号',
  })
  sn: number;

  @ApiProperty({ type: () => GoodsSpuEntity })
  @Field(() => GoodsSpuEntity, {
    description: '商品SKU关联SPU',
  })
  @ManyToOne(() => GoodsSpuEntity, (spu) => spu.sku)
  @JoinColumn({
    name: 'spu_id',
  })
  spu: GoodsSpuEntity;

  @ApiProperty()
  @Field({
    description: '商品名称',
  })
  @Column({
    comment: '商品名称',
  })
  name: string;

  @ApiProperty()
  @Field({
    description: '商品主图',
  })
  @Column({
    comment: '商品主图',
  })
  image: string;

  @ApiProperty()
  @Field({
    description: '商品轮播图',
  })
  @Column('simple-array', {
    comment: '商品轮播图',
  })
  images: string[];

  @ApiProperty()
  @Field({
    description: '商品视频',
    nullable: true,
  })
  @Column({
    comment: '商品视频',
    nullable: true,
  })
  video: string;

  @ApiProperty()
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

  @ApiProperty()
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

  @ApiProperty()
  @Field(() => Int, {
    description: '商品库存',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品库存',
  })
  stock: number;

  @ApiProperty()
  @Field(() => Int, {
    description: '商品销量',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品销量',
  })
  sales: number;

  @ApiProperty()
  @Field({
    description: '商品介绍',
  })
  @Column('text', {
    comment: '商品介绍',
  })
  content: string;

  @ApiProperty({ type: () => [GoodsAttributesEntity] })
  @Field(() => [GoodsAttributesEntity], {
    description: '商品SKU属性',
  })
  @ManyToMany(() => GoodsAttributesEntity)
  @JoinTable()
  attributes: GoodsAttributesEntity[];

  @ApiProperty({ type: () => [GoodsCommentEntity] })
  @Field(() => [GoodsCommentEntity], {
    description: '商品评论',
  })
  @OneToMany(() => GoodsCommentEntity, (comment) => comment.sku)
  comments: GoodsCommentEntity[];
}
