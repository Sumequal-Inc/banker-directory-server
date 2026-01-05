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
    const id = user._id ?? user.id;
    const payload = {
  id: user._id.toString(),
      email: user.email,
     
      role: user.role,
      fullName: user.fullName,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  // DO NOT hash here. Hash only inside UserService.create()
  async signup(
    email: string,
    password: string,
    role: 'admin' | 'user' | 'broker' | 'brokeradmin',
    fullName: string,
    gender?: 'male' | 'female' | 'other',
  ) {
    const userExists = await this.userService.findByEmail(email);
    if (userExists) throw new BadRequestException('User already exists');

 const hashedPassword = await bcrypt.hash(password, 10);    const user = await this.userService.create({
      email,
      password:hashedPassword, 
      role,
      fullName,
      ...(gender && { gender }),
    });

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

  async getProfileByEmail(email: string) {
    return this.userService.findByEmail(email);
  }
}
