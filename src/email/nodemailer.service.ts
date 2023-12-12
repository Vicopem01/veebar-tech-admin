import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailSenderDto } from 'src/email/email.dto';

@Injectable()
export class NodemailerService {
  private nodemailerTransporter: any;
  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USERNAME'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail({ recipient, subject, html }: EmailSenderDto) {
    await this.nodemailerTransporter.sendMail({
      from: `Veebar Technologies <${this.configService.get<string>(
        'MAIL_USERNAME',
      )}>`,
      to: recipient,
      subject,
      html,
    });
  }
}
