import { Roles } from "@core/enums/role.enum"
import { faker } from "@faker-js/faker"

export const mockUsers = [
    {
        idUser: faker.number.int(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        lastLogin: faker.date.anytime().toISOString(),
        active: faker.datatype.boolean(),
        role: Roles.USER,
        createAt: faker.date.anytime().toISOString(),
        updateAt: faker.date.anytime().toISOString(),
        deleteAt: null
    }
]

export const mockUserFailed = {

    username: 27372,
    email: "dsdfs",
    password: true,
    rePassword: "",
    active: "",
    role: "fsdffsd"
}

export const mockUpdateUserFailed = {
    username: 27372,
    email: "dsdfs",
    active: "",
    role: "ds"
}