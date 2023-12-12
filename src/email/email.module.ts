import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [],
  providers: [EmailService, NodemailerService],
  exports: [EmailService],
})
export default class EmailModule {}
