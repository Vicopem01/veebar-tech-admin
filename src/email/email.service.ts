import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { welcomeEmail } from '../templates/emails';
import { EmailSenderDto } from './email.dto';
import { NodemailerService } from './nodemailer.service';

@Injectable()
export class EmailService {
  constructor(private readonly emailSender: NodemailerService) {}

  /**
   * @param recipient: Email recipient
   * @param token : signed jwt token
   * @author Victor Ogunjobi
   *  */
  async sendWelcomeEmail(
    recipient: string,
    token: string,
    origin: string,
  ): Promise<string> {
    const params: EmailSenderDto = {
      recipient: recipient.toLocaleLowerCase(),
      subject: 'Welcome Onboard!',
      html: welcomeEmail(token, origin),
    };
    try {
      await this.emailSender.sendEmail(params);
      return 'Welcome to Aview!';
    } catch (error) {
      throw new HttpException(
        { message: 'Error', error },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
