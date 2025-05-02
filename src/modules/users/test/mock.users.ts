import { faker } from "@faker-js/faker";


const passwordUserTest = faker.internet.password();
export const idUser = faker.number.int();

export const userObjectTest = {

    username: faker.internet.username(),
    email: faker.internet.email(),
    password: passwordUserTest,
    rePassword: passwordUserTest,
    active: faker.datatype.boolean(),
    isStaff: faker.datatype.boolean(),
    isSuperuser: faker.datatype.boolean(),
}

export const userObjectTestUpdate = {
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
    remove: jest.fn().mockImplementation(id => ({ message: `User ${id} removed` }))
}


export const mockUserModel = {
    create: jest.fn().mockImplementation(dto => dto),
    update: jest.fn().mockReturnValue([1]),
    findAll: jest.fn().mockResolvedValue([userObjectTest]),
    findOne: jest.fn().mockResolvedValue(userObjectTest),
    destroy: jest.fn().mockResolvedValue(1)
}