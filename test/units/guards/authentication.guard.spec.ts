import { AuthenticationGuard } from "@core/guards/authentication.guard"
import { faker } from "@faker-js/faker";
import { ExecutionContext } from "@nestjs/common";
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

    beforeEach(() => {
        jwtService = new JwtService();
        guard = new AuthenticationGuard(jwtService);
    });

    it("should be defined", () => {
        expect(guard).toBeDefined()
    });

    it("should validate the functionality that verifies the jsonwebtoken", () => {

        jest.spyOn(jwtService, "verifyAsync").mockResolvedValue({})

        expect(guard.canActivate(mockContext)).toEqual(true);
        expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
    })
})