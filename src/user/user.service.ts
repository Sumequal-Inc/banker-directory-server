// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }) as any;
  }
  
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}