import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { StringTrimPipe } from '../../core/pipes/string-trim.pipe';
import { PaginationDto } from '../users/dto/pagination.dto';
import { SearchPostDto } from './dto/search-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body(new StringTrimPipe()) createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Get('search')
  search(@Query() searchPostDto: SearchPostDto) {
    return this.postsService.searchPost(searchPostDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new StringTrimPipe()) updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
