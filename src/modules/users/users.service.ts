import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model'; 
import { InjectModel } from '@nestjs/sequelize';
import { genSalt, hash } from 'bcryptjs';
import { PaginationDto } from './dto/pagination.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { Op } from 'sequelize';
import { ResponseData, ResponsePagination } from '../../core/interfaces/response-data';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseData> {

    const { password, rePassword, username, email, active, isStaff, isSuperuser } = createUserDto;

    if(password !== rePassword) throw new BadRequestException("Las contraseñas no coinciden");

    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    try {
      await this.userModel.create({

        username,
        email,
        password: passwordHash,
        active,
        isStaff,
        isSuperuser
      });
      
      return { message: "Usuario creado con exito", statusCode: HttpStatus.CREATED }
    } catch (error) {

      if (error.name === "SequelizeUniqueConstraintError") throw new ConflictException("El email o el username ya estan registrados");
      throw new InternalServerErrorException("Ocurrio un error interno en el servidor al crear un usuario");
    }
  }

  async findAll(paginationUserDto: PaginationDto): Promise<ResponsePagination> {

    const { page = 1, limit = 20, sortBy = 'idUser', order = 'asc' } = paginationUserDto;
    
    const offset = (page - 1) * limit;

    const users = await this.userModel.findAll<User>({
      attributes: {
        exclude: ["password"]
      },
      offset,
      limit,
      order: [[sortBy, order.toLocaleLowerCase()]]
    });

    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await this.userModel.count() / limit);

    return {
      statusCode: HttpStatus.OK,
      data: users,
      count: users.length,
      currentPage,
      totalPages
    };
  }

  async findOne(id: number): Promise<User> {

    const user = await this.userModel.findOne<User>({
      where: {
        idUser: id
      },
      attributes: {
        exclude: ["password"]
      }
    });

    if(!user) throw new NotFoundException("Usuario no encontrado");

    return user;
  }

  async searchUser(searchUserDto: SearchUserDto): Promise<User[]> {

    const { username="", email="" } = searchUserDto;

    const users = await this.userModel.findAll<User>({
      where: {
        username: { [Op.iLike]: `%${username}%` },
        email: { [Op.iLike]: `%${email}%` } 
      },
      attributes: {
        exclude: ["password"]
      }
    });

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseData> {

    const { username, email, active, isStaff, isSuperuser } = updateUserDto;

    let userUpdate: number;
    
    try {
      [userUpdate] = await this.userModel.update({
        username,
        email,
        active,
        isStaff,
        isSuperuser
      }, {
        where: {
          idUser: id
        }
      });

    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") throw new ConflictException("El email o el username ya estan registrados");
      throw new InternalServerErrorException("Ocurrio un error interno en el servidor al actualizar un usuario");
    }

    if(userUpdate === 0) throw new NotFoundException("Usuario no encontrado");

    return { message: "Usuario actualizado correctamente", statusCode: HttpStatus.OK }
  }

  async remove(id: number): Promise<ResponseData> {

    const userDelete = await this.userModel.destroy({
      where: {
        idUser: id
      }
    });

    if(userDelete === 0) throw new NotFoundException("Usuario no encontrado");

    return { message: "Usuario eliminado exitosamente", statusCode: HttpStatus.NO_CONTENT };
  }

  async userFindByEmail(email: string): Promise<User | null>{

    const user = await this.userModel.findOne({
      where: {
        email
      }
    });

    return user;
  }
}
