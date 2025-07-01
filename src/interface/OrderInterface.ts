import { Request, Response } from "express";
import { IResponse } from "./responseHandler";

export interface IOrderService{
    createOrder(body:any, files:any, user:any):Promise<IResponse>
    orderList(body:any):Promise<IResponse>
    updateStatus(body:any):Promise<IResponse>
}
export interface IOrderController{
    placeOrder(req:Request, res:Response):Promise<any>
    orderList(req:Request, res:Response):Promise<any>
    updateOrder(req:Request, res:Response):Promise<any>
}