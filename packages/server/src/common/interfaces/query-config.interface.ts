import { PaginateConfig } from '@adachi-sakura/nest-shop-common';
export type IPaginateConfig<T> = PaginateConfig<T> & { name: string };
export interface IPaginateConfigMap<T> {
  [key: string]: IPaginateConfig<T>;
}
