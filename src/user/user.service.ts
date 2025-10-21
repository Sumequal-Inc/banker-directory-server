import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'; 
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const email = dto.email?.trim().toLowerCase();
    const exists = await this.userModel.exists({ email });
    if (exists) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    try {
      const doc = await this.userModel.create({ ...dto, email, password: hashed });
      const obj = doc.toObject();
      delete (obj as any).password;
      return obj as any;
    } catch (e: any) {
      if (e?.code === 11000) throw new BadRequestException('Email already in use');
      throw e;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const normalized = (email || '').trim().toLowerCase();
    return this.userModel.findOne({ email: normalized }).select('+password');
  }

   async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async update(id: string, data: Partial<UpdateUserDto>): Promise<Partial<User>> {
    const update: any = { ...data };
    if (update.email) update.email = update.email.trim().toLowerCase();
    if (update.password) update.password = await bcrypt.hash(update.password, 10);

    const doc = await this.userModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true, context: 'query' })
      .select('-password')
      .lean();

    return doc as any;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}
