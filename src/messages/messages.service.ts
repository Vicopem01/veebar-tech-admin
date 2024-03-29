import { Injectable } from '@nestjs/common';
import { MessageDto, MessageSenderDto } from './messages.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/messages/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async getSenders(): Promise<MessageSenderDto[]> {
    // const data = await this.firebase.getMessageSenders();
    let allSenders: MessageSenderDto[] = [];
    return allSenders;
  }

  async getUserMessages(userId: string): Promise<string[]> {
    // const data = await this.firebase.getUserMessages(userId);
    let allMessages: string[] = [];
    // for (const key in data) allMessages.push({ ...data[key], id: key });

    return allMessages;
  }

  async getMessageStatus(userId: string): Promise<MessageDto> {
    const conversation: MessageDto = await this.messageModel.findById(userId);
    return conversation;
  }

  async handleUserMessage(messageData: any, userId: string) {
    const conversation = await this.messageModel.findById(userId);
    if (conversation) {
      conversation.messages.push(messageData);
      await conversation.save();
    } else {
      const convoData = {
        _id: userId,
        status: 'sentByUser',
        messages: [messageData],
      };
      await new this.messageModel(convoData).save();
    }
  }

  raspiConnection() {}

  sessionConnection() {}
}
