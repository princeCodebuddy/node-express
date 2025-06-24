import { Request, Response } from "express"

export interface IHelloController{
    postHello(req:Request, res:Response):Promise<any>
    paramHello(req:Request,res:Response):Promise<any>
    helloWorld(req:Request,res:Response):Promise<any>
}