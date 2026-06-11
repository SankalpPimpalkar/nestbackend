import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = request.cookies['access_token']

    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    const decodedToken = await this.jwtService.verifyAsync(token)
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid Token')
    }

    const user = await this.userService.getUserById(decodedToken.sub)
    request['user'] = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email
    }

    return true
  }
}
