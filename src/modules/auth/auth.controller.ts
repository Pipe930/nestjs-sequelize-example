import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Request } from 'express';
import { AuthenticationGuard } from '../../core/guards/authentication.guard'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() signInDto: SignInDto){
    return this.authService.singIn(signInDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('logout')
  logout(@Req() request: Request){
    return this.authService.logout(request["user"].userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Body() refreshToken: RefreshTokenDto){
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  profile(@Req() request: Request){
    return this.authService.userProfile(request["user"].userId);
  }
}
