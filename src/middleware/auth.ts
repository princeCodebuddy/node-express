import { Request,Response } from "express";
import { config } from "../config/config.js";
import passport from "passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { prisma } from "../helper/prismaClient.js";
const params = {
    secretOrKey: config.server.jwtSecret,
    jwtFromRequest: ExtractJwt.fromHeader('token')
};


const authMiddleware = () => {
    const strategy = new Strategy(params, (payload, done) => {
       prisma.user.findUnique({where:{id:payload.id}}).then(result => {  
                if (result) {
                    const {password, ...rest}=result
                    return done(null, rest);
                } else {
                    return done(null, false);
                }
            })
            .catch(error => {
                console.log(error);
                
                return done(error, false);
            });
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticateAPI: (req: Request, res: Response, next: any) => {
            passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
                if (err) {
                    return {
                        status: 401,
                        auth: false,
                        message: 'Failed to authenticate token.'
                    }
                }
                if (!user) {

                    return res.status(401).send({message:"There was a problem finding the user."})
                }else{
                    req.user = user;
                    return next();
                };

            })(req, res, next);
        }
    };
};
export default authMiddleware;