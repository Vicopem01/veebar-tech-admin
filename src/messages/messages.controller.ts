import { Controller, Get, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get('senders')
  getSenders() {
    return this.messageService.getSenders();
  }

  @Get('convo')
  getUserMessages(@Query('userId') userId: string) {
    return this.messageService.getUserMessages(userId);
  }

  @Get('status')
  getMessageStatus(@Query('userId') userId: string) {
    return this.messageService.getMessageStatus(userId);
  }
}
