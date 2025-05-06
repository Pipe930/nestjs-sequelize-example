import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AuthenticationGuard } from '@core/guards/authentication.guard'; 
import { RequestJwt } from '@core/interfaces/request-jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response){
    return this.authService.singIn(signInDto, response);
  }

  @UseGuards(AuthenticationGuard)
  @Get('logout')
  logout(@Req() request: RequestJwt, @Res({ passthrough: true }) response: Response){
    return this.authService.logout(request.user.userId, response);
  }

  @Get('refresh')
  refreshToken(@Req() request: RequestJwt, @Res({ passthrough: true }) response: Response){
    return this.authService.refreshToken(request, response);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  profile(@Req() request: RequestJwt){
    return this.authService.userProfile(request.user.userId);
  }
}
