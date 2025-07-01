import {Request, Response, Router} from "express"
import UserController from "../modules/users/controller/User.controller";
import { createUserValidation, signInValidation } from "../modules/users/validation/user.validation";
const userRouter=Router();
const userController=new UserController()

userRouter.post('/user/signup', createUserValidation,(req,res)=>userController.signup(req,res))
userRouter.post('/user/signIn', signInValidation,(req,res)=>userController.signIn(req,res))
// userRouter.use('/user', global.auth.authenticateAPI)
userRouter.get('/user/verify-email',(req,res)=>userController.verifyEmail(req,res))
export default userRouter;