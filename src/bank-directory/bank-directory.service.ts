import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankerDirectory } from './schemas/bank-directory.schema';
import { CreateBankerDirectoryDto } from './dto/create-bank-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-bank-directory.dto';
import { BankerDirectoryReview } from './schemas/banker_directory_review.schema';

@Injectable()
export class BankerDirectoryService {
  constructor(
    @InjectModel(BankerDirectory.name)
    private readonly bankerDirectoryModel: Model<BankerDirectory>,

    @InjectModel(BankerDirectoryReview.name)
    private readonly reviewModel: Model<BankerDirectoryReview>,
  ) {}

  // ✅ 1. Public submits for review
  async requestReview(createDto: CreateBankerDirectoryDto) {
    return this.reviewModel.create({ ...createDto, status: 'pending' });
  }

  // ✅ 2. Admin views all pending submissions
async getAllReviews() {
  return this.reviewModel.find().sort({ createdAt: -1 }).exec(); // optional sort
}


  // ✅ 3. Admin approves a request (moves to main table)
async approveReview(id: string) {
  const review = await this.reviewModel.findById(id);
  if (!review) throw new NotFoundException('Review not found');

  const { _id, ...rest } = review.toObject(); // remove MongoDB _id
  const approved = await this.bankerDirectoryModel.create(rest);

  await this.reviewModel.findByIdAndUpdate(id, { status: 'approved' });

  return approved;
}


async rejectReview(id: string, reason: string) {
  const review = await this.reviewModel.findById(id);
  if (!review) {
    throw new NotFoundException('Review not found');
  }

  review.status = 'rejected';
  review.rejectionReason = reason;
  await review.save();

  return { message: 'Submission rejected successfully', reason };
}


  // ✅ 5. Main table: Create manually (not used by public)
  async create(createBankerDirectoryDto: CreateBankerDirectoryDto): Promise<BankerDirectory> {
    const createdBankerDirectory = new this.bankerDirectoryModel(createBankerDirectoryDto);
    return await createdBankerDirectory.save();
  }

  // ✅ 6. Get all approved banker entries
  async findAll(): Promise<BankerDirectory[]> {
    return await this.bankerDirectoryModel.find().exec();
  }

  // ✅ 7. Get by ID
  async findOne(id: string): Promise<BankerDirectory> {
    const bankerDirectory = await this.bankerDirectoryModel.findById(id).exec();
    if (!bankerDirectory) {
      throw new NotFoundException(`Banker Directory with ID ${id} not found`);
    }
    return bankerDirectory;
  }

  // ✅ 8. Update approved record
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

  // ✅ 9. Delete approved record
  async remove(id: string): Promise<BankerDirectory> {
    const deletedBankerDirectory = await this.bankerDirectoryModel.findByIdAndDelete(id).exec();
    if (!deletedBankerDirectory) {
      throw new NotFoundException(`Banker Directory with ID ${id} not found`);
    }
    return deletedBankerDirectory;
  }

  // ✅ 10. Filtering (by location, name, email, etc.)
async filterByLocationAndName(
  location?: string,
  bankerName?: string,
  associatedWith?: string,
  emailOfficial?: string,
  emailPersonal?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: BankerDirectory[]; totalCount: number }> {
  const query: any = {};

  if (location) {
    query.locationCategories = { $regex: location, $options: 'i' };
  }

  if (bankerName) {
    query.bankerName = new RegExp(bankerName, 'i');
  }

  if (associatedWith) {
    query.associatedWith = new RegExp(associatedWith, 'i');
  }

  if (emailOfficial) {
    query.emailOfficial = new RegExp(emailOfficial, 'i');
  }

  if (emailPersonal) {
    query.emailPersonal = new RegExp(emailPersonal, 'i');
  }

  const skip = (page - 1) * limit;

  const [data, totalCount] = await Promise.all([
    this.bankerDirectoryModel.find(query).skip(skip).limit(limit).exec(),
    this.bankerDirectoryModel.countDocuments(query)
  ]);

  return { data, totalCount };
}

async getReviewCounts() {
  const [pending, approved, rejected] = await Promise.all([
    this.reviewModel.countDocuments({ status: 'pending' }),
    this.reviewModel.countDocuments({ status: 'approved' }),
    this.reviewModel.countDocuments({ status: 'rejected' })
  ]);

  return { pending, approved, rejected };
}


}
