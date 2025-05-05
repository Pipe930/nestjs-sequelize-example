import { faker } from '@faker-js/faker';
import { PaginationDto } from '@modules/users/dto/pagination.dto';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { SearchUserDto } from '@modules/users/dto/search-user.dto';

const passwordUserTest = faker.internet.password();
export const idUser = faker.number.int();

export const paginationTest: PaginationDto = {
    page: faker.number.int({ min: 1, max: 100 }),
    limit: faker.number.int({ min: 1, max: 100 }),
    sortBy: 'email',
    order: 'desc' as 'asc' | 'desc',
};

export const searchTest: SearchUserDto = {
    username: faker.internet.username(),
    email: faker.internet.email(),
};

export const userTest: CreateUserDto = {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: passwordUserTest,
    rePassword: passwordUserTest,
    active: faker.datatype.boolean(),
    isStaff: faker.datatype.boolean(),
    isSuperuser: faker.datatype.boolean(),
};

export const userTestUpdate: UpdateUserDto = {
    username: faker.internet.username(),
    email: faker.internet.email(),
    active: faker.datatype.boolean(),
    isStaff: faker.datatype.boolean(),
    isSuperuser: faker.datatype.boolean(),
};

export const mockUsersService = {
    create: jest.fn((dto) => {
        return {
            id: Date.now(),
            ...dto,
        };
    }),
    update: jest.fn().mockImplementation((id, dto) => ({
        id,
        ...dto,
    })),
    findAll: jest.fn().mockResolvedValue([userTest]),
    findOne: jest.fn().mockResolvedValue(userTest),
    searchUser: jest.fn().mockResolvedValue([userTest]),
    remove: jest.fn().mockImplementation((id) => ({ message: `User ${id} removed` })),
};

export const mockUserModel = {
    create: jest.fn().mockImplementation((dto) => dto),
    update: jest.fn().mockReturnValue([1]),
    findAll: jest.fn().mockResolvedValue([userTest]),
    findOne: jest.fn().mockResolvedValue(userTest),
    destroy: jest.fn().mockResolvedValue(1),
    count: jest.fn(),
};
