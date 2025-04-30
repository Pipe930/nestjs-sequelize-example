import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from '@modules/users/users.service';
import { PasswordService } from '@core/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@modules/users/models/tokenJwt.model';
import { User } from '@modules/users/models/user.model';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(RefreshToken)
        private readonly refreshTokenModel: typeof RefreshToken,
        private readonly userService: UsersService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService

    ){}

    async singIn(signInDto: SignInDto){

        const { email, password } = signInDto;

        const user = await this.userService.userFindByEmail(email);

        if(!user) throw new BadRequestException("Usuario no encontrado con ese correo");

        const passwordValid = await this.passwordService.comparePassword(password, user.dataValues.password);

        if(!passwordValid) throw new BadRequestException("Credenciales invalidas");

        const { accessToken, refreshToken } = await this.generateTokenJWT(user);

        await user.update({
            lastLogin: new Date()
        }, {
            where:{
                idUser: user.idUser
            }
        });

        return { statusCode: HttpStatus.OK, message: "Usuario logeado con exito", accessToken, refreshToken }
    }

    async logout(id: number){

        const refreshToken = await this.refreshTokenModel.findOne({
            where: {
                idRefreshToken: id
            }
        })

        if(!refreshToken) throw new NotFoundException("Session no encontrada");

        await refreshToken.destroy();

        return { message: "Session del usuaio cerrada con exito", statusCode: HttpStatus.OK }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {

        const refreshTokenFind = await this.refreshTokenModel.findOne({
            where: {
                token: refreshTokenDto.refreshToken
            }
        })

        if(!refreshTokenFind) throw new NotFoundException("refresh token no encontrado");

        const user = await this.userService.userFindById(refreshTokenFind.dataValues.idRefreshToken);

        const { accessToken, refreshToken } = await this.generateTokenJWT(user);

        return {
            accessToken,
            refreshToken
        }
    }

    async userProfile(id: number){

        const user = await this.userService.userFindById(id);

        return {
            statusCode: HttpStatus.OK,
            data: user
        };
    }

    private async generateTokenJWT(user: User): Promise<any> {

        try {

            const payload = { userId: user.dataValues.idUser, username: user.dataValues.username };
            const accessToken = await this.jwtService.signAsync(payload);
            const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: "1d" });

            await this.storeRefreshToken(refreshToken, user.dataValues.idUser);

            return {
                accessToken,
                refreshToken
            };
        } catch (error) {
            throw new BadRequestException("Error al generar el token");
        }
        
    }

    private async storeRefreshToken(refreshToken: string, idUser: number): Promise<void> {

        const refreshTokenExists = await this.refreshTokenModel.findByPk(idUser);

        if(refreshTokenExists) await refreshTokenExists.destroy();

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        await this.refreshTokenModel.create({
            token: refreshToken,
            expiryDate,
            idRefreshToken: idUser
        })
        
    }
}
