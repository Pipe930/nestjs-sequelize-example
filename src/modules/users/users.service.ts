import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model'; 
import { InjectModel } from '@nestjs/sequelize';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async create(createUserDto: CreateUserDto) {

    const { username, email, password, rePassword, active, isStaff, isSuperuser } = createUserDto;

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

  async findAll(): Promise<User[]> {

    const users = await this.userModel.findAll<User>({
      attributes: {
        exclude: ["password"]
      }
    });

    return users;
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

  async update(id: number, updateUserDto: UpdateUserDto) {

    let userUpdate: number;

    try {
      [userUpdate] = await this.userModel.update(updateUserDto, {
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

  async remove(id: number) {

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
