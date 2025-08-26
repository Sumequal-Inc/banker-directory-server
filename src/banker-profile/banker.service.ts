import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createBankerProfileDto } from './dto/create-banker.dto';
import { UpdateBankerProfileDto } from './dto/update-banker.dto';
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

  private calculateCurrentExperienceInMonths(dateOfJoining: Date): number {
    const today = new Date();
    const joinDate = new Date(dateOfJoining);
    let years = today.getFullYear() - joinDate.getFullYear();
    let months = today.getMonth() - joinDate.getMonth();

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return years * 12 + months;
  }

private convertExperienceToMonths(experience: string): number {
  console.log('Parsing experience:', experience); // Debug log

  const cleaned = experience.trim().toLowerCase().replace(/\s+/g, ' ');

  // Match both years and months (e.g., "3y 2m", "3 years 2 months")
  const fullRegex = /(?:(\d+)\s*(?:years?|yrs?|y))?\s*(?:(\d+)\s*(?:months?|mos?|m))?/i;
  const match = cleaned.match(fullRegex);

  if (!match || (!match[1] && !match[2])) {
    throw new BadRequestException(
      'Invalid experience format. Use formats like "3 years 2 months", "3yrs", "6 months", or "3y 2m".'
    );
  }

  const years = match[1] ? parseInt(match[1], 10) : 0;
  const months = match[2] ? parseInt(match[2], 10) : 0;

  return years * 12 + months;
}


  async create(createBankerDto: createBankerProfileDto): Promise<Banker> {
    const { email } = createBankerDto;
    const existingEmail = await this.bankerModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const createdBanker = new this.bankerModel(createBankerDto);
    return createdBanker.save();
  }

  async findAll(searchParams: {
    currentInstitutionName?: string;
    experience?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}): Promise<Banker[]> {
    const {
      currentInstitutionName,
      experience,
      sortBy = 'dateOfJoining',
      sortOrder = 'asc',
    } = searchParams;

    const filter: any = {};

    if (currentInstitutionName) {
      filter.currentInstitutionName = {
        $regex: currentInstitutionName,
        $options: 'i',
      };
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

  async update(
    id: string,
    updateBankerDto: UpdateBankerProfileDto,
  ): Promise<Banker> {
    try {
      let { dateOfJoining, totalExperience } = updateBankerDto as any;

      // Parse and validate dateOfJoining
      if (dateOfJoining) {
        const parsedDate = new Date(dateOfJoining);
        if (isNaN(parsedDate.getTime())) {
          throw new BadRequestException('Invalid dateOfJoining');
        }
        dateOfJoining = parsedDate;
        (updateBankerDto as any).dateOfJoining = parsedDate;
      }

      // Validate experience consistency
      if (dateOfJoining && totalExperience) {
        const totalMonths = this.convertExperienceToMonths(
          String(totalExperience),
        );
        const currentMonths =
          this.calculateCurrentExperienceInMonths(dateOfJoining);

        if (totalMonths < currentMonths) {
          throw new BadRequestException(
            'Total experience must be >= current experience',
          );
        }
      }

      const updatedBanker = await this.bankerModel
        .findByIdAndUpdate(id, updateBankerDto, {
          new: true,
          runValidators: true,
          context: 'query',
        })
        .exec();

      if (!updatedBanker) {
        throw new NotFoundException(`Banker with id ${id} not found`);
      }

      return updatedBanker;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<Banker> {
    const deletedBanker = await this.bankerModel.findByIdAndDelete(id).exec();
    if (!deletedBanker) {
      throw new NotFoundException(`Banker with id ${id} not found`);
    }
    return deletedBanker;
  }
}
