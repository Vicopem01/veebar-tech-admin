import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Activity {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: any;

  @Prop({ type: Types.ObjectId, ref: 'Raspi' })
  raspi: string;
}

export type ActivityDocument = HydratedDocument<Activity>;

export const ActivitySchema = SchemaFactory.createForClass(Activity);
