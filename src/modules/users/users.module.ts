import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './models/user.model';
import { PasswordService } from '@core/services/password.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PasswordService, ...usersProviders],
})
export class UsersModule {}
