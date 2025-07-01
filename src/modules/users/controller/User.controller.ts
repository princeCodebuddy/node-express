import { Request, Response } from "express";
import { IUserController, IUserService } from "../../../interface/UserInterface";
import { UserService } from "../services/User.service";
export default class UserController implements IUserController {
    private readonly userService = new UserService();
    async signup(req: Request, res: Response): Promise<any> {
        try {
            const userInfo = await this.userService.signup(req.body)
            return res.status(userInfo.code).json({
                data: userInfo.data,
                message: userInfo.message
            })
        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }
    async signIn(req: Request, res: Response): Promise<any> {
        try {
            const userInfo = await this.userService.signIn(req.body)
            return res.status(userInfo.code).json({
                data: userInfo.data,
                message: userInfo.message
            })
        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }
     async verifyEmail(req: Request, res: Response): Promise<any> {
        try {
            const userInfo = await this.userService.verifyEmail(req.query.key as string)
            return res.status(userInfo.code).json({
                data: userInfo.data,
                message: userInfo.message
            })
        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }
}