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
  Req,
} from '@nestjs/common';
import { BankerDirectoryService } from './bank-directory.service';
import { CreateBankerDirectoryDto } from './dto/create-bank-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-bank-directory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('banker-directory')
export class BankerDirectoryController {
  constructor(
    private readonly bankerDirectoryService: BankerDirectoryService,
    private readonly jwtService: JwtService,
  ) {}

 @Post('request-directory')
async submitForReview(
  @Body() dto: CreateBankerDirectoryDto,
  @Req() req: Request,
) {
  let user: any = null;

  const authHeader = (req.headers['authorization'] ||
    req.headers['Authorization']) as string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      user = this.jwtService.verify(token);
    } catch (e: any) {
      console.warn(
        'JWT verify failed in /banker-directory/request-directory:',
        e?.message,
      );
    }
  }

  return await this.bankerDirectoryService.requestReview(dto, user);
}


  // ✅ Review counts (pending / approved / rejected)
  @Get('review-counts')
  async getReviewCounts() {
    return await this.bankerDirectoryService.getReviewCounts();
  }

  // ✅ Admin: all review submissions
  @Get('review-requests')
  async getAllSubmissions() {
    return await this.bankerDirectoryService.getAllReviews();
  }

  // ✅ Admin: approve review
  @Post('approve-request/:id')
  async approve(@Param('id') id: string) {
    return await this.bankerDirectoryService.approveReview(id);
  }

  // ✅ Admin: reject review
  @Post('reject-request/:id')
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return await this.bankerDirectoryService.rejectReview(id, reason);
  }

  // ✅ Manual create in main directory (admin)
  @Post('create-directories')
  async create(@Body() dto: CreateBankerDirectoryDto) {
    return await this.bankerDirectoryService.create(dto);
  }

  // ✅ All directory entries (admin full list)
  @Get('get-directories')
  async findAll() {
    return await this.bankerDirectoryService.findAll();
  }

  // ✅ Single directory entry
  @Get('get-directory/:id')
  async findOne(@Param('id') id: string) {
    return await this.bankerDirectoryService.findOne(id);
  }

  // ✅ Update directory entry
  @Patch('update-directory/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBankerDirectoryDto,
  ) {
    return this.bankerDirectoryService.update(id, updateDto);
  }

  // ✅ Delete directory entry
  @Delete('delete-directory/:id')
  async remove(@Param('id') id: string) {
    return await this.bankerDirectoryService.remove(id);
  }

  // ✅ Filter listing (admin generic search)
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

  // ✅ State-city meta
  @Get('state-city-meta')
  async getStateCityMeta() {
    return this.bankerDirectoryService.getStateCityMeta();
  }

  // ✅ Bulk upload from Excel/CSV
  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return this.bankerDirectoryService.bulkImportFromBuffer(
      file.buffer,
      file.originalname,
    );
  }

  // ✅ Logged-in user: apni review requests (pending + approved + rejected)
  @Get('my-review-requests')
  async getMyReviewRequests(@Req() req: Request) {
    let user: any = null;

    const authHeader = (req.headers['authorization'] ||
      req.headers['Authorization']) as string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        user = this.jwtService.verify(token);
      } catch (e: any) {
        console.warn('JWT verify failed in /my-review-requests:', e?.message);
      }
    }

    if (!user || !(user._id || user.id || user.sub)) {
      throw new BadRequestException('User not identified from token');
    }

    const userId = user._id || user.id || user.sub;
    return this.bankerDirectoryService.getMyReviews(userId);
  }

  // ✅ Logged-in user: apne approved bankers (live directory me jo gaye)
  @Get('my-approved')
  async getMyApproved(@Req() req: Request) {
    let user: any = null;

    const authHeader = (req.headers['authorization'] ||
      req.headers['Authorization']) as string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        user = this.jwtService.verify(token);
      } catch (e: any) {
        console.warn('JWT verify failed in /my-approved:', e?.message);
      }
    }

    if (!user || !(user._id || user.id || user.sub)) {
      throw new BadRequestException('User not identified from token');
    }

    const userId = user._id || user.id || user.sub;
    return this.bankerDirectoryService.getMyApprovedBankers(userId);
  }
}
