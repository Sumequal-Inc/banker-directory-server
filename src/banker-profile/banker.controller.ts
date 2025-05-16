import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { BankerService } from './banker.service';
import { createBankerProfileDto } from './dto/create-banker.dto';
import { UpdateBankerProfileDtoyDto } from './dto/update-banker.dto';

@Controller('bankers')
export class BankerController {
  constructor(private readonly bankerService: BankerService) {}

  @Post('create-banker')
  create(@Body() createBankerDto: createBankerProfileDto) {
    return this.bankerService.create(createBankerDto);
  }

  @Get('get-bankers')
  async findAll(
    @Query()
    searchParams: {
      currentInstitutionName?: string;
      experience?: string;
      sortBy?: string;
      sortOrder?: string;
    },
  ) {
    return this.bankerService.findAll(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankerService.findOne(id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateBankerDto: UpdateBankerProfileDtoyDto,
  ) {
    return this.bankerService.update(id, updateBankerDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.bankerService.remove(id);
  }
}
