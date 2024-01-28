import { Module } from '@nestjs/common';
import { DevicesResolver } from './devices.resolver';
import { DevicesService } from './devices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from '../schemas/devices.schema';
import { JwtService } from '@nestjs/jwt';
import { Raspi, RaspiSchema } from 'src/schemas/raspi.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Session, SessionSchema } from 'src/schemas/session.schema';
import { TimeTrigger, TimeTriggerSchema } from 'src/schemas/timeTrigger.schema';
import { Status, StatusSchema } from 'src/schemas/status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Raspi.name, schema: RaspiSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([
      { name: TimeTrigger.name, schema: TimeTriggerSchema },
    ]),
    MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]),
  ],
  providers: [DevicesResolver, DevicesService, JwtService],
  exports: [DevicesService],
})
export class DevicesModule {}
