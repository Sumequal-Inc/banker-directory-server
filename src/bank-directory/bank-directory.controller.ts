import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { BankerDirectoryService } from './bank-directory.service';
import { CreateBankerDirectoryDto } from './dto/create-bank-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-bank-directory.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banker-directory')
export class BankerDirectoryController {
  constructor(
    private readonly bankerDirectoryService: BankerDirectoryService,
  ) {}

  // ✅ Public form submits here for review
  @Post('request-directory')
  async submitForReview(@Body() dto: CreateBankerDirectoryDto) {
    return await this.bankerDirectoryService.requestReview(dto);
  }

  @Get('review-counts')
async getReviewCounts() {
  return await this.bankerDirectoryService.getReviewCounts();
}


// ✅ Admin: Get all review submissions (pending, approved, rejected)
@Get('review-requests')
async getAllSubmissions() {
  return await this.bankerDirectoryService.getAllReviews();
}


  // ✅ Admin: Approve a specific request
  @Post('approve-request/:id')
  async approve(@Param('id') id: string) {
    return await this.bankerDirectoryService.approveReview(id);
  }

 @Post('reject-request/:id')
async reject(
  @Param('id') id: string,
  @Body('reason') reason: string
) {
  return await this.bankerDirectoryService.rejectReview(id, reason);
}

  // ✅ (Optional) Admin/manual insert to main table
  @Post('create-directories')
  async create(@Body() dto: CreateBankerDirectoryDto) {
    return await this.bankerDirectoryService.create(dto);
  }

  // ✅ Get all approved entries from main table
  @Get('get-directories')
  async findAll() {
    return await this.bankerDirectoryService.findAll();
  }

  @Get('get-directory/:id')
  async findOne(@Param('id') id: string) {
    return await this.bankerDirectoryService.findOne(id);
  }
@Patch('update-directory/:id')
async update(@Param('id') id: string, @Body() updateDto: UpdateBankerDirectoryDto) {
  return this.bankerDirectoryService.update(id, updateDto);
}


  @Delete('delete-directory/:id')
  async remove(@Param('id') id: string) {
    return await this.bankerDirectoryService.remove(id);
  }
@Get('filter')
async filter(
  @Query('state') state?: string,
  @Query('city') city?: string,
  @Query('bankerName') bankerName?: string,
  @Query('emailOfficial') emailOfficial?: string,
  @Query('emailPersonal') emailPersonal?: string,
  @Query('associatedWith') associatedWith?: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return await this.bankerDirectoryService.filterByLocationAndName(
    state,
    city,
    bankerName,
    associatedWith,
    emailOfficial,
    emailPersonal,
    +page,
    +limit,
  );
}

// bank-directory.controller.ts

@Get('state-city-meta')
async getStateCityMeta() {
  return this.bankerDirectoryService.getStateCityMeta();
}



  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return this.bankerDirectoryService.bulkImportFromBuffer(file.buffer, file.originalname);
  }

}
