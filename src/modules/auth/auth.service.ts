import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../users/models/tokenJwt.model'; 
import { User } from '../users/models/user.model'; 
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(RefreshToken)
        private readonly refreshTokenModel: typeof RefreshToken,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService

    ){}

    async singIn(signInDto: SignInDto){

        const { email, password } = signInDto;

        const user = await this.userService.userFindByEmail(email);

        if(!user) throw new BadRequestException("Usuario no encontrado con ese correo");

        const passwordValid = await compare(password, user.password);

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
        
        const tokenDelete = await this.refreshTokenModel.destroy({
            where: {
                idRefreshToken: id
            }
        });
        
        if(tokenDelete === 0) throw new NotFoundException("Session no encontrada");

        return { message: "Session del usuaio cerrada con exito", statusCode: HttpStatus.OK }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {

        const refreshTokenFind = await this.refreshTokenModel.findOne({
            where: {
                token: refreshTokenDto.refreshToken
            }
        })

        if(!refreshTokenFind) throw new NotFoundException("refresh token no encontrado");

        const user = await this.userService.findOne(refreshTokenFind.idRefreshToken);

        const { accessToken, refreshToken } = await this.generateTokenJWT(user);

        return {
            accessToken,
            refreshToken
        }
    }

    async userProfile(id: number){

        const user = await this.userService.findOne(id);

        return {
            statusCode: HttpStatus.OK,
            data: user
        };
    }

    private async generateTokenJWT(user: User): Promise<any> {

        try {

            const payload = { userId: user.idUser, username: user.username };
            const accessToken = await this.jwtService.signAsync(payload);
            const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: "1d" });

            await this.storeRefreshToken(refreshToken, user.idUser);

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
