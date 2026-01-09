import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument, User, UserDocument } from '../database/schemas';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.adminModel.findOne({ email }).exec();

    if (!admin) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash, ...result } = admin.toObject();
    return { ...result, id: admin._id.toString(), role: 'admin' };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash, ...result } = user.toObject();
    return { ...result, id: user._id.toString(), role: 'user' };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin || false,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      passwordHash,
    });

    const { passwordHash: _, ...result } = user.toObject();
    return { ...result, id: user._id.toString() };
  }

  async createAdmin(email: string, password: string) {
    const existingAdmin = await this.adminModel.findOne({ email }).exec();
    if (existingAdmin) {
      throw new UnauthorizedException('Admin already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await this.adminModel.create({
      email,
      passwordHash,
      isSuperAdmin: false,
    });

    const { passwordHash: _, ...result } = admin.toObject();
    return { ...result, id: admin._id.toString() };
  }
}
