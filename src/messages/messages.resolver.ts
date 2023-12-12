import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { MessageDto } from './messages.dto';

@Resolver(() => MessageDto)
export class MessagesResolver {
  constructor(private readonly messageService: MessagesService) {}

  @Query(() => MessageDto, { name: 'userMessages' })
  async getMessages(@Args('_id', { type: () => ID }) _id: string) {
    return this.messageService.getMessageStatus(_id);
  }
}
