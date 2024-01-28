import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RaspiDocument } from './raspi.schema';

@Schema({ timestamps: true })
export class Status {
  @Prop({ type: Types.ObjectId, ref: 'Raspi' })
  raspi: Types.ObjectId | RaspiDocument;

  @Prop()
  knownName: string;

  @Prop()
  status: string;

  @Prop()
  sensorID: string;

  @Prop()
  sensorType: string;
}

export type StatusDocument = HydratedDocument<Status>;

export const StatusSchema = SchemaFactory.createForClass(Status);
