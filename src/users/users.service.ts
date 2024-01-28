import { Injectable } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  async getAllUsers() {
    const allUsers = await this.userModel.find().exec();
    return allUsers;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
