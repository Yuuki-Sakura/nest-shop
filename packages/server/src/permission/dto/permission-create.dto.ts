import { HttpMethod } from '@adachi-sakura/nest-shop-entity';

export class PermissionCreateDto {
  name: string;

  resource: string;

  route: string;

  method: HttpMethod;

  type: 'HTTP' | 'GraphQL';
}
