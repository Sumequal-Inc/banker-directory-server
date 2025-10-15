import {
  BadRequestException, ConflictException, Injectable, InternalServerErrorException
} from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  BrokerDirectory,
  BrokerDirectoryDocument,
} from './schemas/broker-directory.schema';
import { CreateBrokerDirectoryDto } from './dto/create-broker-directory.dto';
import { UpdateBrokerDirectoryDto } from './dto/update-broker-directory.dto';

@Injectable()
export class BrokerDirectoryService {
  constructor(
    @InjectModel(BrokerDirectory.name)
    private brokerModel: Model<BrokerDirectoryDocument>
  ) {}

  async create(createDto: CreateBrokerDirectoryDto) {
    try {
      const broker = new this.brokerModel(createDto);
      return await broker.save();
    } catch (err: any) {
      if (err?.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      }
      if (err?.code === 11000) {
        const keys = Object.keys(err.keyPattern || {});
        const field = keys.length ? keys.join(', ') : 'field';
        throw new ConflictException(`Duplicate ${field}: ${JSON.stringify(err.keyValue)}`);
      }
      console.error('Create Broker failed:', err);
      throw new InternalServerErrorException('Failed to create broker');
    }
  }

  findAll() {
    return this.brokerModel.find().sort({ createdAt: -1 }).exec();
  }

  findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
    return this.brokerModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateBrokerDirectoryDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
    try {
      const updated = await this.brokerModel.findByIdAndUpdate(
        id,
        { $set: updateDto },
        { new: true, runValidators: true }
      ).exec();
      if (!updated) throw new BadRequestException('Broker not found');
      return updated;
    } catch (err: any) {
      if (err?.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      }
      if (err?.code === 11000) {
        const keys = Object.keys(err.keyPattern || {});
        const field = keys.length ? keys.join(', ') : 'field';
        throw new ConflictException(`Duplicate ${field}: ${JSON.stringify(err.keyValue)}`);
      }
      throw new InternalServerErrorException('Failed to update broker');
    }
  }

  remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
    return this.brokerModel.findByIdAndDelete(id).exec();
  }

  async filter(
    filters: {
      brokerName?: string;
      agencyName?: string;
      city?: string;
      email?: string;
    },
    page: number,
    limit: number
  ) {
    const query: any = {};
    if (filters.brokerName)
      query.brokerName = { $regex: filters.brokerName, $options: 'i' };
    if (filters.agencyName)
      query.agencyName = { $regex: filters.agencyName, $options: 'i' };
    if (filters.city)
      query['location.city'] = { $regex: filters.city, $options: 'i' };
    if (filters.email)
      query.email = { $regex: filters.email, $options: 'i' };

    const [data, totalCount] = await Promise.all([
      this.brokerModel
        .find(query).sort({ createdAt: -1 })
        .skip((Math.max(page,1)-1) * Math.max(limit,1))
        .limit(Math.max(limit,1))
        .exec(),
      this.brokerModel.countDocuments(query),
    ]);

    return { data, totalCount, page, limit };
  }

  async bulkUpload(rows: any[]) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new BadRequestException('No rows to import');
    }

    const parseBool = (v: any) => {
      if (typeof v === 'boolean') return v;
      if (v == null) return undefined;
      const s = String(v).trim().toLowerCase();
      if (['yes','true','1'].includes(s)) return true;
      if (['no','false','0'].includes(s)) return false;
      return undefined;
    };
    const parseNum = (v: any) => {
      if (v === '' || v == null) return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };
    const parseCSV = (s: any) =>
      typeof s === 'string'
        ? s.split(',').map((x) => x.trim()).filter(Boolean)
        : Array.isArray(s) ? s : [];

    const docs: CreateBrokerDirectoryDto[] = rows
      .map((r) => {
        const brokerName = (r.brokerName || r.fullName || '').toString().trim();
        if (!brokerName) return null;
        return {
          brokerName,
          agencyName: r.agencyName?.toString().trim() || undefined,
          specialization: parseCSV(r.specialization),
          serviceProjectNames: parseCSV(r.serviceProjectNames),
          location: {
            city: r.city?.toString().trim() || undefined,
            state: r.state?.toString().trim() || undefined,
            country: r.country?.toString().trim() || undefined,
            address: r.address?.toString().trim() || undefined,
            pincode: r.pincode?.toString().trim() || undefined,
          },
          email: r.email?.toString().trim() || undefined,
          phone: r.phone?.toString().trim() || undefined,
          linkedinProfile: r.linkedinProfile?.toString().trim() || undefined,
          whatsappNumber: r.whatsappNumber?.toString().trim() || undefined,
          experienceYears: parseNum(r.experienceYears),
          website: r.website?.toString().trim() || undefined,
          rating: parseNum(r.rating),
          isVerified: parseBool(r.isVerified),
          avgRating: parseNum(r.avgRating),
          facebookProfile: r.facebookProfile?.toString().trim() || undefined,
        };
      })
      .filter(Boolean) as CreateBrokerDirectoryDto[];

    if (docs.length === 0) throw new BadRequestException('No valid rows');
    const result = await this.brokerModel.insertMany(docs, { ordered: false });
    return { inserted: result.length };
  }
}
