// noinspection JSConstantReassignment

import {
  Column,
  PaginateConfig,
  Paginated,
  PaginateQuery as IPaginateQuery,
  SortBy,
} from '@adachi-sakura/nest-shop-common';
import { Type } from '@nestjs/common';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyOptions,
  ApiResponseProperty,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { GraphQLString } from 'graphql';
import { IPaginateConfig } from '../interfaces/query-config.interface';

type ApiResponseMetadata<T> = Pick<
  ApiPropertyOptions,
  'example' | 'format' | 'enum' | 'deprecated'
> & {
  type: Type<T> | Function;
};

export class SwaggerPaginateQuery implements IPaginateQuery {
  @ApiProperty({
    required: false,
    description: '页码',
    default: 1,
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

class PaginatedLinks {
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
    type: PaginatedLinks,
    readOnly: true,
    required: false,
    nullable: true,
  })
  links?: PaginatedLinks;
}

export const createSwaggerPaginateQuery = <T, U extends IPaginateQuery>(
  config: IPaginateConfig<T>,
): Type<U> => {
  const name = config.name;
  const filter: Record<string, SchemaObject> = (() => {
    const obj: Record<string, SchemaObject> = {};
    Object.keys(config.filterableColumns).forEach((column) => {
      obj[column] = {
        anyOf: [
          { type: 'string' },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
      };
    });
    return obj;
  })();
  class SwaggerPaginateQuery implements IPaginateQuery {
    @ApiProperty({
      required: false,
      description: '页码',
      default: 1,
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
            { type: 'string', enum: config.sortableColumns, readOnly: true },
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
      type: 'array',
      items: {
        type: 'string',
        enum: config.searchableColumns,
      },
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
      properties: filter,
    })
    filter?: { [column: string]: string | string[] };
  }

  Object.defineProperty(SwaggerPaginateQuery, 'name', {
    writable: true,
    value: `PaginateQuery<${name}>`,
  });
  return SwaggerPaginateQuery as Type<U>;
};

export const warpPaginated = <T, U extends Type<SwaggerPaginated<T>>>(
  options: ApiResponseMetadata<T>,
  config?: PaginateConfig<T>,
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
  if (config) {
    const filter: Record<string, SchemaObject> = (() => {
      const obj: Record<string, SchemaObject> = {};
      Object.keys(config.filterableColumns).forEach((column) => {
        obj[column] = {
          readOnly: true,
          anyOf: [
            { type: 'string' },
            {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          ],
        };
      });
      return obj;
    })();
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
        required: false,
        type: 'array',
        description: '[排序列,排序方式(ASC | DESC)]',
        items: {
          type: 'array',
          readOnly: true,
          items: {
            oneOf: [
              { type: 'string', enum: config.sortableColumns, readOnly: true },
              { type: 'string', enum: ['ASC', 'DESC'], readOnly: true },
            ],
          },
          maxItems: 2,
          minItems: 2,
        },
      })
      sortBy: SortBy<T>;
      @ApiProperty({
        required: false,
        description: '搜索列',
        type: 'array',
        items: {
          type: 'string',
          enum: config.searchableColumns,
        },
      })
      searchBy: Column<T>[];
      @ApiProperty({
        readOnly: true,
        description: '搜索关键词',
      })
      search: string;
      @ApiProperty({
        required: false,
        type: 'object',
        description: '过滤列',
        properties: filter,
      })
      filter?: { [column: string]: string | string[] };
    }
    Object.defineProperty(SwaggerPaginatedMetadata, 'name', {
      writable: true,
      value: `PaginatedMetadata<${typeName}>`,
    });
    ApiResponseProperty({ type: SwaggerPaginatedMetadata })(
      TempClass.prototype,
      'meta',
    );
  }
  Object.defineProperty(TempClass, 'name', {
    writable: true,
    value: `Paginated<${typeName}>`,
  });
  return TempClass as U;
};

const createGraphQLPaginateQueryFilter = <T, U extends Type<T>>(
  config: PaginateConfig<T>,
  name: string,
): U => {
  class TempClass {}
  Object.keys(config.filterableColumns).forEach((key) => {
    Field(() => [GraphQLString], { nullable: true })(TempClass.prototype, key);
  });
  InputType(`${name}PaginateQueryFilter`)(TempClass);
  Object.defineProperty(TempClass, 'name', {
    writable: true,
    value: `GraphQLPaginateQueryFilter<${name}>`,
  });
  return TempClass as U;
};

export const createGraphQLPaginateQuery = <T>(
  config: IPaginateConfig<T>,
): Type<IPaginateQuery> => {
  const name = config.name;
  const filterType = createGraphQLPaginateQueryFilter(config, name);
  const searchByEnum = (() => {
    const obj: Record<string, string> = {};
    config.searchableColumns.forEach((column) => {
      obj[column] = column;
    });
    return obj;
  })();

  registerEnumType(searchByEnum, {
    name: `${name}PaginateQuerySearchBy`,
  });

  @InputType(`${name}PaginateQuery`)
  class GraphQLPaginateQuery implements IPaginateQuery {
    @Field(() => Int, {
      nullable: true,
      description: '页码',
      defaultValue: 1,
    })
    page?: number;

    @Field(() => Int, {
      nullable: true,
      description: '每页条数',
      defaultValue: 20,
    })
    limit?: number;

    @Field(() => [[String]], {
      nullable: true,
      description: '[排序列,排序方式(ASC | DESC)]',
    })
    sortBy?: [string, string][];

    @Field(() => [searchByEnum], {
      nullable: true,
      description: '搜索列',
    })
    searchBy?: string[];

    @Field({
      nullable: true,
      description: '搜索关键词',
    })
    search?: string;

    @Field(() => filterType, {
      description: '过滤条件',
      nullable: true,
    })
    filter?: { [column: string]: string | string[] };
  }
  Object.defineProperty(GraphQLPaginateQuery, 'name', {
    writable: true,
    value: `GraphQLPaginateQuery<${name}>`,
  });
  return GraphQLPaginateQuery;
};

@ObjectType(`PaginatedLinks`)
class GraphQLPaginatedLinks {
  @Field({
    nullable: true,
  })
  first?: string;
  @Field({
    nullable: true,
  })
  previous?: string;
  @Field()
  current: string;
  @Field({
    nullable: true,
  })
  next?: string;
  @Field({
    nullable: true,
  })
  last?: string;
}

export const warpGqlPaginated = <T, U extends Type<Paginated<T>>>(
  type: Type<T>,
  config: PaginateConfig<T>,
): U => {
  const filterType = (<T, U extends Type<T>>(
    config: PaginateConfig<T>,
    name: string,
  ): U => {
    class TempClass {}
    Object.keys(config.filterableColumns).forEach((key) => {
      Field(() => [GraphQLString], { nullable: true })(
        TempClass.prototype,
        key,
      );
    });
    ObjectType(`${name}PaginateFilter`)(TempClass);
    Object.defineProperty(TempClass, 'name', {
      writable: true,
      value: `GraphQLPaginateFilter<${name}>`,
    });
    return TempClass as U;
  })(config, type.name);

  const searchByEnum = (() => {
    const obj: Record<string, string> = {};
    config.searchableColumns.forEach((column) => {
      obj[column] = column;
    });
    return obj;
  })();

  registerEnumType(searchByEnum, {
    name: `${type.name}PaginateSearchBy`,
  });

  @ObjectType(`${type.name}PaginatedMetadata`)
  class GraphQLPaginatedMetadata<T> {
    @Field(() => Int, {
      description: '每页条数',
    })
    itemsPerPage: number;
    @Field(() => Int, {
      description: '总条数',
    })
    totalItems: number;
    @Field(() => Int, {
      description: '当前页',
    })
    currentPage: number;
    @Field(() => Int, {
      description: '总页数',
    })
    totalPages: number;
    @Field(() => [[String]], {
      description: '[排序列,排序方式(ASC | DESC)]',
    })
    @Field(() => [[String]], {
      description: '[排序列,排序方式(ASC | DESC)]',
    })
    sortBy: SortBy<T>;
    @Field(() => [searchByEnum], {
      description: '搜索列',
    })
    searchBy: Column<T>[];
    @Field({
      description: '搜索关键词',
    })
    search: string;
    @Field(() => filterType, {
      description: '过滤条件',
    })
    filter?: { [column: string]: string | string[] };
  }

  @ObjectType(`${type.name}Paginated`)
  class GraphQLPaginated<T> implements Paginated<T> {
    @Field(() => [type])
    data: T[];
    @Field(() => GraphQLPaginatedMetadata)
    meta: GraphQLPaginatedMetadata<T>;
    @Field(() => GraphQLPaginatedLinks, { nullable: true })
    links?: GraphQLPaginatedLinks;
  }
  Object.defineProperty(GraphQLPaginated, 'name', {
    value: `GraphQLPaginated<${type.name}>`,
  });
  return GraphQLPaginated as U;
};
