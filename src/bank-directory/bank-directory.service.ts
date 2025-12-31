import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankerDirectory } from './schemas/bank-directory.schema';
import { CreateBankerDirectoryDto } from './dto/create-bank-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-bank-directory.dto';
import { BankerDirectoryReview } from './schemas/banker_directory_review.schema';
import * as XLSX from 'xlsx';

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

 async update(id: string, updateBankerDirectoryDto: UpdateBankerDirectoryDto) {
  return this.bankerDirectoryModel
    .findByIdAndUpdate(id, updateBankerDirectoryDto, { new: true })
    .exec();
}


  // ✅ 9. Delete approved record
  async remove(id: string): Promise<BankerDirectory> {
    const deletedBankerDirectory = await this.bankerDirectoryModel.findByIdAndDelete(id).exec();
    if (!deletedBankerDirectory) {
      throw new NotFoundException(`Banker Directory with ID ${id} not found`);
    }
    return deletedBankerDirectory;
  }

async filterByLocationAndName(
  state?: string,
  city?: string,
  bankerName?: string,
  associatedWith?: string,
  emailOfficial?: string,
  emailPersonal?: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ data: BankerDirectory[]; totalCount: number }> {
  const query: any = {};

  if (state) {
    query.state = { $regex: state, $options: 'i' };
  }

  if (city) {
    query.city = { $regex: city, $options: 'i' };
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
    this.bankerDirectoryModel.countDocuments(query),
  ]);

  return { data, totalCount };
}



// bank-directory.service.ts

async getStateCityMeta() {
  // distinct states
  const rawStates: string[] = await this.bankerDirectoryModel
    .distinct('state')
    .exec();

  const states = (rawStates || [])
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter((s) => s.length > 0)
    .sort((a, b) => a.localeCompare(b));

  const stateCityMap: Record<string, string[]> = {};

  for (const st of states) {
    const rawCities: string[] = await this.bankerDirectoryModel
      .distinct('city', { state: st })
      .exec();

    const cities = (rawCities || [])
      .filter(Boolean)
      .map((c) => String(c).trim())
      .filter((c) => c.length > 0)
      .sort((a, b) => a.localeCompare(b));

    stateCityMap[st] = cities;
  }

  return { states, stateCityMap };
}

async getReviewCounts() {
  const [pending, approved, rejected] = await Promise.all([
    this.reviewModel.countDocuments({ status: 'pending' }),
    this.reviewModel.countDocuments({ status: 'approved' }),
    this.reviewModel.countDocuments({ status: 'rejected' })
  ]);

  return { pending, approved, rejected };
}

async bulkImportFromBuffer(buf: Buffer, filename: string) {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buf, { type: 'buffer' });
  } catch {
    throw new BadRequestException('Invalid file format');
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new BadRequestException('No worksheet found');

  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (!rows.length) {
    return { success: true, inserted: 0, updated: 0, skipped: 0, errors: [] };
  }

  const errors: { row: number; message: string }[] = [];
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  const toList = (v: any) =>
    String(v ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    // 🔹 Normalize (Excel ke column names se)
    const bankerName = String(r.bankerName || r.BankerName || '').trim();
    const associatedWith = String(r.associatedWith || r.AssociatedWith || '').trim();
    const emailOfficial = String(r.emailOfficial || r.EmailOfficial || '').trim();
    const emailPersonal = String(r.emailPersonal || r.EmailPersonal || '').trim();
    const contact = String(r.contact || r.Contact || '').trim();

    const state = String(r.state || r.State || '').trim();
    const city = String(r.city || r.City || '').trim();

    const product = toList(r.product || r.Product);

    // basic validation
    if (!bankerName || !associatedWith) {
      skipped++;
      errors.push({
        row: i + 2, // header + 1-based row
        message: 'bankerName and associatedWith are required',
      });
      continue;
    }

    // upsert filter
    const filter: any = emailOfficial
      ? { emailOfficial }
      : { bankerName, associatedWith, contact };

    // 👉 yahan ab state & city bhi save ho rahe hain
    const payload = {
      bankerName,
      associatedWith,
      emailOfficial,
      emailPersonal,
      contact,
      state,
      city,
      product,
    };

    try {
      const res: any = await this.bankerDirectoryModel.updateOne(
        filter,
        { $set: payload },
        { upsert: true },
      );

      if (res.upsertedCount > 0) inserted++;
      else if (res.modifiedCount > 0) updated++;
      else skipped++; // nothing changed
    } catch (e: any) {
      errors.push({
        row: i + 2,
        message: e?.message || 'Unknown DB error',
      });
    }
  }

  return { success: true, inserted, updated, skipped, errors };
}


}
