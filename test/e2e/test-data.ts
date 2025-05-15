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

export const mockPost = [
    {
        idPost: faker.number.int(),
        title: faker.lorem.text(),
        subtitle: faker.lorem.text(),
        slug: faker.lorem.slug(),
        content: faker.lorem.sentences(),
        likes: faker.number.int({min: 1, max: 5000}),
        dislikes: faker.number.int({min: 1, max: 5000}),
        published: faker.datatype.boolean(),
        views: faker.number.int({min: 1, max: 100000}),
        createAt: faker.date.anytime().toISOString(),
        updateAt: faker.date.anytime().toISOString(),
        deleteAt: null
    }
]