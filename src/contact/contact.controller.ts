// src/contact/contact.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Post,
  Query
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactStatus } from './schemas/contact.schema';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // 🔹 Public endpoint – form submit from your React ContactSection
  @Post('create-contact')
  async create(@Body() createContactDto: CreateContactDto) {
    const created = await this.contactService.create(createContactDto);
    return {
      message: 'Thank you! We have received your details.',
      data: created
    };
  }

  // 🔹 Admin list – use in your admin panel
  @Get()
  async findAll(
    @Query('status') status?: ContactStatus,
    @Query('search') search?: string
  ) {
    const data = await this.contactService.findAll({ status, search });
    return { data };
  }

  // 🔹 Single record detail
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.contactService.findOne(id);
    return { data };
  }

  // 🔹 Update status / internal note, etc.
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto
  ) {
    const data = await this.contactService.update(id, updateContactDto);
    return { data };
  }

  // 🔹 Delete (archive, etc.)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.contactService.remove(id);
    return { message: 'Contact deleted successfully' };
  }

  // 🔹 Simple stats – for showing counts in sidebar badges
  @Get('stats/summary')
  async getStats() {
    const stats = await this.contactService.getStats();
    return { stats };
  }
}
