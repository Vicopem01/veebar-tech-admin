import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RaspiDocument } from './raspi.schema';

@Schema()
export class TimeTrigger {
  @Prop({ type: Types.ObjectId, ref: 'Raspi' })
  readonly raspi: Types.ObjectId | RaspiDocument;

  @Prop()
  readonly sensorType: string;

  @Prop()
  readonly sensorID: string;

  @Prop({ type: Date })
  time: Date;
}

export type TimeTriggerDocument = HydratedDocument<TimeTrigger>;

export const TimeTriggerSchema = SchemaFactory.createForClass(TimeTrigger);
