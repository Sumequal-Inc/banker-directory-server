import {
  Controller, Get, Post, Body, Param, Delete, Query, Put,
  UploadedFile, UseInterceptors, BadRequestException, UsePipes, ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { BrokerDirectoryService } from './broker-directory.service';
import { CreateBrokerDirectoryDto } from './dto/create-broker-directory.dto';
import { UpdateBrokerDirectoryDto } from './dto/update-broker-directory.dto';

@Controller('broker-directory')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class BrokerDirectoryController {
  constructor(private readonly brokerService: BrokerDirectoryService) {}

  @Post('create-broker')
  create(@Body() dto: CreateBrokerDirectoryDto) {
    return this.brokerService.create(dto);
  }

  @Get('get-brokers')
  findAll() {
    return this.brokerService.findAll();
  }

  @Get('filter')
  async filter(
    @Query('brokerName') brokerName?: string,
    @Query('fullName') fullName?: string,        // legacy
    @Query('agencyName') agencyName?: string,
    @Query('city') city?: string,
    @Query('email') email?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.brokerService.filter(
      { brokerName: brokerName ?? fullName, agencyName, city, email },
      pageNum,
      limitNum,
    );
  }

  @Get('get-directory/:id')
  findOne(@Param('id') id: string) {
    return this.brokerService.findOne(id);
  }

  @Put('update-directory/:id')
  updateAlias(@Param('id') id: string, @Body() dto: UpdateBrokerDirectoryDto) {
    return this.brokerService.update(id, dto);
  }

  @Delete('delete-directory/:id')
  remove(@Param('id') id: string) {
    return this.brokerService.remove(id);
  }

  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('No file uploaded');
    const wb = XLSX.read(file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    return this.brokerService.bulkUpload(rows as any[]);
  }
}
