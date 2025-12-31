// src/contact/contact.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  Contact,
  ContactDocument,
  ContactStatus
} from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const payload: Partial<Contact> = {
      ...createContactDto,
      status: createContactDto.status || ContactStatus.NEW
    };

    const created = new this.contactModel(payload);
    return created.save();
  }

  async findAll(params?: {
    status?: ContactStatus;
    search?: string;
  }): Promise<Contact[]> {
    const filter: FilterQuery<ContactDocument> = {};

    if (params?.status) {
      filter.status = params.status;
    }

    if (params?.search) {
      const regex = new RegExp(params.search, 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { company: regex }
      ];
    }

    return this.contactModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .exec();
  }

  async findOne(id: string): Promise<Contact> {
    const doc = await this.contactModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException('Contact not found');
    }
    return doc;
  }

  async update(id: string, updateDto: UpdateContactDto): Promise<Contact> {
    const updated = await this.contactModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Contact not found');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.contactModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('Contact not found');
    }
  }

  async getStats() {
    const grouped = await this.contactModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats: Record<string, number> = {};
    grouped.forEach((g) => {
      stats[g._id] = g.count;
    });

    return stats;
  }
}
