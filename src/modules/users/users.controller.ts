import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { StringTrimPipe } from '@core/pipes/string-trim.pipe';
import { AuthenticationGuard } from '@core/guards/authentication.guard';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import { Permission } from '@core/decorators/permission.decorator';
import { Roles } from '@core/enums/role.enum';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCookieAuth()
  @Post()
  @Permission([Roles.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  create(@Body(new StringTrimPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiCookieAuth()
  @Get()
  @Permission([Roles.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findAll(@Query() paginationUserDto: PaginationDto) {
    return this.usersService.findAll(paginationUserDto);
  }

  @ApiCookieAuth()
  @Get('search')
  @Permission([Roles.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  search(@Query() searchUserDto: SearchUserDto) {
    return this.usersService.searchUser(searchUserDto);
  }

  @ApiCookieAuth()
  @Get(':id')
  @Permission([Roles.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiCookieAuth()
  @Put(':id')
  @Permission([Roles.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body(new StringTrimPipe()) updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiCookieAuth()
  @Delete(':id')
  @Permission([Roles.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
