import {Request, Response, Router} from "express"
import UserController from "../modules/users/controller/User.controller.js";
import { createUserValidation } from "../modules/users/validation/user.validation.js";
const userRouter=Router();
const userController=new UserController()

userRouter.post('/create-user', createUserValidation,userController.createUser)
userRouter.get('/users/list',userController.getUsers)
userRouter.get('/user/:id',userController.getUser)
export default userRouter;