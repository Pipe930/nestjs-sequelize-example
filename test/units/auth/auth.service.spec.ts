import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { RefreshToken } from '@modules/users/models/tokenJwt.model';
import {
    mockRefreshTokenModel,
    mockRepsonse,
    mockUser,
    mockUserModel,
} from './mock.auth';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/models/user.model';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                UsersService,
                {
                    provide: getModelToken(RefreshToken),
                    useValue: mockRefreshTokenModel
                },
                {
                    provide: getModelToken(User),
                    useValue: mockUserModel
                }
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);

        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should sigin a user", async () => {

        const compareSpy = jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
        jest.spyOn(service, "generateTokenJWT").mockResolvedValue(void 0);
        jest.spyOn(service, "storeRefreshToken").mockResolvedValue(void 0);

        expect(await service.singIn(mockUser, mockRepsonse)).toEqual({
            statusCode: HttpStatus.OK,
            message: expect.any(String)
        });

        expect(compareSpy).toHaveBeenCalledTimes(1);
    });
});
