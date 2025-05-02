import { Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { RefreshToken } from "./tokenJwt.model";

@Table({
    tableName: "users",
    modelName: "User",
    timestamps: true,
    paranoid: true
})
export class User extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.BIGINT,
        field: "id_user"
    })
    idUser: number;

    @Column({
        type: DataType.STRING(60),
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 60]
        }
    })
    username: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [4, 255]
        }
    })
    email: string;

    @Column({
        type: DataType.STRING(128),
        allowNull: false
    })
    password: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        validate: {
            isDate: true
        },
        field: "last_login"
    })
    lastLogin: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    active: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_staff"
    })
    isStaff: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_superuser"
    })
    isSuperuser: boolean;

    @HasOne(() => RefreshToken)
    refreshToken: RefreshToken;
}