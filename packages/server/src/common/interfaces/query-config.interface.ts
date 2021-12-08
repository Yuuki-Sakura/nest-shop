import { PaginateConfig } from '@adachi-sakura/nest-shop-common';

export interface IPaginateConfig<T> {
  [key: string]: PaginateConfig<T>;
}
