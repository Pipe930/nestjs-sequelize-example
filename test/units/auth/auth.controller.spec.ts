import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { mockAuthService } from './mock.auth';
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
});