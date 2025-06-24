import { NextFunction, Request, Response } from "express"
import Joi from "joi"
export const createUserValidation=(req: Request,res: Response, next: NextFunction)=>{
     const joiSchema=Joi.object({
        name: Joi.string().min(3).max(100).required(),
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().min(5).max(30).required()
     })
     const {error}= joiSchema.validate(req.body);
     if(error){
         res.status(400).json({details: error.details,message:"validation failed"})
         return;
     }
     next()
}