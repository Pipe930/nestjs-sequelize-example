import { faker } from "@faker-js/faker";
import { PaginationDto } from "../dto/pagination.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { SearchUserDto } from "../dto/search-user.dto";


const passwordUserTest = faker.internet.password();
export const idUser = faker.number.int();

export const paginationObjectTest: PaginationDto = {

    page: faker.number.int({ min: 1, max: 100 }),
    limit: faker.number.int({ min: 1, max: 100 }),
    sortBy: "email",
    order: "desc" as "asc" | "desc"
}

export const searchObjectTest: SearchUserDto = {
    username: faker.internet.username(),
    email: faker.internet.email(),
}

export const userObjectTest: CreateUserDto = {

    username: faker.internet.username(),
    email: faker.internet.email(),
    password: passwordUserTest,
    rePassword: passwordUserTest,
    active: faker.datatype.boolean(),
    isStaff: faker.datatype.boolean(),
    isSuperuser: faker.datatype.boolean(),
}

export const userObjectTestUpdate: UpdateUserDto = {
    username: faker.internet.username(),
    email: faker.internet.email(),
    active: faker.datatype.boolean(),
    isStaff: faker.datatype.boolean(),
    isSuperuser: faker.datatype.boolean(),
}

export const mockUsersService = {
    create: jest.fn(dto => {
        return {
            id: Date.now(),
            ...dto
        }
    }),
    update: jest.fn().mockImplementation((id, dto) => ({
        id,
        ...dto
    })),
    findAll: jest.fn().mockResolvedValue([userObjectTest]),
    findOne: jest.fn().mockResolvedValue(userObjectTest),
    searchUser: jest.fn().mockResolvedValue([userObjectTest]),
    remove: jest.fn().mockImplementation(id => ({ message: `User ${id} removed` }))
}


export const mockUserModel = {
    create: jest.fn().mockImplementation(dto => dto),
    update: jest.fn().mockReturnValue([1]),
    findAll: jest.fn().mockResolvedValue([userObjectTest]),
    findOne: jest.fn().mockResolvedValue(userObjectTest),
    destroy: jest.fn().mockResolvedValue(1),
    count: jest.fn()
}