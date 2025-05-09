import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { RefreshToken } from '@modules/users/models/tokenJwt.model';
import {
    mockRefreshTokenModel,
    mockResponse,
    mockRequest,
    mockRequestRefresh,
    mockUser,
    mockUserServices
} from './mock.auth';
import { UsersService } from '@modules/users/users.service';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@modules/users/models/user.model';
import { idUser } from '../users/mock.users';

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
                    useValue: mockUserServices
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

        expect(await service.singIn(mockUser, mockResponse)).toEqual({
            statusCode: HttpStatus.OK,
            message: expect.any(String)
        });

        expect(compareSpy).toHaveBeenCalledTimes(1);
    });

    it("should logout a user", async () => {

        expect(await service.logout(mockRequest.user.userId, mockResponse)).toEqual({
            message: expect.any(String),
            statusCode: HttpStatus.OK
        });

        expect(mockRefreshTokenModel.destroy).toHaveBeenCalledWith({
            where: {
                idRefreshToken: mockRequest.user.userId
            }
        });
    });

    it("should refresh token a user", async () => {

        jest.spyOn(mockRefreshTokenModel, "findOne").mockResolvedValue(RefreshToken as any);
        jest.spyOn(service, "generateTokenJWT").mockResolvedValue(void 0);

        expect(await service.refreshToken(mockRequestRefresh as any, mockResponse)).toEqual({
            message: expect.any(String),
            statusCode: HttpStatus.OK,
        });

        expect(mockRefreshTokenModel.findOne).toHaveBeenCalledWith({
            where: { token: mockRequestRefresh.cookies.refresh_token },
        });
        expect(service.generateTokenJWT).toHaveBeenCalledTimes(1);
    });

    it("should a user profile", async () => {

        expect(await service.userProfile(idUser)).toEqual({
            statusCode: HttpStatus.OK,
            data: expect.any(Object)
        });

        expect(mockUserServices.findOne).toHaveBeenCalled();
    });
});
