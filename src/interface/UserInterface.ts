import { Request, Response } from "express";
import { IResponse } from "./responseHandler";

export interface IUserController{
    signup(req:Request, res:Response):Promise<any>
    signIn(req:Request, res:Response):Promise<any>
}
export interface IUserService{
    signup(body:any):Promise<IResponse>
    signIn(body:any):Promise<IResponse>
}
export interface IUser{
    id:number;
    name: string;
    username:string;
    email:string;
}