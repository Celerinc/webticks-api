import { Controller, Post, UseGuards, Request, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalUserAuthGuard } from './guards/local-user-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async loginAdmin(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalUserAuthGuard)
  @Post('user/login')
  async loginUser(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/create')
  async createAdmin(@Request() req, @Body() registerDto: RegisterDto) {
    if (!req.user.isSuperAdmin) {
      throw new UnauthorizedException('Only Superadmin can create admins');
    }
    return this.authService.createAdmin(registerDto.email, registerDto.password);
  }
}
