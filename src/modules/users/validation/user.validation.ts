import { NextFunction, Request, Response } from "express"
import Joi from "joi"
export const createUserValidation=(req: Request,res: Response, next: NextFunction)=>{
     const joiSchema=Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        phone: Joi.string().min(10).max(15).required(),
        email: Joi.string().email().min(5).max(30).required(),
        password: Joi.string().required(),
        referralCode: Joi.string().optional()
     })
     const {error}= joiSchema.validate(req.body);
     if(error){
         res.status(400).json({details: error.details,message:"validation failed"})
         return;
     }
     next()
}
export const signInValidation=(req: Request,res: Response, next: NextFunction)=>{
     const joiSchema=Joi.object({
        email: Joi.string().email().min(5).max(30).required(),
        password: Joi.string().required(),
        role: Joi.string().required().valid("USER","ADMIN")
     })
     const {error}= joiSchema.validate(req.body);
     if(error){
         res.status(400).json({details: error.details,message:"validation failed"})
         return;
     }
     next()
}