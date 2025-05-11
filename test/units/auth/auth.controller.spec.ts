import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { mockAuthService, mockResponse, mockRequest, mockUser } from './mock.auth';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe("AuthController", () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, JwtService, ConfigService],
        })
        .overrideProvider(AuthService)
        .useValue(mockAuthService)
        .compile();

        controller = module.get<AuthController>(AuthController);

        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should signin a user", async () => {

        expect(await controller.signin(mockUser, mockResponse)).toEqual({
            email: mockUser.email,
            password: mockUser.password
        });

        expect(mockAuthService.singIn).toHaveBeenCalledWith(mockUser, mockResponse);
    });

    it("should logout a user", async () => {

        expect(await controller.logout(mockRequest, mockResponse)).toEqual({
            id: expect.any(Number),
            response: mockResponse
        });

        expect(mockAuthService.logout).toHaveBeenCalledWith(mockRequest.user.userId, mockResponse);
    });

    it("should refresh a token", async () => {

        expect(await controller.refreshToken(mockRequest, mockResponse)).toEqual({
            request: mockRequest,
            response: mockResponse
        });

        expect(mockAuthService.refreshToken).toHaveBeenCalledWith(mockRequest, mockResponse);
    });

    it("should get user profile", async () => {

        expect(await controller.profile(mockRequest)).toEqual({
            id: expect.any(Number)
        });

        expect(mockAuthService.userProfile).toHaveBeenCalledWith(mockRequest.user.userId);
    })
    
});