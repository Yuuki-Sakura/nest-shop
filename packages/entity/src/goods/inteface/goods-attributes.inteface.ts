import { InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export default class IGoodsAttributes {
  name: string;
  unit: string;
  type: string;
  isSearch: boolean;
  require: boolean;
  value: string;
}
