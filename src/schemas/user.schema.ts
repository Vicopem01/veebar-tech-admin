import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  readonly firstName: string;

  @Prop({ required: true })
  readonly lastName: string;

  @Prop({ required: true })
  readonly email: string;

  @Prop({ required: true })
  readonly password: string;

  @Prop()
  readonly dateOfBirth: string;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ required: true, default: false })
  isBlocked: boolean;

  @Prop({ type: [Date], default: [] })
  readonly visits: Date[];

  @Prop({ type: [String], default: [] })
  readonly raspis: string[];
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
