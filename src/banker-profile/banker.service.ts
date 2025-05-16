import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createBankerProfileDto } from './dto/create-banker.dto';
import { UpdateBankerProfileDtoyDto } from './dto/update-banker.dto';
import { Banker } from './schemas/banker.schema';

@Injectable()
export class BankerService {
  constructor(
    @InjectModel(Banker.name) private readonly bankerModel: Model<Banker>,
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
      throw new BadRequestException('Invalid experience format. Use "X years Y months".');
    }
    const yearsInMonths = parseInt(match[1]) * 12;
    const months = parseInt(match[2]);
    return yearsInMonths + months;
  }

  async create(createBankerDto: createBankerProfileDto): Promise<Banker> {
    const { email, dateOfJoining, totalExperience } = createBankerDto;
    const existingEmail = await this.bankerModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const createdBanker = new this.bankerModel(createBankerDto);
    return createdBanker.save();
  }

  async findAll(searchParams: { currentInstitutionName?: string; experience?: string; sortBy?: string; sortOrder?: string } = {}): Promise<Banker[]> {
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

    return this.bankerModel.find(filter).sort(sort).exec();
  }

  async findOne(id: string): Promise<Banker> {
    const banker = await this.bankerModel.findById(id).exec();
    if (!banker) {
      throw new NotFoundException(`Banker with id ${id} not found`);
    }
    return banker;
  }

  async update(id: string, updateBankerDto: UpdateBankerProfileDtoyDto): Promise<Banker> {
    const { dateOfJoining, totalExperience } = updateBankerDto;
    if (dateOfJoining && totalExperience &&
        this.convertExperienceToMonths(totalExperience) <
        this.convertExperienceToMonths(this.calculateCurrentExperience(dateOfJoining))) {
      throw new BadRequestException('Total experience must be greater than or equal to current experience');
    }

    const updatedBanker = await this.bankerModel.findByIdAndUpdate(id, updateBankerDto, { new: true }).exec();
    if (!updatedBanker) {
      throw new NotFoundException(`Banker with id ${id} not found`);
    }
    return updatedBanker;
  }

  async remove(id: string): Promise<Banker> {
    const deletedBanker = await this.bankerModel.findByIdAndDelete(id).exec();
    if (!deletedBanker) {
      throw new NotFoundException(`Banker with id ${id} not found`);
    }
    return deletedBanker;
  }
}
