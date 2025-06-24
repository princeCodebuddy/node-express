import { Request, Response } from "express";

export interface IUserController{
    createUser(req:Request, res:Response):Promise<any>
    getUsers(req:Request,res:Response):Promise<any>
    getUser(req:Request,res:Response):Promise<any>
}
export interface IUser{
    id:number;
    name: string;
    username:string;
    email:string;
}