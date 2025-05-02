import { faker } from "@faker-js/faker"

export const mockUsers = [
    {
        idUser: faker.number.int(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        lastLogin: faker.date.anytime().toISOString(),
        active: faker.datatype.boolean(),
        isStaff: faker.datatype.boolean(),
        isSuperuser: faker.datatype.boolean(),
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
    isStaff: 12312,
    isSuperuser: "dfs",
}