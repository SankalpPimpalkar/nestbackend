import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
    ) { }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = request.cookies['access_token'] || this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        try {
            const decodedToken = await this.jwtService.verifyAsync(token);

            const user = await this.userService.getUserById(decodedToken.sub);
            request['user'] = {
                _id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
            };
        } catch (error) {
            throw new UnauthorizedException(
                'Cookie Expired. Please Login Again',
            );
        }
        return true;
    }
}
