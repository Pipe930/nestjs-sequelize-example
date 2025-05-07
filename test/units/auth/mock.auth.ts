import { RequestJwt } from "@core/interfaces/request-jwt";
import { faker } from "@faker-js/faker";
import { SignInDto } from "@modules/auth/dto/signin.dto";
import { Response } from 'express';

export const mockUser: SignInDto = {
    email: faker.internet.email(),
    password: faker.internet.password()
}

export const mockAuthService = {
    singIn: jest.fn().mockImplementation(dto => dto),
    logout: jest.fn().mockImplementation((id, response) => ({id, response})),
    refreshToken: jest.fn().mockImplementation((request, response) => ({request, response})),
    userProfile: jest.fn().mockImplementation((id) => ({id}))
}

export const mockRefreshTokenModel = {

}

export const mockRequest = {
    user: {
        userId: faker.number.int(),
        username: faker.person.fullName()
    }
} as RequestJwt;

export const mockUserModel = {
    findOne: jest.fn().mockResolvedValue({
        mockUser,
        update: jest.fn().mockReturnValue([1])
    })
};

export const mockRepsonse = {
    cookie: jest.fn()
} as any as Response;