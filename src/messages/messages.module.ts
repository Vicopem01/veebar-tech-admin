import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import SocketGateway from '../socket/socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/messages/message.schema';
import { MessagesResolver } from './messages.resolver';
import { Raspi, RaspiSchema } from 'src/schemas/raspi.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // MongooseModule.forFeature([{ name: Raspi.name, schema: RaspiSchema }]),
  ],
  controllers: [],
  providers: [MessagesService, MessagesResolver],
  exports: [MessagesService],
})
export default class MessagesModule {}
