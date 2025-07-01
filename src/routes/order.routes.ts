import {Request, Response, Router} from "express"
import OrderController from "../modules/orders/controllers/Order.controller";
import multer from "multer"
import { existsSync, mkdirSync } from "fs";
import { orderListValidation, placeOrderValidation, updateValidation } from "../modules/orders/validation/order.validation";
const orderRouter=Router();
const orderController=new OrderController()

const storage = multer.diskStorage({
    destination: function (_req:Request, _file, callback) {
      if (!existsSync('./public/orders')) {
        mkdirSync('./public/orders');
      }
  
      callback(null, "./public/orders")
    },
    filename: function (_req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
  });
  const uploadFile = multer({
    storage: storage
  })
orderRouter.use('/order', global.auth.authenticateAPI)
orderRouter.post('/order/place',uploadFile.single('fileName'),placeOrderValidation,(req,res)=>orderController.placeOrder(req,res))
orderRouter.post('/order/list',orderListValidation,(req,res)=>orderController.orderList(req,res))
orderRouter.patch('/order/update-status',updateValidation,(req,res)=>orderController.updateOrder(req,res))
export default orderRouter;