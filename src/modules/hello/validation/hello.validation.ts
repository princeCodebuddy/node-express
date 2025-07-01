import { NextFunction, Request, Response } from "express"
import Joi from "joi"
export const postHelloValidation=(req: Request,res: Response, next: NextFunction)=>{
     const joiSchema=Joi.object({
        username: Joi.string().required()
     })
     const {error}= joiSchema.validate(req.body);
     if(error){
         res.status(400).json({message:"Username is required", details: error.details})
         return;
     }
     next()
}