import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { LenderService } from './lender.service';
import { CreateLenderDto } from './dto/create-lender.dto';
import { UpdateLenderDto } from './dto/update-lender.dto';

@Controller('lenders')
export class LenderController {
  constructor(private readonly lenderService: LenderService) {}

  @Post('create-lender')
  create(@Body() createDto: CreateLenderDto) {
    return this.lenderService.create(createDto);
  }

  @Get('get-lenders')
  findAll() {
    return this.lenderService.findAll();
  }

  @Get('get-lenders/:id')
  findOne(@Param('id') id: string) {
    return this.lenderService.findOne(id);
  }

  @Patch('update-lenders/:id')
  update(@Param('id') id: string, @Body() updateDto: UpdateLenderDto) {
    return this.lenderService.update(id, updateDto);
  }

  @Delete('delete-lenders/:id')
  remove(@Param('id') id: string) {
    return this.lenderService.remove(id);
  }

@Get('search')
search(
  @Query('state') state?: string,
  @Query('city') city?: string,
  @Query('lenderName') lenderName?: string
) {
  return this.lenderService.search({ state, city, lenderName });
}


}
