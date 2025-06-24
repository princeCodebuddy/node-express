import { Router } from "express";
import HelloController from "../modules/hello/controller/Hello.controller.js";
import { postHelloValidation } from "../modules/hello/validation/hello.validation.js";
const helloRouter=Router();
const helloController=new HelloController()

helloRouter.get('/hello',helloController.helloWorld)
helloRouter.post('/hello',postHelloValidation,helloController.postHello)
helloRouter.get('/hello/:username',helloController.paramHello)
export default helloRouter;