import { Request, Response } from "express";
import { IHelloController } from "../../../interface/HelloInterface.js";
export default class HelloController implements IHelloController {
    async postHello(req: Request, res: Response): Promise<any> {
        try {
            return res.status(200).json({
                data: `Hello ${req.body.username}`
            })
        } catch (err: any) {
            return res.status(201).json({ message: err.message })
        }
    }
    async paramHello(req: Request, res: Response): Promise<any> {
        try {
            return res.status(200).json({
                data: `Hello ${req.params.username}`
            })
        } catch (err: any) {
            return res.status(201).json({ message: err.message })
        }
    }
    async helloWorld(_req: Request, res: Response): Promise<any> {
        try {
            return res.status(200).json({
                data: `Hello World`
            })
        } catch (err: any) {
            return res.status(201).json({ message: err.message })
        }
    }
}