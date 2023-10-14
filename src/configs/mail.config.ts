import { Injectable } from '@nestjs/common';

@Injectable()
export class MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;

  constructor() {
    this.host = 'smtp.example.com'; // SMTP server của bạn
    this.port = 587; // Cổng SMTP
    this.secure = false; // Sử dụng TLS hoặc không
    this.user = 'your_username'; // Tên người dùng SMTP
    this.pass = 'your_password'; // Mật khẩu SMTP
  }
}