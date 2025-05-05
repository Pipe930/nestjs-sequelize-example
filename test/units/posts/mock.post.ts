import { faker } from '@faker-js/faker';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { PaginationDto } from '@modules/users/dto/pagination.dto';
import { User } from '@modules/users/models/user.model';

export const idPost = faker.number.int();

export const postTest: CreatePostDto = {
    title: faker.lorem.words(),
    subtitle: faker.lorem.sentence(),
    content: faker.lorem.text(),
    likes: faker.number.int(),
    dislikes: faker.number.int(),
    published: faker.datatype.boolean(),
    views: faker.number.int(),
    idUser: faker.number.int(),
};

export const mockPostService = {
    create: jest.fn().mockImplementation((dto) => dto),
    findAll: jest.fn().mockResolvedValue([postTest]),
    findOne: jest.fn().mockResolvedValue(postTest),
    update: jest.fn().mockImplementation((id, dto) => ({ id, ...dto })),
    remove: jest.fn().mockImplementation((id) => ({ message: `User ${id} removed` })),
    searchPost: jest.fn().mockResolvedValue([postTest]),
};

export const mockPostModel = {
    create: jest.fn().mockImplementation((dto) => dto),
    findAll: jest.fn().mockResolvedValue([postTest]),
    findOne: jest.fn().mockResolvedValue(postTest),
    update: jest.fn().mockReturnValue([1]),
    destroy: jest.fn().mockResolvedValue(1),
    count: jest.fn(),
};

export const paginationTest: PaginationDto = {
    page: faker.number.int({ min: 1, max: 100 }),
    limit: faker.number.int({ min: 1, max: 100 }),
    sortBy: 'email',
    order: 'desc' as 'asc' | 'desc',
};

export const configModel = {
    include: {
        model: User,
        attributes: ['idUser', 'username', 'email'],
    },
    attributes: {
        exclude: ['idUser'],
    },
};
