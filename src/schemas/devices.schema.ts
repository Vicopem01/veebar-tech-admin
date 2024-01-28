import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Device {
  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  secret: string;

  @Prop({ required: true })
  deviceType: string;

  @Prop({ required: true })
  pairingHash: string;

  @Prop({ required: true })
  deviceName: string;
}

export type DeviceDocument = HydratedDocument<Device>;

export const DeviceSchema = SchemaFactory.createForClass(Device);
