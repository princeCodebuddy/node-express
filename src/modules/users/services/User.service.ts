import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import { PrismaClient } from "../../../../generated/prisma";
import { IResponse } from "../../../helper/responseHandler";
import { IUserService } from "../../../interface/UserInterface";
import * as argon2 from "argon2";
export class UserService implements IUserService {
    async signup(body: any): Promise<IResponse> {
        try {
            const prisma = new PrismaClient()
            if (body.referralCode && body.referralCode != "") {
                const checkUser = await prisma.user.findFirst({ where: { assignedReferralCode: body.referralCode } });
                if (!checkUser) return { code: 400, message: "Invalid referral code", success: false }
                body.usedReferralCode = body.referralCode
            }
            body.password = await argon2.hash(body.password, { hashLength: 50 });
            body.role = 'USER';
            body.email = body.email.toLowerCase();
            body.assignedReferralCode = `${body.email}:${body.phone}`;
            const data = await prisma.user.create({ data: body })
            if (!data) return { code: 400, message: "Something went wrong", success: false }
            return { code: 201, message: "User created successfully", success: true, data: data }
        } catch (err: any) {
            if (err.code === 'P2002') {
                const target = err.meta?.target as string[];
                return {
                    success: false,
                    code: 400,
                    message: `Duplicate entry for field: ${target}`,
                };
            }
            throw err;
        }
    }
}