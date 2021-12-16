import { IPaginateConfigMap } from '@/common/interfaces/query-config.interface';
import { FilterOperator } from '@adachi-sakura/nest-shop-common';
import { Permission } from '@adachi-sakura/nest-shop-entity';

export const PermissionPaginateConfig: IPaginateConfigMap<Permission> = {
  find: {
    name: 'FindPermission',
    filterableColumns: {
      id: [FilterOperator.EQ, FilterOperator.NOT],
      name: [FilterOperator.EQ, FilterOperator.NOT],
      resource: [FilterOperator.EQ, FilterOperator.NOT],
      route: [FilterOperator.EQ, FilterOperator.NOT],
      method: [FilterOperator.EQ, FilterOperator.NOT],
    },
    searchableColumns: ['name', 'resource', 'route'],
    defaultSortBy: [['id', 'DESC']],
    sortableColumns: ['id', 'resource', 'route', 'method'],
  },
};
