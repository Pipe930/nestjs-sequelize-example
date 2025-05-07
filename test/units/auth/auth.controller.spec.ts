import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { mockAuthService, mockRepsonse, mockRequest, mockUser } from './mock.auth';
import { JwtService } from '@nestjs/jwt';

describe("AuthController", () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, JwtService],
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

        expect(await controller.signin(mockUser, mockRepsonse)).toEqual({
            email: mockUser.email,
            password: mockUser.password
        });

        expect(mockAuthService.singIn).toHaveBeenCalledWith(mockUser, mockRepsonse);
    });

    it("should logout a user", async () => {

        expect(await controller.logout(mockRequest, mockRepsonse)).toEqual({
            id: expect.any(Number),
            response: mockRepsonse
        });

        expect(mockAuthService.logout).toHaveBeenCalledWith(mockRequest.user.userId, mockRepsonse);
    });

    it("should refresh a token", async () => {

        expect(await controller.refreshToken(mockRequest, mockRepsonse)).toEqual({
            request: mockRequest,
            response: mockRepsonse
        });

        expect(mockAuthService.refreshToken).toHaveBeenCalledWith(mockRequest, mockRepsonse);
    });

    it("should get user profile", async () => {

        expect(await controller.profile(mockRequest)).toEqual({
            id: expect.any(Number)
        });

        expect(mockAuthService.userProfile).toHaveBeenCalledWith(mockRequest.user.userId);
    })
    
});