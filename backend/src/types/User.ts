import { ObjectType, Field, ID, Int } from 'type-graphql';


@ObjectType()
export class User {
  @Field(type => ID)
  id: number;

  @Field()
  username: string;
}