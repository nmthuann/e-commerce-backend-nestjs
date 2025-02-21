// src/mail/mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
  async sendMail(mail: string, subject: string, content: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER, // Sử dụng biến môi trường
        pass: process.env.GMAIL_PASSWORD, // Sử dụng biến môi trường
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER, // Sử dụng biến môi trường
      to: mail,
      subject: subject,
      text: content,
    };

    await transporter.sendMail(mailOptions);
  }
}
