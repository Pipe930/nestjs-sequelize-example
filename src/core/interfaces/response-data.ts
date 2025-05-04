import { Model } from "sequelize-typescript";

export interface ResponseData {

    statusCode: number;
    message: string;
}

export interface ResponsePagination {

    statusCode: number;
    totalPages: number;
    currentPage: number;
    count: number;
    data: Array<Model>;
}
