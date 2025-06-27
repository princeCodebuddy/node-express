import { Router } from "express";
import HelloController from "../modules/hello/controller/Hello.controller";
import { postHelloValidation } from "../modules/hello/validation/hello.validation";
const helloRouter=Router();
const helloController=new HelloController()

helloRouter.get('/hello',helloController.helloWorld)
helloRouter.post('/hello',postHelloValidation,helloController.postHello)
helloRouter.get('/hello/:username',helloController.paramHello)
export default helloRouter;