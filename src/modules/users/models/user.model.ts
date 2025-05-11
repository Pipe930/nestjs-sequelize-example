import { Column, CreatedAt, DataType, DeletedAt, HasOne, Model, Table, UpdatedAt } from "sequelize-typescript";
import { RefreshToken } from "./tokenJwt.model";
import { Roles } from "@core/enums/role.enum";

@Table({
    tableName: "users",
    modelName: "User"
})
export class User extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.BIGINT,
        field: "id_user"
    })
    declare idUser: number;

    @Column({
        type: DataType.STRING(60),
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 60]
        }
    })
    declare username: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [4, 255]
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING(128),
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        validate: {
            isDate: true
        },
        field: "last_login"
    })
    declare lastLogin: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare active: boolean;

    @Column({
        type: DataType.ENUM(...Object.values(Roles)),
        allowNull: false,
        defaultValue: Roles.USER
    })
    declare role: Roles;

    @CreatedAt
    @Column({ field: "created_at" })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: "updated_at" })
    declare updatedAt: Date;

    @DeletedAt
    @Column({ field: "deleted_at" })
    declare deletedAt: Date;

    @HasOne(() => RefreshToken)
    declare refreshToken: RefreshToken;
}