import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddNewDeviceInput {
  @Field()
  readonly secret: string;

  @Field()
  readonly deviceType: string;

  @Field()
  readonly serialNumber: string;

  @Field()
  readonly deviceName: string;
}
