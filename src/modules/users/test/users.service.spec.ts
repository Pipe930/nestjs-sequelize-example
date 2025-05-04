import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import {
    idUser,
    mockUserModel,
    paginationObjectTest,
    searchObjectTest,
    userObjectTest,
    userObjectTestUpdate,
} from './mock.users';
import { Op } from 'sequelize';
import { HttpStatus } from '@nestjs/common';

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
        expect(await service.create({ ...userObjectTest })).toEqual({
            message: expect.any(String),
            statusCode: HttpStatus.CREATED,
        });

        expect(mockUserModel.create).toHaveBeenCalledTimes(1);
    });

    it('should return a list of users', async () => {

        expect(await service.findAll(paginationObjectTest)).toEqual({
            statusCode: HttpStatus.OK,
            data: [userObjectTest],
            count: expect.any(Number),
            currentPage: expect.any(Number),
            totalPages: expect.any(Number),
        });

        expect(mockUserModel.findAll).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findAll).toHaveBeenCalledWith({
            attributes: { exclude: ['password'] },
            order: [[paginationObjectTest.sortBy, paginationObjectTest.order]],
            limit: paginationObjectTest.limit,
            offset: ((paginationObjectTest.page ?? 1) - 1) * (paginationObjectTest.limit ?? 10),
        });
    });

    it('should return a user by id', async () => {
        expect(await service.findOne(idUser)).toEqual(userObjectTest);

        expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findOne).toHaveBeenCalledWith({
            where: { idUser },
            attributes: { exclude: ['password'] },
        });
    });

    it('should return a list of users by search', async () => {

        expect(await service.searchUser(searchObjectTest)).toEqual([userObjectTest]);

        expect(mockUserModel.findAll).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findAll).toHaveBeenCalledWith({
            where: { 
                username: { [Op.iLike]: `%${searchObjectTest.username}%` },
                email: { [Op.iLike]: `%${searchObjectTest.email}%` },
            },
            attributes: { exclude: ['password'] }
        });
    });
    
    it('should update a user', async () => {
        expect(await service.update(idUser, userObjectTestUpdate)).toEqual({
            statusCode: HttpStatus.OK,
            message: expect.any(String),
        });

        expect(mockUserModel.update).toHaveBeenCalledTimes(1);
        expect(mockUserModel.update).toHaveBeenCalledWith(
            {
                ...userObjectTestUpdate,
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
