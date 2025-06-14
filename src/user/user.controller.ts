import { Controller, Get, Param, Delete, Put, Body, Post, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-users')
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Get('get-users')
  findAll() {
    return this.userService.findAll();
  }

  @Put('update-users/:id')
  update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.update(id, updateDto);
  }

  @Delete('delete-users/:id')
  delete(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.delete(id);
  }
}
