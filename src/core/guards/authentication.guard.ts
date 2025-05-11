import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies["access_token"];

    if(!token) throw new UnauthorizedException("Token no provisto en la peticion");

    try{

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>("keyJwt")
      });

      request["user"] = payload;
    }catch(error) {
      throw new UnauthorizedException("El token ingresado no es valido");
    }

    return true;
  }
}
