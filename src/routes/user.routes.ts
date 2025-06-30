import {Request, Response, Router} from "express"
import UserController from "../modules/users/controller/User.controller";
import { createUserValidation } from "../modules/users/validation/user.validation";
const userRouter=Router();
const userController=new UserController()

userRouter.post('/user/signup', createUserValidation,(req,res)=>userController.signup(req,res))
export default userRouter;