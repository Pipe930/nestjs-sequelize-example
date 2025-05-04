import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import {
    mockUsersService,
    userTest,
    idUser,
    paginationTest,
    searchTest,
} from './mock.users';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
        })
        .overrideProvider(UsersService)
        .useValue(mockUsersService)
        .compile();

        controller = module.get<UsersController>(UsersController);

        jest.clearAllMocks();
    });

    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });

    it('should findAll a user', async () => {
        expect(await controller.findAll(paginationTest)).toEqual([
            userTest,
        ]);

        expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    it('should findOne a user', async () => {
        expect(await controller.findOne(idUser)).toEqual(userTest);

        expect(mockUsersService.findOne).toHaveBeenCalledWith(idUser);
    });

    it('should search a user', async () => {
        expect(await controller.search(searchTest)).toEqual([
            userTest,
        ]);

        expect(mockUsersService.searchUser).toHaveBeenCalled();
    });

    it('should create a user', async () => {
        expect(await controller.create(userTest)).toEqual({
            id: expect.any(Number),
            ...userTest,
        });

        expect(mockUsersService.create).toHaveBeenCalledWith({
            ...userTest,
        });
    });

    it('should update a user', async () => {
        expect(await controller.update(idUser, userTest)).toEqual({
            id: idUser,
            ...userTest,
        });

        expect(mockUsersService.update).toHaveBeenCalledWith(
            idUser,
            userTest,
        );
    });

    it('should remove a user', async () => {
        const expectedResult = { message: `User ${idUser} removed` };

        expect(await controller.remove(idUser)).toEqual(expectedResult);

        expect(mockUsersService.remove).toHaveBeenCalledWith(idUser);
    });
});
