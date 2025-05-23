import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@modules/users/users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '@modules/users/models/user.model';
import {
    idUser,
    mockUserModel,
    paginationTest,
    searchTest,
    userMockFailed,
    userTest,
    userTestUpdate,
} from './mock.users';
import { Op } from 'sequelize';
import { BadRequestException, ConflictException, HttpStatus, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new user record and return that', async () => {

        jest.spyOn(bcrypt, "hash").mockResolvedValue("passwordHash" as never);

        expect(await service.create(userTest)).toEqual({
            message: expect.any(String),
            statusCode: HttpStatus.CREATED,
        });

        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(mockUserModel.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a bad request exception for invalid passwords', async () => {

        await expect(service.create(userMockFailed)).rejects.toThrow(BadRequestException)
    });

    it('should throw ConflictException if email or username is already registered', async () => {

        const error = new Error();
        error.name = "SequelizeUniqueConstraintError";

        mockUserModel.create.mockRejectedValue(error)

        await expect(service.create(userTest)).rejects.toThrow(ConflictException);
    });

    it('should return a list of users', async () => {

        expect(await service.findAll(paginationTest)).toEqual({
            statusCode: HttpStatus.OK,
            data: [userTest],
            count: expect.any(Number),
            currentPage: expect.any(Number),
            totalPages: expect.any(Number),
        });

        expect(mockUserModel.findAll).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findAll).toHaveBeenCalledWith({
            attributes: { exclude: ['password'] },
            order: [[paginationTest.sortBy, paginationTest.order]],
            limit: paginationTest.limit,
            offset: ((paginationTest.page ?? 1) - 1) * (paginationTest.limit ?? 10),
        });
    });

    it('should return a user by id', async () => {
        expect(await service.findOne(idUser)).toEqual(userTest);

        expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findOne).toHaveBeenCalledWith({
            where: { idUser },
            attributes: { exclude: ['password'] },
        });
    });

    it('should return not found user exception', async () => {
        mockUserModel.findOne.mockResolvedValue(undefined);

        await expect(service.findOne(idUser)).rejects.toThrow(NotFoundException);
    });

    it('should return a list of users by search', async () => {

        expect(await service.searchUser(searchTest)).toEqual([userTest]);

        expect(mockUserModel.findAll).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findAll).toHaveBeenCalledWith({
            where: { 
                username: { [Op.iLike]: `%${searchTest.username}%` },
                email: { [Op.iLike]: `%${searchTest.email}%` },
            },
            attributes: { exclude: ['password'] }
        });
    });
    
    it('should update a user', async () => {
        expect(await service.update(idUser, userTestUpdate)).toEqual({
            statusCode: HttpStatus.OK,
            message: expect.any(String),
        });

        expect(mockUserModel.update).toHaveBeenCalledTimes(1);
        expect(mockUserModel.update).toHaveBeenCalledWith(
            {
                ...userTestUpdate,
            },
            {
                where: { idUser },
            },
        );
    });

    it('should delete a user', async () => {
        expect(await service.remove(idUser)).toEqual({
            statusCode: HttpStatus.NO_CONTENT,
            message: expect.any(String),
        });

        expect(mockUserModel.destroy).toHaveBeenCalledTimes(1);
        expect(mockUserModel.destroy).toHaveBeenCalledWith({
            where: { idUser },
        });
    });
});
