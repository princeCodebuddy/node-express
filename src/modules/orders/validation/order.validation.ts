import { NextFunction, Request, Response } from "express"
import Joi from "joi"
export const placeOrderValidation=(req: Request,res: Response, next: NextFunction)=>{
     const joiSchema=Joi.object({
        jobLink: Joi.string().uri({scheme:['http','https']}).required(),
        orderType: Joi.string().valid("RESUME","COVER_LETTER")
     })
     const {error}= joiSchema.validate(req.body);
     if(error){
         res.status(400).json({details: error.details,message:"validation failed"})
         return;
     }
     next()
}
export const orderListValidation=(req: Request,res: Response, next: NextFunction)=>{
     const joiSchema=Joi.object({
        page: Joi.number().required(),
        pageSize: Joi.number().required(),
        search: Joi.string().optional(),
        status: Joi.string().valid("","PENDING","APPROVE","REJECT").optional()
     })
     const {error}= joiSchema.validate(req.body);
     if(error){
         res.status(400).json({details: error.details,message:"validation failed"})
         return;
     }
     next()
}
export const updateValidation=(req: Request,res: Response, next: NextFunction)=>{
     const joiSchema=Joi.object({
        orderId: Joi.string().required(),
        reason: Joi.string().optional(),
        status: Joi.string().valid("APPROVE","REJECT").required()
     })
     const {error}= joiSchema.validate(req.body);
     if(error){
         res.status(400).json({details: error.details,message:"validation failed"})
         return;
     }
     next()
}