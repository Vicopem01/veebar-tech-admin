import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignInEntity {
  @Field()
  token: string;
}

@ObjectType()
export class AdminSignInEntity {
  @Field()
  token: string;
}

@ObjectType()
export class VerifyEmailEntity {
  @Field()
  token: string;
}
