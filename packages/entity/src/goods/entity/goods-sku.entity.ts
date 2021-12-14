import {
  GoodsAttributesEntity,
  GoodsCategoryEntity,
  GoodsCommentEntity,
  GoodsSpuEntity,
} from '@/goods';
import { MerchantEntity, MerchantGoodsCategoryEntity } from '@/merchant';
import { DecimalTransformer, ToDecimal } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';
import { GraphQLString } from 'graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  VersionColumn,
} from 'typeorm';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';

@ObjectType({
  description: '商品SKU属性',
})
export class GoodsSkuInfo {
  @ApiProperty()
  @Field({
    description: '属性名称',
  })
  name: string;

  @ApiProperty()
  @Field({
    description: '属性值',
  })
  value: string;
}

@Entity('goods_sku')
@ObjectType('GoodsSku', {
  description: '商品SKU',
})
export class GoodsSkuEntity extends CommonEntity {
  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({
    name: 'merchant_id',
  })
  merchant: MerchantEntity;

  @ApiProperty({ type: () => GoodsCategoryEntity })
  @Field(() => GoodsCategoryEntity, {
    description: 'SKU关联分类',
  })
  @ManyToOne(() => GoodsCategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: GoodsCategoryEntity;

  @ApiProperty({ type: () => [MerchantGoodsCategoryEntity] })
  @Field(() => [MerchantGoodsCategoryEntity], {
    description: 'SKU关联商家分类',
  })
  @ManyToMany(() => MerchantGoodsCategoryEntity, (category) => category.id)
  @JoinTable({
    name: 'merchant_category_sku',
    joinColumn: {
      name: 'sku_id',
    },
    inverseJoinColumn: {
      name: 'merchant_category_id',
    },
  })
  merchantCategory: MerchantGoodsCategoryEntity[];

  @ApiProperty()
  @Field(() => Int, {
    description: '商品SKU编号',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品SKU编号',
  })
  sn: number;

  @ApiProperty()
  @Field(() => GoodsSkuInfo, {
    description: '商品SKU属性',
  })
  @Column('json', {
    comment: '商品SKU属性',
    name: 'sku_info',
  })
  skuInfo: GoodsSkuInfo[];

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
  @Field(() => [GraphQLString], {
    description: '商品关键词',
  })
  @Column('simple-array', {
    comment: '商品关键词',
  })
  keywords: string[];

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
    description: '商品封面图',
  })
  @Column({
    comment: '商品封面图',
  })
  thumbnail: string;

  @ApiProperty()
  @Field(() => [GraphQLString], {
    description: '商品轮播图',
  })
  @Column('json', {
    comment: '商品轮播图',
    name: 'slider_images',
  })
  sliderImages: string[];

  @Field({
    description: '商品视频链接',
    nullable: true,
  })
  @ApiProperty()
  @Column({
    comment: '商品视频链接',
    nullable: true,
    name: 'video_link',
  })
  videoLink: string;

  @Field({
    description: '商品价格',
  })
  @ApiProperty({
    description: '商品价格',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '商品价格',
    unsigned: true,
    precision: 11,
    scale: 2,
    transformer: DecimalTransformer(2),
    nullable: true,
  })
  @ToDecimal()
  price: Decimal;

  @Field({
    description: '商品成本价',
  })
  @ApiProperty({
    description: '商品成本价',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '商品成本价',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'cost_price',
    transformer: DecimalTransformer(2),
  })
  @ToDecimal()
  costPrice: Decimal;

  @Field({
    description: '商品划线价',
  })
  @ApiProperty({
    description: '商品划线价',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '商品划线价',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'line_price',
    transformer: DecimalTransformer(2),
  })
  @ToDecimal()
  linePrice: Decimal;

  @ApiProperty()
  @Field(() => Int, {
    description: '商品库存',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品库存',
  })
  stock: number;

  @Field({
    description: '商品单位',
  })
  @Column({
    comment: '商品单位',
    default: '',
    name: 'unit_name',
  })
  unitName: string;

  @ApiProperty()
  @Field(() => Int, {
    description: '商品销量',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品销量',
    default: 0,
  })
  sales: number;

  @ApiProperty()
  @Field({
    description: '商品简介',
  })
  @Column('text', {
    comment: '商品简介',
  })
  summary: string;

  @Field({
    description: '是否为虚拟商品',
  })
  @Column('boolean', {
    comment: '是否为虚拟商品',
    default: false,
    name: 'is_virtual',
  })
  isVirtual: boolean;

  @ApiProperty()
  @Field(() => [GraphQLString], {
    description: '商品详情图',
  })
  @Column('json', {
    comment: '商品详情图',
    name: 'desc_images',
  })
  descImages: string[];

  @ApiProperty({ type: () => [GoodsAttributesEntity] })
  @Field(() => [GoodsAttributesEntity], {
    description: '商品SKU属性',
  })
  @ManyToMany(() => GoodsAttributesEntity)
  @JoinTable({
    joinColumn: {
      name: 'goods_sku_id',
    },
    inverseJoinColumn: {
      name: 'goods_attributes_id',
    },
  })
  attributes: GoodsAttributesEntity[];

  @ApiProperty({ type: () => [GoodsCommentEntity] })
  @Field(() => [GoodsCommentEntity], {
    description: '商品评论',
  })
  @OneToMany(() => GoodsCommentEntity, (comment) => comment.sku)
  comments: GoodsCommentEntity[];

  @ApiProperty()
  @Field(() => Int, {
    description: '评论数',
  })
  @Column('int', {
    comment: '评论数',
    unsigned: true,
    default: 0,
    name: 'comment_count',
  })
  commentCount: number;

  @ApiProperty()
  @Field(() => Int, {
    description: '商品虚拟销量',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品虚拟销量',
    default: 0,
    name: 'virtual_sales',
  })
  virtualSales: number;

  @ApiProperty()
  @Field(() => Int, {
    description: '起购数量',
  })
  @Column('int', {
    unsigned: true,
    comment: '起购数量',
    default: 0,
  })
  moq: number;

  @ApiProperty()
  @Field(() => Int, {
    description: '单次最大购买数量',
  })
  @Column('int', {
    unsigned: true,
    comment: '单次最大购买数量',
    default: 0,
    name: 'once_order_quantity',
  })
  onceOrderQuantity: number;

  @Field(() => Int, {
    description: '版本',
  })
  @VersionColumn({
    comment: '版本',
    default: 0,
  })
  version: number;
}
