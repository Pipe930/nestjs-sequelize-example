import { PERMISION_KEY } from '@core/decorators/permission.decorator';
import { Roles } from '@core/enums/role.enum';
import { RequestJwt } from '@core/interfaces/request-jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const role = this.reflector.getAllAndOverride<Array<Roles>>(PERMISION_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if(!role) return true;

    const { user } = context.switchToHttp().getRequest() as RequestJwt;

    return role.some(role => role.includes(user.role));
  }
}
