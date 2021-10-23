import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Entity } from 'typeorm';

@Entity('shop')
export default class ShopEntity extends BaseEntity {}
