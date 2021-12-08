import { Field, ObjectType } from '@nestjs/graphql';
import { ApiResponseProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

@ObjectType('AuthRefreshResult')
export class AuthRefreshResultDto {
  @Field()
  @ApiResponseProperty()
  token: string;
}
