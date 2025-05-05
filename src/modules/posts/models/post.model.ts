import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "@modules/users/models/user.model";

@Table({
    tableName: "posts",
    modelName: "Post"
})
export class Post extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.BIGINT,
        field: "id_post"
    })
    declare idPost: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare title: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    declare subtitle: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare slug: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare content: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare likes: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare dislikes: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare published: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare views: number;

    @CreatedAt
    @Column({ field: "created_at" })
    declarecreatedAt: Date;

    @UpdatedAt
    @Column({ field: "updated_at" })
    declare updatedAt: Date;

    @DeletedAt
    @Column({ field: "delete_at" })
    declare deletedAt: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: "id_user"
    })
    declare idUser: number;

    @BelongsTo(() => User)
    declare user: User;
}
