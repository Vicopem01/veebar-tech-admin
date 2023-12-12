import { IsEmail, IsIn, IsString, IsUrl, ValidateIf } from 'class-validator';

export class WelcomeEmailDto {
  @IsEmail()
  readonly recipient: string;
}

export class EmailSenderDto {
  readonly recipient: string;
  readonly subject: string;
  readonly html: string;
}

export class SingleSignInDto {
  @IsEmail()
  readonly email: string;
  @IsString({ message: 'Invalid URL format' })
  @IsIn(
    [
      'http://localhost:3000',
      'https://aviewint.com',
      'https://beta.aviewint.com',
    ],
    { message: 'Invalid URL format' },
  )
  readonly origin: string;
}
