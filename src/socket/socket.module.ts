import { Module } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/messages/message.schema';
import { MessagesResolver } from '../messages/messages.resolver';
import { Raspi, RaspiSchema } from 'src/schemas/raspi.schema';
import { DevicesModule } from 'src/devices/devices.module';
import MessagesModule from 'src/messages/messages.module';
import SocketGateway from './socket.gateway';
import { DevicesService } from 'src/devices/devices.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // MongooseModule.forFeature([{ name: Raspi.name, schema: RaspiSchema }]),
    DevicesModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [SocketGateway],
})
export default class SocketModule {}
