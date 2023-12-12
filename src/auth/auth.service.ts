import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminRegisterInput,
  AdminSignInInput,
  RegisterInput,
  SignInInput,
} from './auth.input-types';
import { User } from 'src/schemas/user.schema';
import { GraphQLError } from 'graphql';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/schemas/admin.schema';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signIn(signInInput: SignInInput) {
    const userData = await this.userModel
      .findOne({
        email: signInInput.email.toLocaleLowerCase(),
      })
      .exec();
    if (!userData) {
      throw new GraphQLError('User does not exist');
    }

    const comparePassword = await bcrypt.compare(
      signInInput.password,
      userData.password,
    );
    if (!comparePassword) {
      throw new GraphQLError('Invalid Credentials');
    }
    const { password, ...dataWithoutPassword } = userData['_doc'];

    const token = await this.jwtService.signAsync(dataWithoutPassword);

    return { token };
  }

  async register(registerInput: RegisterInput) {
    const { email, password, ...others } = registerInput;
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new GraphQLError('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    registerInput.password = hashedPassword;

    const createUser = new this.userModel(registerInput);
    await createUser.save();

    const token = await this.jwtService.signAsync({ email, ...others });

    await this.emailService.sendWelcomeEmail(email, token);

    return 'Welcome!';
  }

  async adminSignIn(adminSignInInput: AdminSignInInput) {
    const userData = await this.adminModel
      .findOne({
        email: adminSignInInput.email,
      })
      .exec();
    if (!userData) {
      throw new GraphQLError('User does not exist');
    }

    const comparePassword = await bcrypt.compare(
      adminSignInInput.password,
      userData.password,
    );
    if (!comparePassword) {
      throw new GraphQLError('Invalid Credentials');
    }
    const { password, ...dataWithoutPassword } = userData['_doc'];
    const token = await this.jwtService.signAsync(dataWithoutPassword);

    return { token };
  }

  async adminRegister(adminRegisterInput: AdminRegisterInput) {
    const { email, password, ...others } = adminRegisterInput;
    const existingAdmin = await this.adminModel.findOne({ email }).exec();

    if (existingAdmin) {
      throw new GraphQLError('Admin already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    adminRegisterInput.password = hashedPassword;

    const createAdmin = new this.adminModel(adminRegisterInput);
    await createAdmin.save();

    const token = await this.jwtService.signAsync({ email, ...others });

    await this.emailService.sendWelcomeEmail(email, token);

    return 'New Admin Signed Up!';
  }

  async verifyEmail(token: string) {
    const isValidToken: UserEntity = await this.jwtService.verifyAsync(token);
    if (isValidToken) {
      const { password, ...dataWithoutPassword } = await this.userModel
        .findOneAndUpdate(
          { email: isValidToken.email },
          { $set: { isVerified: true } },
          { new: true },
        )
        .exec();

      const token = await this.jwtService.signAsync(dataWithoutPassword);

      return { token };
    }
  }
}