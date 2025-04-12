import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/entities/users.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async seedUsers() {
    const users = [
      { name: 'User 1', deviceToken: 'token1' },
      { name: 'User 2', deviceToken: 'token2' },
      { name: 'User 3', deviceToken: 'token3' },
      { name: 'User 4', deviceToken: 'token4' },
      { name: 'User 5', deviceToken: 'token5' },
      { name: 'User 6', deviceToken: 'token6' },
      { name: 'User 7', deviceToken: 'token7' },
      { name: 'User 8', deviceToken: 'token8' },
      { name: 'User 9', deviceToken: 'token9' },
      { name: 'User 10', deviceToken: 'token10' },
    ];
    await this.userModel.insertMany(users);
  }
}
