// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login-dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string, role: 'admin' | 'user') {
    const userExists = await this.userService.findByEmail(email);
    if (userExists) throw new BadRequestException('User already exists');
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userService.create({ email, password: hash, role });
    return this.login(user);
  }

  async sendResetPasswordEmail(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    return 'Reset email would be sent here (implement logic)';
  }

  async resetPassword(dto: ResetPasswordDto, token: string): Promise<void> {
    if (!token) throw new BadRequestException('Token is missing'); 
    const user = await this.userService.findByEmail('test@example.com');
    if (!user) throw new BadRequestException('User not found');
    user.password = await bcrypt.hash(dto.password, 10);
    await user.save();
  }
}
