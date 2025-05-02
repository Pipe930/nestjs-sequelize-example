import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { idUser, mockUserModel, userObjectTest, userObjectTestUpdate } from './mock.users';

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
            statusCode: expect.any(Number),
        });

        expect(mockUserModel.create).toHaveBeenCalledTimes(1);
    });

    it('should return a list of users', async () => {

        expect(await service.findAll()).toEqual([userObjectTest]);

        expect(mockUserModel.findAll).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findAll).toHaveBeenCalledWith({
            attributes: { exclude: ["password"] }
        });
    });

    it('should return a user by id', async () => {
        
        expect(await service.findOne(idUser)).toEqual(userObjectTest);

        expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
        expect(mockUserModel.findOne).toHaveBeenCalledWith({ 
            where: { idUser }, 
            attributes: { exclude: ["password"] }
        });
    });

    it('should update a user', async () => {

        const updateStub = jest.fn();

        const findSpy = jest.spyOn(service, 'findOne').mockResolvedValue({
            ...userObjectTest,
            update: updateStub
        } as any);

        expect(await service.update(idUser, userObjectTestUpdate)).toEqual({
            statusCode: expect.any(Number),
            message: expect.any(String)
        });

        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(updateStub).toHaveBeenCalledTimes(1);
    });

    it('should delete a user', async () => {

        const destroyStub = jest.fn();
        
        const findSpy = jest.spyOn(service, 'findOne').mockResolvedValue({
            ...userObjectTest,
            destroy: destroyStub
        } as any);

        expect(await service.remove(idUser)).toEqual({
            statusCode: expect.any(Number),
            message: expect.any(String)
        });

        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(destroyStub).toHaveBeenCalledTimes(1);
    });
});
