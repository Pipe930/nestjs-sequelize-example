import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UsersModule } from '../src/modules/users/users.module';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../src/modules/users/models/user.model';
import { userObjectTest, userObjectTestUpdate } from '../src/modules/users/test/mock.users';
import { mockUserFailed, mockUsers } from './test-data';

describe('UsersController (e2e)', () => {
    let app: INestApplication<App>;

    const mockUserModel = {
        findAll: jest.fn().mockResolvedValue(mockUsers),
        create: jest.fn().mockImplementation(dto => dto),
        findOne: jest.fn().mockResolvedValue([mockUsers]),
        update: jest.fn().mockReturnValue([1]),
        destroy: jest.fn().mockResolvedValue(1)
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [UsersModule],
        })
        .overrideProvider(getModelToken(User))
        .useValue(mockUserModel)
        .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true
        }))
        await app.init();

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('/users (GET)', () => {
        return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect(mockUsers);
    });

    it('/users (POST)', () => {
        return request(app.getHttpServer())
        .post('/users')
        .send(userObjectTest)
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

    it('/users/:id (PUT)', () => {
        return request(app.getHttpServer())
        .put('/users/1')
        .send(userObjectTestUpdate)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .then(response => {

            expect(response.body).toEqual({
                message: expect.any(String),
                statusCode: HttpStatus.OK
            })
        })
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
