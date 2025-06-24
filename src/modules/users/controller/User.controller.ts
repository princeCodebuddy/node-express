import { Request, Response } from "express";
import { IUser, IUserController } from "../../../interface/UserInterface.js";
let users:Array<IUser>=[]
export default class UserController implements IUserController{
    async createUser(req: Request, res: Response): Promise<any> {
     try{
        const {name, username, email}=req.body as IUser;
        const newUser: IUser={
            id: users.length+1,
            name,
            username,
            email
        }
        users.push(newUser)
        return res.status(201).json({
            data:newUser,
            message:"User created successfully"
        })
     }catch(err:any){
        return res.status(201).json({message:err.message})
     }
    }
    async getUsers(_req: Request, res: Response): Promise<any> {
        try{
            return res.status(200).json({
                data: users,
                message:"User List fetched successfully"
            })
        }catch(err:any){
            return res.status(500).json({message:err.message})
        }
    }
    async getUser(req: Request, res: Response): Promise<any> {
        try{
            const user=users.filter(ele=>ele.id==parseInt(req.params.id))
            return res.status(200).json({
                data: user,
                message:"User details fetched successfully"
            })
        }catch(err:any){
           return res.status(500).json({message:err.message})  
        }
    }
}