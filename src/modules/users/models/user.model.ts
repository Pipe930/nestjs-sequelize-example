import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "users",
    modelName: "User",
    timestamps: true,
    paranoid: true
})
export class User extends Model<User> {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
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
}

export const usersProviders = [{ provide: 'UsersRepository', useValue: User }];