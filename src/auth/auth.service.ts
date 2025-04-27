import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { IUser } from 'src/types/types'
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string) {
    // const user = await this.prisma.user.findUnique({where: {userName}})
    // if (user) {
    //   const passwordIsMatch = await argon2.verify(user.password, password)
    //   if (user && passwordIsMatch){
    //     return user
    //   }
    // }
    // throw new UnauthorizedException('User or password is incorrect')
  }

  async login(user: IUser) {
    const {id, userName} = user 
    const token = this.jwtService.sign({id: user.id, userName: user.userName})
    return {
      id, 
      userName, 
      token,
    }
  }
}