import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UsersModule } from '@modules/users/users.module';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '@modules/users/models/user.model';
import { userTest, userTestUpdate } from '../units/users/mock.users';
import { mockUpdateUserFailed, mockUserFailed, mockUsers } from './test-data';

describe('UsersController (e2e)', () => {
    let app: INestApplication<App>;

    const mockUserModel = {
        findAll: jest.fn().mockResolvedValue(mockUsers),
        create: jest.fn().mockImplementation(dto => dto),
        findOne: jest.fn().mockResolvedValue([mockUsers]),
        update: jest.fn().mockReturnValue([1]),
        destroy: jest.fn().mockResolvedValue(1),
        count: jest.fn().mockResolvedValue(mockUsers.length)
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [UsersModule],
        })
        .overrideProvider(getModelToken(User))
        .useValue(mockUserModel)
        .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())
        await app.init();

        jest.clearAllMocks();
    });

    it('/users (GET)', () => {
        return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .then(response => {

            expect(response.body).toEqual({
                statusCode: HttpStatus.OK,
                data: mockUsers,
                count: expect.any(Number),
                totalPages: expect.any(Number),
                currentPage: expect.any(Number)
            })
        });
    });

    it('/users (POST)', () => {
        return request(app.getHttpServer())
        .post('/users')
        .send(userTest)
        .expect(HttpStatus.CREATED)
        .expect('Content-Type', /json/)
        .then(response => {

            expect(response.body).toEqual({
                message: expect.any(String),
                statusCode: HttpStatus.CREATED
            })
        });
    });

    it('/users (POST) bad request exception', () => {
        return request(app.getHttpServer())
        .post('/users')
        .send(mockUserFailed)
        .expect(HttpStatus.BAD_REQUEST)
        .expect('Content-Type', /json/)
    });

    it('/users/:id (GET)', () => {
        return request(app.getHttpServer())
        .get('/users/1')
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect([mockUsers]);
    });

    it("/users/search (GET)", () => {
        return request(app.getHttpServer())
        .get('/users/search?username=test')
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect(mockUsers)
    })

    it('/users/:id (PUT)', () => {
        return request(app.getHttpServer())
        .put('/users/1')
        .send(userTestUpdate)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .then(response => {

            expect(response.body).toEqual({
                message: expect.any(String),
                statusCode: HttpStatus.OK
            })
        })
    });

    it('/users/:id (PUT) bad request exception', () => {
        return request(app.getHttpServer())
        .put('/users/1')
        .send(mockUpdateUserFailed)
        .expect(HttpStatus.BAD_REQUEST)
        .expect('Content-Type', /json/)
    });

    it('/users/:id (DELETE)', () => {
        return request(app.getHttpServer())
        .delete('/users/1')
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .then(response => {

            expect(response.body).toEqual({
                message: expect.any(String),
                statusCode: HttpStatus.NO_CONTENT
            })
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
