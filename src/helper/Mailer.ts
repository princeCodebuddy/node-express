import { createTransport } from 'nodemailer';
import * as ejs from 'ejs';
import path from "path"

export class Mailer {
  protected _transport;
  constructor() {
    this._transport = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env['USER_NAME'],
        pass: process.env['API_KEY'],
      },
    });
  }
  /**
   * //@Method:sendMail
   * //@Description:To send email
   */
  async sendMail(from: string, to: string, subject: string, tplName: string, locals: any) {
    try {
      const mailer = new Mailer();
      const templateDir = path.join(process.cwd(), 'views', tplName, 'html.ejs');
      const html: string = await ejs.renderFile(templateDir, locals);
      const options = {
        from: from,
        to: to,
        subject: subject,
        html: html,
      };
      const mailResponse = await mailer._transport.sendMail(options);
      if (mailResponse) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}