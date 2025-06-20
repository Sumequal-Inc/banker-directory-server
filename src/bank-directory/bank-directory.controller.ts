import { Controller, Get, Post, Body, Param, Delete, Patch, Query, Put } from '@nestjs/common';
import { BankerDirectoryService } from './bank-directory.service';
import { CreateBankerDirectoryDto } from './dto/create-bank-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-bank-directory.dto';

@Controller('banker-directory')
export class BankerDirectoryController {
  constructor(private readonly bankerDirectoryService: BankerDirectoryService) {}

  @Post('create-directories')
  
  async create(@Body() createBankerDirectoryDto: CreateBankerDirectoryDto) {
    return await this.bankerDirectoryService.create(createBankerDirectoryDto);
  }

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
    @Body() updateBankerDirectoryDto: UpdateBankerDirectoryDto,
  ) {
    return await this.bankerDirectoryService.update(id, updateBankerDirectoryDto);
  }

  @Delete('delete-directory/:id')
  async remove(@Param('id') id: string) {
    return await this.bankerDirectoryService.remove(id);
  }

 @Get('filter')
async filter(
  @Query('location') location?: string,
  @Query('bankerName') bankerName?: string,
  @Query('emailOfficial') emailOfficial?:string,

@Query('emailPersonal') emailPersonal?:string,
  @Query('associatedWith') associatedWith?:string,
) {
  return await this.bankerDirectoryService.filterByLocationAndName(location, bankerName,associatedWith,emailOfficial,emailPersonal);
}
}