import DistrictEntity from '@/district/entity/district.entity';
import { UserEntity } from '@/user';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_address')
export default class UserAddressEntity extends BaseEntity {
  @Column({
    comment: '收件人名称',
  })
  name: string;

  @Column({
    comment: '收件人手机号',
  })
  mobile: string;

  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'country_id',
  })
  country: DistrictEntity;

  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'province_id',
  })
  province: DistrictEntity;

  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'city_id',
  })
  city: DistrictEntity;

  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'district_id',
  })
  district: DistrictEntity;

  @Column({
    comment: '详细地址',
  })
  address: string;

  get location() {
    return this.longitude + ',' + this.latitude;
  }

  @Column('point', {
    comment: '经度',
  })
  longitude: string;

  @Column('point', {
    comment: '纬度',
  })
  latitude: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;
}
