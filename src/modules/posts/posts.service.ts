import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { User } from '../users/models/user.model';
import { PaginationDto } from '../users/dto/pagination.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { Op } from 'sequelize';
import { ResponseData, ResponsePagination } from '@core/interfaces/response-data';

@Injectable()
export class PostsService {

  private readonly configModel = {
    include: {
      model: User,
      attributes: ['idUser', 'username', 'email']
    },
    attributes: {
      exclude: ['idUser']
    }
  }

  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post
  ){}

  async create(createPostDto: CreatePostDto): Promise<ResponseData> {

    const { title, subtitle, content, published, views, likes, dislikes, idUser } = createPostDto;

    const slug = this.generateSlug(title);

    try {

      await this.postModel.create({
        title,
        subtitle,
        content,
        slug,
        published,
        views,
        likes,
        dislikes,
        idUser
      })

      return {
        message: "Post creado correctamente",
        statusCode: HttpStatus.CREATED
      }
      
    } catch (error) {
      
      if (error.name === "SequelizeUniqueConstraintError") throw new ConflictException("El titulo del post ya estan registrados");
      if(error.name === "SequelizeValidationError") throw new BadRequestException("El usuario no existe");
      throw new InternalServerErrorException("Ocurrio un error interno en el servidor al crear un post");
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponsePagination> {

    const { page = 1, limit = 20, sortBy = 'idPost', order = 'asc' } = paginationDto;

    const offset = (page - 1) * limit;

    const posts = await this.postModel.findAll<Post>({
      ...this.configModel,
      order: [[sortBy, order]],
      offset,
      limit
    });

    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await this.postModel.count() / limit);

    return {
      statusCode: HttpStatus.OK,
      data: posts,
      count: posts.length,
      currentPage,
      totalPages
    }
  }

  async findOne(id: number): Promise<Post> {

    const post = await this.postModel.findOne({
      where: {
        idPost: id
      },
      ...this.configModel
    })

    if (!post) throw new NotFoundException("Post no encontrado");

    return post;
  }

  async searchPost(searchPostDto: SearchPostDto): Promise<Post[]> {

    const { title="", subtitle="" } = searchPostDto;

    const posts = await this.postModel.findAll({
      where: {
        title: { [Op.iLike]: `%${title}%` },
        subtitle: { [Op.iLike]: `%${subtitle}%` } 
      },
      ...this.configModel
    })

    return posts;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<ResponseData> {

    const { title, subtitle, content, published, views, likes, dislikes, idUser } = updatePostDto;

    let updatedPost: number;

    try {

      [updatedPost] = await this.postModel.update({
        title,
        subtitle,
        content,
        published,
        slug: this.generateSlug(title),
        views,
        likes,
        dislikes,
        idUser
      }, {
        where: {
          idPost: id
        }
      })

      
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") throw new ConflictException("El titulo del post ya estan registrados");
      if(error.name === "SequelizeValidationError") throw new BadRequestException("El usuario no existe");
      throw new InternalServerErrorException("Ocurrio un error interno en el servidor al actualizar un post");
    }

    if (updatedPost === 0) throw new NotFoundException("Post no encontrado");

    return {
      message: "Post actualizado correctamente",
      statusCode: HttpStatus.OK
    }
  }

  async remove(id: number): Promise<ResponseData> {

    const deletePost = await this.postModel.destroy({
      where: {
        idPost: id
      }
    })

    if (deletePost === 0) throw new NotFoundException("Post no encontrado");

    return {
      message: "Post eliminado correctamente",
      statusCode: HttpStatus.NO_CONTENT
    }
  }

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/ /g, '-');
  }
}
