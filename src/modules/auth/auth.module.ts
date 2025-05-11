import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from '../users/models/tokenJwt.model'; 
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({

        secret: configService.get("keyJwt"),
        global: true,
        signOptions: { expiresIn: '1h' }
      }),
      inject: [ConfigService]
    }),
    SequelizeModule.forFeature([RefreshToken])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
