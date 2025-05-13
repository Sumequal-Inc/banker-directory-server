import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

 
  private calculateCurrentExperience(dateOfJoining: Date): string {
    const today = new Date();
    const joinDate = new Date(dateOfJoining);
    const years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();

    const adjustedMonths = months < 0 ? 12 + months : months;
    const adjustedYears = months < 0 ? years - 1 : years;

    return `${adjustedYears} years ${adjustedMonths} months`;
  }

 
  private convertExperienceToMonths(experience: string): number {
    const regex = /(\d+)\s*years?\s*(\d+)\s*months?/;
    const match = experience.match(regex);

    if (!match) {
      throw new BadRequestException('Invalid experience format. Please use "X years Y months".');
    }

    const yearsInMonths = parseInt(match[1]) * 12; 
    const months = parseInt(match[2]); 

    return yearsInMonths + months;
  }


  async create(createDirectoryDto: CreateDirectoryDto): Promise<Directory> {
    const { email, dateOfJoining, totalExperience } = createDirectoryDto;
    const existingEmail = await this.directoryModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // const currentExperience = this.calculateCurrentExperience(dateOfJoining);
  
    // if (this.convertExperienceToMonths(totalExperience) < this.convertExperienceToMonths(currentExperience)) {
    //   throw new BadRequestException('Total experience must be greater than or equal to current experience');
    // }

    const createdDirectory = new this.directoryModel(createDirectoryDto);
    return createdDirectory.save();
  }

  
  async findAll(
    searchParams: { currentInstitutionName?: string; experience?: string; sortBy?: string; sortOrder?: string } = {}
  ): Promise<Directory[]> {
    const { currentInstitutionName, experience, sortBy = 'dateOfJoining', sortOrder = 'asc' } = searchParams;

    let filter: any = {};

    if (currentInstitutionName) {
      filter.currentInstitutionName = { $regex: currentInstitutionName, $options: 'i' };  
    }

    if (experience) {
      const experienceInMonths = this.convertExperienceToMonths(experience);
      filter.totalExperience = { $gte: experienceInMonths }; 
    }

    let sort: any = {};
    if (sortBy === 'experience') {
      sort = { totalExperience: sortOrder === 'asc' ? 1 : -1 };  
    } else if (sortBy === 'dateOfJoining') {
      sort = { dateOfJoining: sortOrder === 'asc' ? 1 : -1 }; 
    }

    return this.directoryModel.find(filter).sort(sort).exec();
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
    const { dateOfJoining, totalExperience } = updateDirectoryDto;

    if (dateOfJoining) {
      const currentExperience = this.calculateCurrentExperience(dateOfJoining);
      
     
      if (totalExperience && this.convertExperienceToMonths(totalExperience) < this.convertExperienceToMonths(currentExperience)) {
        throw new BadRequestException('Total experience must be greater than or equal to current experience');
      }
    }

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