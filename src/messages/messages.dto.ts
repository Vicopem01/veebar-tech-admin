import { Field, Float, ObjectType } from '@nestjs/graphql';

export class UserMessageBodyDto {
  readonly message: string;
  readonly userId: string;
  readonly sender: string;
}

export class MessageSenderDto {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly picture: string;
}

@ObjectType()
export class MessageDto {
  @Field()
  _id: string;

  @Field()
  status: string;

  @Field(() => [MessageContent])
  messages: MessageContent[];

  @Field()
  updatedAt: string;
}

@ObjectType()
class MessageContent {
  @Field(() => Float)
  timestamp: number;

  @Field()
  content: string;

  @Field()
  sender: string;
}
