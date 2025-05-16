import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { BankerDirectoryService } from './banker-directory.service';
import { CreateBankerDirectoryDto } from './dto/create-banker-directory.dto';
import { UpdateBankerDirectoryDto } from './dto/update-banker-directory.dto';

@Controller('bankers')
export class BankerDirectoryController {
  constructor(private readonly bankerDirectoryService: BankerDirectoryService) {}

  @Post('create')
  async create(@Body() createBankerDirectoryDto: CreateBankerDirectoryDto) {
    return await this.bankerDirectoryService.create(createBankerDirectoryDto);
  }

  @Get()
  async findAll() {
    return await this.bankerDirectoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bankerDirectoryService.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBankerDirectoryDto: UpdateBankerDirectoryDto,
  ) {
    return await this.bankerDirectoryService.update(id, updateBankerDirectoryDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.bankerDirectoryService.remove(id);
  }
}
