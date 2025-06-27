import { Request, Response } from "express";
import { IUser, IUserController } from "../../../interface/UserInterface";
import { PrismaClient } from "../../../../generated/prisma/index";
let users:Array<IUser>=[]
export default class UserController implements IUserController{
    async createUser(req: Request, res: Response): Promise<any> {
     try{
        const {name, username, email}=req.body as IUser;
        const prisma=new PrismaClient()
         const data=await prisma.user.create({data:{email: email, name:name}})
         if(!data)return res.status(201).json({
            message:"Something went wrong"
        })
        return res.status(201).json({
            data:data,
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
            const prisma=new PrismaClient()
           const data=await prisma.user.findMany()
           console.log(data,'data');
           
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