import { AuthenticationGuard } from "@core/guards/authentication.guard"
import { faker } from "@faker-js/faker";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

describe("AuthenticationGuard", () => {

    let guard: AuthenticationGuard;
    let jwtService: JwtService;
    let configService: ConfigService;

    const tokenTest = faker.internet.jwt();

    const mockContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({
            cookies: {
                access_token: tokenTest
            }
        })
    } as any as ExecutionContext;
    
    beforeEach(() => {
        jwtService = new JwtService();
        configService = new ConfigService();
        guard = new AuthenticationGuard(jwtService, configService);

        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    it("should validate jsonwebtoken successfully", () => {

        jest.spyOn(jwtService, "verify").mockResolvedValue({} as never);

        expect(guard.canActivate(mockContext)).toEqual(true);
        expect(jwtService.verify).toHaveBeenCalledTimes(1);
    });

    it("should throw UnauthorizedException if token is not provided", () => {

        mockContext["getRequest"] = jest.fn().mockReturnValue({
            cookies: {}
        })

        jest.spyOn(jwtService, "verify").mockResolvedValue({} as never);

        expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
    })
})