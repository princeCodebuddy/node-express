import { Request, Response } from "express";
import { IUserController, IUserService } from "../../../interface/UserInterface";
import { UserService } from "../services/User.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
export default class UserController implements IUserController {
    private readonly userService = new UserService();
    async signup(req: Request, res: Response): Promise<any> {
        try {
            const userInfo = await this.userService.signup(req.body)
            return res.status(userInfo.code).json({
                data: userInfo.data,
                message: userInfo.message
            })
        } catch (err:any) {
            return res.status(500).json({ message: err.message })
        }
    }
}