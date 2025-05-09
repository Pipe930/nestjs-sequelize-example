import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request: Request = context.switchToHttp().getRequest();
    const token: string = request.cookies["access_token"];

    if(!token) throw new UnauthorizedException("Token no provisto en la peticion");

    try{

      const payload = this.jwtService.verify(token);

      request["user"] = payload;
    }catch(error) {
      throw new UnauthorizedException("El token ingresado no es valido");
    }

    return true;
  }
}
