import { AuthenticationGuard } from "@core/guards/authentication.guard"
import { faker } from "@faker-js/faker";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

describe("AuthenticationGuard", () => {

    let guard: AuthenticationGuard;
    let jwtService: JwtService;

    const tokenTest = faker.internet.jwt();

    const mockContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({
            cookies: {
                access_token: tokenTest
            }
        })
    } as any as ExecutionContext;

    const mockContextFailed = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({
            cookies: {}
        })
    } as any as ExecutionContext;

    beforeEach(() => {
        jwtService = new JwtService();
        guard = new AuthenticationGuard(jwtService);

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

        jest.spyOn(jwtService, "verify").mockResolvedValue({} as never);

        expect(() => guard.canActivate(mockContextFailed)).toThrow(UnauthorizedException);
    })
})