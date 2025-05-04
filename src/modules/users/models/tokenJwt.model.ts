import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({
    tableName: "refresh_token",
    modelName: "RefreshToken",
    timestamps: false
})
export class RefreshToken extends Model {

    @ForeignKey(() => User)
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
        field: "id_refresh_token"
    })
    declare idRefreshToken: number;

    @Column({
        type: DataType.STRING(300),
        allowNull: false,
        unique: true
    })
    declare token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "expiry_date"
    })
    declare expiryDate: Date;
}