import { RequestJwt } from "@core/interfaces/request-jwt";
import { faker } from "@faker-js/faker";
import { SignInDto } from "@modules/auth/dto/signin.dto";
import { Response } from 'express';

export const mockUser: SignInDto = {
    email: faker.internet.email(),
    password: faker.internet.password()
}

export const idUser = faker.number.int();

export const mockAuthService = {
    singIn: jest.fn().mockImplementation(dto => dto),
    logout: jest.fn().mockImplementation((id, response) => ({id, response})),
    refreshToken: jest.fn().mockImplementation((request, response) => ({request, response})),
    userProfile: jest.fn().mockImplementation((id) => ({id}))
}

export const refreshTokenTest = {
    idRefreshToken: faker.number.int(),
    token: faker.internet.jwt(),
    expiryDate: faker.date.anytime()
}

export const mockRefreshTokenModel = {
    destroy: jest.fn(),
    findOne: jest.fn()
}

export const mockRequest = {
    user: {
        userId: faker.number.int(),
        username: faker.person.fullName()
    }
} as RequestJwt;

export const mockRequestRefresh = {
    cookies: {
        refresh_token: faker.internet.jwt(),
    },
};

export const mockUserServices = {
    findOne: jest.fn().mockResolvedValue({
        mockUser,
        update: jest.fn().mockReturnValue([1])
    })
};

export const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn()
} as any as Response;