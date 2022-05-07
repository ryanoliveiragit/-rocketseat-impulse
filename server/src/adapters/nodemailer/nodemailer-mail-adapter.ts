import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c8d31bb081bf70",
      pass: "1beb5e6b4b4efb"
    }
  });


export class NodemailerMailAdapter implements MailAdapter {
    async sendMail({ subject, body}: SendMailData) {
        await transport.sendMail({
        from: 'Equipe Feedget <oi@feedget.com>',
        to: 'Ryan Oliveira <ryanoliveirasp@gmail.com>',
        subject,
        html: body,
    });
    }
}