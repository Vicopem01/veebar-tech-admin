import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @IsEmail()
  @Field()
  readonly email: string;

  @IsString()
  @Field()
  readonly password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  readonly firstName: string;

  @Field()
  readonly lastName: string;

  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  password: string;

  @Field()
  readonly dateOfBirth: string;
}

@InputType()
export class AdminSignInInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  readonly password: string;
}

@InputType()
export class AdminRegisterInput {
  @Field()
  readonly firstName: string;

  @Field()
  readonly lastName: string;

  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  password: string;
}

@InputType()
export class VerifyEmailInput {
  @Field()
  readonly token: string;
}
