// src/lender/lender.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lender, LenderDocument } from './schemas/lender.schema';
import { CreateLenderDto } from './dto/create-lender.dto';
import { UpdateLenderDto } from './dto/update-lender.dto';

@Injectable()
export class LenderService {
  constructor(
    @InjectModel(Lender.name) private lenderModel: Model<LenderDocument>
  ) {}

  async create(createDto: CreateLenderDto): Promise<Lender> {
    return this.lenderModel.create(createDto);
  }

  async findAll(): Promise<Lender[]> {
    return this.lenderModel.find().exec();
  }

  async findOne(id: string): Promise<Lender | null> {
    return this.lenderModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateLenderDto): Promise<Lender | null> {
    return this.lenderModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Lender | null> {
    return this.lenderModel.findByIdAndDelete(id).exec();
  }

 async search(filters: {
  state?: string;
  city?: string;
  lenderName?: string;
}): Promise<Lender[]> {
  const orConditions: any[] = [];

  if (filters.state) {
    orConditions.push({ state: new RegExp(filters.state, 'i') });
  }

  if (filters.city) {
    orConditions.push({ city: new RegExp(filters.city, 'i') });
  }

  if (filters.lenderName) {
    orConditions.push({ lenderName: new RegExp(filters.lenderName, 'i') });
  }

  // If no filter is passed, return all
  if (orConditions.length === 0) {
    return this.lenderModel.find().exec();
  }

  return this.lenderModel.find({ $or: orConditions }).exec();
}


}
