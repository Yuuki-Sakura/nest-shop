import { IPaginateConfigMap } from '@/common/interfaces/query-config.interface';
import { FilterOperator } from '@adachi-sakura/nest-shop-common';
import { Role } from '@adachi-sakura/nest-shop-entity';

export const RolePaginateConfig: IPaginateConfigMap<Role> = {
  find: {
    name: 'FindRole',
    filterableColumns: {
      id: [FilterOperator.EQ, FilterOperator.NOT],
      name: [FilterOperator.EQ, FilterOperator.NOT],
    },
    searchableColumns: ['name'],
    defaultSortBy: [['createAt', 'DESC']],
    sortableColumns: ['id', 'createAt', 'sort'],
  },
};
