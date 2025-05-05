import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '@modules/posts/posts.controller';
import { PostsService } from '@modules/posts/posts.service';
import { idPost, mockPostService, paginationTest, postTest } from './mock.post';

describe("PostsController", () => {
    let controller: PostsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [PostsService],
        })
        .overrideProvider(PostsService)
        .useValue(mockPostService)
        .compile();

        controller = module.get<PostsController>(PostsController);

        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should create a post", async () => {
        expect(await controller.create(postTest)).toEqual(postTest);

        expect(mockPostService.create).toHaveBeenCalledWith(postTest);
    });

    it("should find all posts", async () => {

        expect(await controller.findAll(paginationTest)).toEqual([postTest]);

        expect(mockPostService.findAll).toHaveBeenCalledWith(paginationTest);
    });

    it("should find one post", async () => {

        expect(await controller.findOne(idPost)).toEqual(postTest);

        expect(mockPostService.findOne).toHaveBeenCalledWith(idPost);
    });

    it("should update a post", async () => {

        expect(await controller.update(idPost, postTest)).toEqual({id: idPost, ...postTest});

        expect(mockPostService.update).toHaveBeenCalledWith(idPost, postTest);
    });

    it("should remove a post", async () => {

        expect(await controller.remove(idPost)).toEqual({ message: `User ${idPost} removed` });

        expect(mockPostService.remove).toHaveBeenCalledWith(idPost);
    });
    
    
});
