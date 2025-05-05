import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { RefreshToken } from '@modules/users/models/tokenJwt.model';
import { mockRefreshTokenModel } from './mock.auth';
import { UsersService } from '@modules/users/users.service';

describe("AuthService", () => {
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
                }
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);

        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});