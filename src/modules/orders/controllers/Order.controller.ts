import { Request, Response } from "express";
import { IOrderController } from "../../../interface/OrderInterface";
import OrderService from "../services/Order.service";

export default class OrderController implements IOrderController {
    private readonly orderService = new OrderService()
    /**
     * //@Method: placeOrder
     * //@Description: To place order with respect to user
     */
    async placeOrder(req: Request | any, res: Response): Promise<any> {
        try {
            const orderInfo = await this.orderService.createOrder(req.body, req.files, req.user)
            return res.status(orderInfo.code).send({
                data: orderInfo.data,
                message: orderInfo.message
            })
        } catch (err: any) {
            return res.status(500).send({ message: err.message })
        }
    }
    /**
  * //@Method: orderList
  * //@Description: To place order list
  */
    async orderList(req: Request | any, res: Response): Promise<any> {
        try {
            if (req.user.role != "ADMIN") return res.status(403).send({ message: "You are not authorized" })
            const orderInfo = await this.orderService.orderList(req.body)
            return res.status(orderInfo.code).send({
                data: orderInfo.data,
                message: orderInfo.message
            })
        } catch (err: any) {
            return res.status(500).send({ message: err.message })
        }
    }
    async updateOrder(req: Request | any, res: Response): Promise<any> {
        try {
            if (req.user.role != "ADMIN") return res.status(403).send({ message: "You are not authorized" })
            const updateInfo = await this.orderService.updateStatus(req.body);
            return res.status(updateInfo.code).send({
                message: updateInfo.message,
                data: updateInfo.data
            })
        } catch (err: any) {
            return res.status(500).send({ message: err.message })
        }
    }
}