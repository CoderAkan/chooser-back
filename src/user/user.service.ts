import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    
    const existUser = await this.prisma.user.findUnique({
      where: {
        userName: createUserDto.userName, 
      }
    });
    
    if (existUser){
      throw new BadRequestException('This email already exists')
    }
    const user = await this.prisma.user.create({
      data: {
        userName: createUserDto.userName,
        password: await argon2.hash(createUserDto.password),
      }
  })

    const token = this.jwtService.sign({userName: createUserDto.userName})

    return {user, token}
  
}

  async findOne(userName: string) {
    return await this.prisma.user.findUnique({
      where: { 
        userName: userName 
      }
    }); 
  }
}