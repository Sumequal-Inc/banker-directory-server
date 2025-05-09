import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';

@Controller('directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Post('create-directory')
  create(@Body() createDirectoryDto: CreateDirectoryDto) {
    return this.directoryService.create(createDirectoryDto);
  }

  @Get('get-directories')
  async findAll(@Query() searchParams: { currentInstitutionName?: string; experience?: string; sortBy?: string; sortOrder?: string }) {
    return this.directoryService.findAll(searchParams);
  }

  @Get('get-directory/:id')
  findOne(@Param('id') id: string) {
    return this.directoryService.findOne(id);
  }

  @Patch('update-directories/:id')
  update(
    @Param('id') id: string,
    @Body() updateDirectoryDto: UpdateDirectoryDto,
  ) {
    return this.directoryService.update(id, updateDirectoryDto);
  }

  @Delete('delete-directories/:id')
  remove(@Param('id') id: string) {
    return this.directoryService.remove(id);
  }
}