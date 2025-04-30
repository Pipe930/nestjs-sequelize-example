import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { PasswordService } from '@core/services/password.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly passwordService: PasswordService
  ) {}

  async create(createUserDto: CreateUserDto) {

    const { username, email, password, rePassword, active, isStaff, isSuperuser } = createUserDto;

    if(password !== rePassword) throw new BadRequestException("Las contraseñas no coinciden");

    const passwordHash = await this.passwordService.passwordHash(password);

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

  async findAll() {

    const users = await this.userModel.findAll<User>();

    if(users.length === 0) return { message: "No tenemos usuarios registrados", statusCode: HttpStatus.OK }

    return users;
  }

  async findOne(id: number) {
    
    const user = await this.userFindById(id);

    return {
      message: HttpStatus.OK,
      data: user
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const user = await this.userFindById(id);

    try {

      await user.update(updateUserDto, {
        where: {
          idUser: id
        }
      });

      return { message: "Usuario actualizado correctamente", statusCode: HttpStatus.OK }
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") throw new ConflictException("El email o el username ya estan registrados");
      throw new InternalServerErrorException("Ocurrio un error interno en el servidor al actualizar un usuario");
    }
  }

  async remove(id: number) {

    const user = await this.userFindById(id);

    await user.destroy();

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

  async userFindById(id: number): Promise<User>{

    const user = await this.userModel.findByPk<User>(id);

    if(!user) throw new NotFoundException("Usuario no encontrado");

    return user;
  }
}
