import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { getModelToken } from '@nestjs/sequelize';
import { Post } from '../models/post.model';
import { configModel, idPost, mockPostModel, paginationTest, postTest } from './mock.post';
import { HttpStatus } from '@nestjs/common';
import { Op } from 'sequelize';

describe("PostsService", () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a post", async () => {

    expect(await service.create(postTest)).toEqual({
      message: expect.any(String),
      statusCode: HttpStatus.CREATED,
    });

    expect(mockPostModel.create).toHaveBeenCalledWith({
      ...postTest,
      slug: expect.any(String),
    });
    expect(mockPostModel.create).toHaveBeenCalledTimes(1);
  });

  it("should find all posts", async () => {

    expect(await service.findAll(paginationTest)).toEqual({
      statusCode: HttpStatus.OK,
      data: [postTest],
      totalPages: expect.any(Number),
      currentPage: expect.any(Number),
      count: expect.any(Number),
    });
    
    expect(mockPostModel.findAll).toHaveBeenCalledTimes(1);
    expect(mockPostModel.findAll).toHaveBeenCalledWith({
      offset: expect.any(Number),
      limit: expect.any(Number),
      order: [[expect.any(String), expect.any(String)]],
      ...configModel
    });
  });

  it("should find one post", async () => {

    expect(await service.findOne(idPost)).toEqual(postTest);

    expect(mockPostModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockPostModel.findOne).toHaveBeenCalledWith({
      where: { idPost },
      ...configModel
    });
  });

  it("should search a post", async () => {

    expect(await service.searchPost(postTest)).toEqual([postTest]);

    expect(mockPostModel.findAll).toHaveBeenCalledTimes(1);
    expect(mockPostModel.findAll).toHaveBeenCalledWith({
      where: {
        title: { [Op.iLike]: `%${postTest.title}%` },
        subtitle: { [Op.iLike]: `%${postTest.subtitle}%` }
      },
      ...configModel
    });

  })

  it("should update a post", async () => {

    expect(await service.update(idPost, postTest)).toEqual({
      message: expect.any(String),
      statusCode: HttpStatus.OK,
    });

    expect(mockPostModel.update).toHaveBeenCalledTimes(1);
    expect(mockPostModel.update).toHaveBeenCalledWith({
      ...postTest,
      slug: expect.any(String),
    }, {
      where: { idPost }
    });
  });

  it("should remove a post", async () => {

    expect(await service.remove(idPost)).toEqual({
      message: expect.any(String),
      statusCode: HttpStatus.NO_CONTENT,
    });

    expect(mockPostModel.destroy).toHaveBeenCalledTimes(1);
    expect(mockPostModel.destroy).toHaveBeenCalledWith({
      where: { idPost }
    });
  });
});
