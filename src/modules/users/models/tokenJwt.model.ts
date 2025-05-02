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
    idRefreshToken: number;

    @Column({
        type: DataType.STRING(300),
        allowNull: false,
        unique: true
    })
    token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "expiry_date"
    })
    expiryDate: Date;
}