import IGoodsAttributes from '@/goods/inteface/goods-attributes.inteface';
import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export default class IGoodsAttributesGroup {
  @Field()
  name: string;

  @Field(() => [IGoodsAttributes])
  children: IGoodsAttributes[];
}
