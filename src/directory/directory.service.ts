import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { Directory } from '../directory/directory.schema';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectModel(Directory.name) private readonly directoryModel: Model<Directory>,
  ) {}

  async create(createDirectoryDto: CreateDirectoryDto): Promise<Directory> {
    const createdDirectory = new this.directoryModel(createDirectoryDto);
    return createdDirectory.save();
  }

  async findAll(): Promise<Directory[]> {
    return this.directoryModel.find().exec();
  }

  async findOne(id: string): Promise<Directory> {
    const directory = await this.directoryModel.findById(id).exec();
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return directory;
  }

  async update(
    id: string,
    updateDirectoryDto: UpdateDirectoryDto,
  ): Promise<Directory> {
    const updatedDirectory = await this.directoryModel
      .findByIdAndUpdate(id, updateDirectoryDto, { new: true })
      .exec();
    if (!updatedDirectory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return updatedDirectory;
  }

  async remove(id: string): Promise<Directory> {
    const deletedDirectory = await this.directoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedDirectory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return deletedDirectory;
  }
}