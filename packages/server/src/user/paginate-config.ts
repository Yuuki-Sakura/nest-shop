import { IPaginateConfigMap } from '@/common/interfaces/query-config.interface';
import { FilterOperator } from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';

export const UserPaginateConfig: IPaginateConfigMap<UserEntity> = {
  find: {
    name: 'FindUser',
    filterableColumns: {
      id: [FilterOperator.EQ, FilterOperator.NOT],
      nickname: [FilterOperator.EQ, FilterOperator.NOT],
      avatar: [FilterOperator.NULL, FilterOperator.NOT],
      birthday: [
        FilterOperator.EQ,
        FilterOperator.NOT,
        FilterOperator.NULL,
        FilterOperator.GT,
        FilterOperator.GTE,
        FilterOperator.LT,
        FilterOperator.LTE,
      ],
      status: [FilterOperator.EQ, FilterOperator.NOT],
      lastLoginIp: [FilterOperator.EQ, FilterOperator.NOT, FilterOperator.NULL],
      lastLoginAt: [
        FilterOperator.EQ,
        FilterOperator.NOT,
        FilterOperator.NULL,
        FilterOperator.GT,
        FilterOperator.GTE,
        FilterOperator.LT,
        FilterOperator.LTE,
      ],
    },
    searchableColumns: [
      'nickname',
      'gender',
      'birthday',
      'lastLoginAt',
      'lastLoginIp',
    ],
    defaultSortBy: [['createAt', 'DESC']],
    sortableColumns: [
      'id',
      'createAt',
      'nickname',
      'gender',
      'lastLoginAt',
      'balance',
      'points',
      'sort',
    ],
  },
};
