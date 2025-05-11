import { AuthorizationGuard } from "@core/guards/authorization.guard"
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { Roles } from "@core/enums/role.enum";

describe("AuthorizationGuard", () => {
    let authorizationGuard: AuthorizationGuard;
    let reflector: Reflector;

    let mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnThis(),
    } as any as ExecutionContext;

    beforeAll(() => {
        reflector = new Reflector();
        authorizationGuard = new AuthorizationGuard(reflector);
    });

    it("should be defined", () => {
        expect(authorizationGuard).toBeDefined();
    });

    it("should return true if no roles are defined", () => {

        mockContext["getRequest"] = jest.fn();

        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);

        expect(authorizationGuard.canActivate(mockContext)).toBe(true);
    });

    it("should return true if user role matches required roles", () => {

        const roles = [Roles.ADMIN];
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(roles);

        mockContext["getRequest"] = jest.fn().mockReturnValue({
                user: { role: Roles.ADMIN }
            });

        expect(authorizationGuard.canActivate(mockContext)).toBe(true);
    });

    it("should return false if user role does not match required roles", () => {

        const roles = [Roles.ADMIN];
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(roles);

        mockContext["getRequest"] = jest.fn().mockReturnValue({
                user: { role: Roles.USER }
        });

        expect(authorizationGuard.canActivate(mockContext)).toBe(false);
    });
});