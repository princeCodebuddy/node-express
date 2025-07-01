import { PrismaClient } from "../../../../generated/prisma";
import { config } from "../../../config/config";
import { Mailer } from "../../../helper/Mailer";
import { prisma } from "../../../helper/prismaClient";
import { IResponse } from "../../../interface/responseHandler";
import { IUserService } from "../../../interface/UserInterface";
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
const { createCipheriv, createDecipheriv } = await import('node:crypto')
export class UserService implements IUserService {
    private readonly mailer = new Mailer()
    async signup(body: any): Promise<IResponse> {
        try {
            if (body.referralCode && body.referralCode != "") {
                const checkUser = await prisma.user.findFirst({ where: { assignedReferralCode: body.referralCode } });
                if (!checkUser) return { code: 400, message: "Invalid referral code", success: false }
                body.usedReferralCode = body.referralCode
            }
            body.password = await argon2.hash(body.password, { hashLength: 50 });
            body.role = 'USER';
            body.email = body.email.toLowerCase();
            body.assignedReferralCode = `${body.email}:${body.phone}`;
            const createUser = await prisma.user.create({ data: body })
            if (!createUser) return { code: 400, message: "Something went wrong", success: false }
            const key: Uint8Array = new Uint8Array(Buffer.from(config.cipher.key_phrase, 'utf-8')); // 32-bit key
            const iv: Uint8Array = new Uint8Array(Buffer.from(config.cipher.iv_phrase, 'utf-8')); //16 bit phrase

            const cipher = createCipheriv('aes-256-cbc', key, iv);
            const payload = {
                data: createUser.id,
                expiresAt: Date.now() + 3600 * 1000 // 1 hr expiration
            };
            const plaintext = JSON.stringify(payload);
            let encrypted = cipher.update(plaintext, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const emailData = {
                name: createUser.fullName,
                link: `http://localhost:3001/user/verify-email?key=${encrypted}`
            };
            await this.mailer.sendMail(`Test Project <${process.env['FROM_ADDRESS']}>`, createUser.email, 'Verify Email', 'verify-email', emailData);
            return { code: 201, message: "User created successfully", success: true, data: createUser }
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
    async signIn(body: any): Promise<IResponse> {
        try {
            const checkUser = await prisma.user.findFirst({ where: { email: body.email.toLowerCase() } })
            if (!checkUser) return { code: 400, message: "Invalid email", success: false };
            if (!await argon2.verify(checkUser.password, body.password,)) return { code: 400, message: "Invalid password", success: false };
            const payload = {
                id: checkUser.id
            };
            const token = jwt.sign(payload, config.server.jwtSecret, {
                expiresIn: '1d'
            });
            return { code: 200, message: "User created successfully", success: true, data: { checkUser, token } }
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
    async verifyEmail(value: string): Promise<IResponse> {
        try {
            const key: Uint8Array = new Uint8Array(Buffer.from(config.cipher.key_phrase, 'utf-8')); // 32-bit key
            const iv: Uint8Array = new Uint8Array(Buffer.from(config.cipher.iv_phrase, 'utf-8')); //16 bit phrase
            const decipher = createDecipheriv('aes-256-cbc', key, iv);
            let decryptedData = decipher.update(value, 'hex', 'utf-8');
            decryptedData += decipher.final('utf-8');
            const parseResponse = JSON.parse(decryptedData);
            if (parseResponse.expiresAt <= Date.now())return { code: 400, message: "Link has expired", success: false }
            const updateInfo = await prisma.user.update({ data: { isEmailVerified: true }, where: { id: parseResponse.data } });
            if (!updateInfo) return { code: 400, message: "Something went wrong", success: false }
            return { code: 200, message: "Email Verified successfully", success: true, data: updateInfo }
        } catch (err) {
            throw err;
        }
    }
}