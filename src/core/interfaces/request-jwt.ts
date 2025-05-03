import { Request } from "express";

export interface RequestJwt extends Request {

    user: {
        userId: number;
        username: string;
    }
}