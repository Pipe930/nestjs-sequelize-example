import { Post } from "@modules/posts/models/post.model";
import { PostsModule } from "@modules/posts/posts.module";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import { TestingModule, Test } from "@nestjs/testing";
import { App } from "supertest/types";
import * as request from 'supertest';
import { mockPost } from "./test-data";
import { postTest } from "../units/posts/mock.post";

describe("PostController (e2e)", () => {

    let app: INestApplication<App>;

    const mockPostModel =  {
        findAll: jest.fn().mockResolvedValue(mockPost),
        count: jest.fn().mockReturnValue(mockPost.length),
        create: jest.fn().mockImplementation(dto => dto),
        findOne: jest.fn().mockResolvedValue([mockPost]),
        update: jest.fn().mockResolvedValue([1]),
        destroy: jest.fn().mockResolvedValue(1)
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PostsModule]
        })
        .overrideProvider(getModelToken(Post))
        .useValue(mockPostModel)
        .compile()

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())
        await app.init();

        jest.clearAllMocks();
    });

    it("/posts (GET)", async () => {

        const reponse = await request(app.getHttpServer())
            .get("/posts")
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/)

        expect(reponse.body).toEqual({
            statusCode: HttpStatus.OK,
            data: mockPost,
            count: expect.any(Number),
            currentPage: expect.any(Number),
            totalPages: expect.any(Number)
        })
    });

    it("/posts/search (GET)", () => {

        return request(app.getHttpServer())
            .get("/posts/search?title=test")
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/)
            .expect(mockPost)
    });

    it("/posts (POST)", async () => {

        const response = await request(app.getHttpServer())
            .post("/posts")
            .send(postTest)
            .expect(HttpStatus.CREATED)
            .expect('Content-Type', /json/);

        expect(response.body).toEqual({
            statusCode: HttpStatus.CREATED,
            message: expect.any(String)
        })
    });

    
    it("/posts/:id (GET)", () => {

        return request(app.getHttpServer())
        .get("/posts/1")
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect([mockPost])
    })

    it("/posts/:id (PUT)", async () => {

        const response = await request(app.getHttpServer())
            .put("/posts/1")
            .send(postTest)
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/)
        
        expect(response.body).toEqual({
            statusCode: HttpStatus.OK,
            message: expect.any(String)
        })
    });

    it("/posts/:id (DELETE)", async () => {
        const response = await request(app.getHttpServer())
            .delete("/posts/1")
            .expect(HttpStatus.OK)
            .expect('Content-Type', /json/)
        
        expect(response.body).toEqual({
            message: expect.any(String),
            statusCode: HttpStatus.NO_CONTENT
        })
    })
});