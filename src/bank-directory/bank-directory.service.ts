import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankerDirectory } from './schemas/bank-directory.schema';
import { CreateBankerDirectoryDto } from './dto/create-bank-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-bank-directory.dto';

@Injectable()
export class BankerDirectoryService {
  constructor(
    @InjectModel(BankerDirectory.name) private readonly bankerDirectoryModel: Model<BankerDirectory>,
  ) {}

  async create(createBankerDirectoryDto: CreateBankerDirectoryDto): Promise<BankerDirectory> {
    const createdBankerDirectory = new this.bankerDirectoryModel(createBankerDirectoryDto);
    return await createdBankerDirectory.save();
  }

  async findAll(): Promise<BankerDirectory[]> {
    return await this.bankerDirectoryModel.find().exec();
  }

  async findOne(id: string): Promise<BankerDirectory> {
    const bankerDirectory = await this.bankerDirectoryModel.findById(id).exec();
    if (!bankerDirectory) {
      throw new NotFoundException(`Banker Directory with ID ${id} not found`);
    }
    return bankerDirectory;
  }

  async update(
    id: string,
    updateBankerDirectoryDto: UpdateBankerDirectoryDto,
  ): Promise<BankerDirectory> {
    const updatedBankerDirectory = await this.bankerDirectoryModel
      .findByIdAndUpdate(id, updateBankerDirectoryDto, { new: true })
      .exec();
    if (!updatedBankerDirectory) {
      throw new NotFoundException(`Banker Directory with ID ${id} not found`);
    }
    return updatedBankerDirectory;
  }

  async remove(id: string): Promise<BankerDirectory> {
    const deletedBankerDirectory = await this.bankerDirectoryModel.findByIdAndDelete(id).exec();
    if (!deletedBankerDirectory) {
      throw new NotFoundException(`Banker Directory with ID ${id} not found`);
    }
    return deletedBankerDirectory;
  }

 async filterByLocationAndName(location?: string, bankerName?: string,associatedWith?:string): Promise<BankerDirectory[]> {
  const query: any = {};

  if (location) {
    
    query.locationCategories = location;
    query.locationCategories = { $regex: location, $options: 'i' };
  }
  if (bankerName) {
    query.bankerName = new RegExp(bankerName, 'i');
  }

   if (associatedWith) {
    query.associatedWith = new RegExp(associatedWith, 'i');
  }

  return this.bankerDirectoryModel.find(query).exec();
}


}