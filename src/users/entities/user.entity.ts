import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsEmail } from 'class-validator';

@ObjectType()
export class UserEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  dateOfBirth: string;

  @Field()
  @IsDate()
  createdAt: Date;

  @Field(() => Int)
  phone?: number;
}
