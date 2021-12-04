// noinspection JSConstantReassignment

import {
  Column,
  Paginated,
  PaginateQuery as IPaginateQuery,
  SortBy,
} from '@adachi-sakura/nest-shop-common';
import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyOptions,
  ApiResponseProperty,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';

type ApiResponseMetadata<T> = Pick<
  ApiPropertyOptions,
  'example' | 'format' | 'enum' | 'deprecated'
> & {
  type: Type<T> | Function;
};

export class PaginateQuery implements IPaginateQuery {
  @ApiProperty({
    required: false,
    description: '页码',
    default: 0,
  })
  page?: number;
  @ApiProperty({
    required: false,
    description: '每页条数',
    default: 20,
  })
  limit?: number;
  @ApiProperty({
    required: false,
    type: 'array',
    description: '[排序列,排序方式(ASC | DESC)]',
    items: {
      type: 'array',
      readOnly: true,
      items: {
        oneOf: [
          { type: 'string', readOnly: true },
          { type: 'string', enum: ['ASC', 'DESC'], readOnly: true },
        ],
      },
      maxItems: 2,
      minItems: 2,
    },
  })
  sortBy?: [string, string][];
  @ApiProperty({
    required: false,
    description: '搜索列',
    type: [String],
  })
  searchBy?: string[];
  @ApiProperty({
    required: false,
    description: '搜索关键词',
  })
  search?: string;
  @ApiProperty({
    required: false,
    type: 'object',
    description: '过滤列',
    additionalProperties: {
      anyOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      ],
    },
  })
  filter?: { [column: string]: string | string[] };
  path?: string;
}

class SwaggerPaginatedMetadata<T> {
  @ApiProperty({
    description: '每页条数',
    readOnly: true,
  })
  itemsPerPage: number;
  @ApiProperty({
    description: '总条数',
    readOnly: true,
  })
  totalItems: number;
  @ApiProperty({
    description: '当前页',
    readOnly: true,
  })
  currentPage: number;
  @ApiProperty({
    description: '总页数',
    readOnly: true,
  })
  totalPages: number;
  @ApiProperty({
    readOnly: true,
    type: 'array',
    description: '[排序列,排序方式(ASC | DESC)]',
    items: {
      type: 'array',
      readOnly: true,
      items: {
        oneOf: [
          { type: 'string', readOnly: true },
          { type: 'string', enum: ['ASC', 'DESC'], readOnly: true },
        ],
      },
      maxItems: 2,
      minItems: 2,
    },
  })
  sortBy: SortBy<T>;
  @ApiProperty({
    description: '搜索列',
    readOnly: true,
    type: [String],
  })
  searchBy: Column<T>[];
  @ApiProperty({
    readOnly: true,
    description: '搜索关键词',
  })
  search: string;
  @ApiProperty({
    description: '过滤列',
    readOnly: true,
    type: 'object',
    additionalProperties: {
      anyOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      ],
    },
  })
  filter?: { [column: string]: string | string[] };
}

class SwaggerPaginatedLinks {
  @ApiProperty({
    required: false,
    nullable: true,
    readOnly: true,
  })
  first?: string;
  @ApiProperty({
    required: false,
    nullable: true,
    readOnly: true,
  })
  previous?: string;
  @ApiResponseProperty()
  current: string;
  @ApiProperty({
    required: false,
    nullable: true,
    readOnly: true,
  })
  next?: string;
  @ApiProperty({
    required: false,
    nullable: true,
    readOnly: true,
  })
  last?: string;
}

class SwaggerPaginated<T> implements Paginated<T> {
  data: T[];
  @ApiResponseProperty({ type: SwaggerPaginatedMetadata })
  meta: SwaggerPaginatedMetadata<T>;
  @ApiProperty({
    type: SwaggerPaginatedLinks,
    readOnly: true,
    required: false,
    nullable: true,
  })
  links?: SwaggerPaginatedLinks;
}

export const warpPaginated = <T, U extends Type<SwaggerPaginated<T>>>(
  options: ApiResponseMetadata<T>,
): U => {
  const typeName = (() => {
    if (typeof options.type === 'string') {
      return options.type;
    } else if (options.type instanceof Array) {
      return options.type[0].name;
    } else {
      return options.type.name;
    }
  })();
  class TempClass<T> extends SwaggerPaginated<T> {
    @ApiResponseProperty({ ...options, type: [options.type] })
    data: T[];
  }
  Object.defineProperty(TempClass, 'name', { writable: true });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TempClass.name = `Paginated<${typeName}>`;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return TempClass;
};
