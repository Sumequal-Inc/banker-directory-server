import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { BankerDirectoryService } from './bank-directory.service';
import { CreateBankerDirectoryDto } from './dto/create-bank-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-bank-directory.dto';

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

  @Put('update-directory/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBankerDirectoryDto,
  ) {
    return await this.bankerDirectoryService.update(id, updateDto);
  }

  @Delete('delete-directory/:id')
  async remove(@Param('id') id: string) {
    return await this.bankerDirectoryService.remove(id);
  }

@Get('filter')
async filter(
  @Query('location') location?: string,
  @Query('bankerName') bankerName?: string,
  @Query('emailOfficial') emailOfficial?: string,
  @Query('emailPersonal') emailPersonal?: string,
  @Query('associatedWith') associatedWith?: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10
) {
  return await this.bankerDirectoryService.filterByLocationAndName(
    location,
    bankerName,
    associatedWith,
    emailOfficial,
    emailPersonal,
    +page,
    +limit
  );
}

}
