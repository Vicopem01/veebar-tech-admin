import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
class Configuration {
  @Prop()
  readonly stove1threshold: number;

  @Prop()
  readonly stove1triggerdelay: number;

  @Prop()
  readonly stovethreshold: number;

  @Prop()
  readonly stovetriggerdelay: number;

  @Prop()
  readonly 'stove:1\rStovethreshold': number;

  @Prop()
  readonly 'stove:1\rStovetriggerdelay': number;

  @Prop()
  readonly 'stove:\rStovethreshold': number;

  @Prop()
  readonly 'stove:\rStovetriggerdelay': number;

  @Prop()
  readonly stove2threshold: number;

  @Prop()
  readonly stove2triggerdelay: number;

  @Prop()
  readonly stove4threshold: number;

  @Prop()
  readonly stove4triggerdelay: number;

  @Prop()
  readonly stove3threshold: number;

  @Prop()
  readonly stove3triggerdelay: number;
}
const ConfigurationSchema = SchemaFactory.createForClass(Configuration);

@Schema({ timestamps: true })
export class Raspi {
  @Prop()
  readonly icon: string;

  @Prop()
  readonly knownName: string;

  @Prop()
  readonly serialNumber: string;
  @Prop()
  readonly communicationSecret: string;
  @Prop()
  readonly pairingHash: string;

  @Prop()
  readonly phone: string;

  @Prop({ type: ConfigurationSchema })
  configuration: Configuration;
}

export type RaspiDocument = HydratedDocument<Raspi>;

export const RaspiSchema = SchemaFactory.createForClass(Raspi);
