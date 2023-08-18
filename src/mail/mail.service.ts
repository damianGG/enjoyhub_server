import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: {
    sendMail: (arg0: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) => any;
  };

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

    const logoUrl = 'https://www0.swps.pl/images/common/hr-award-color.webp'; // Umieść tu link do logo firmy

    const mailOptions = {
      from: 'damiangolon@gmail.com',
      to: email,
      subject: 'Potwierdź swój adres e-mail',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
              <img src="${logoUrl}" alt="Logo Firmy" style="max-width: 150px; display: block; margin: auto;" />
              <h1 style="font-size: 18px; color: #333333; text-align: center;">Witaj!</h1>
              <p style="font-size: 16px; color: #333333; line-height: 1.5; text-align: center;">
                  Dziękujemy za rejestrację w naszym serwisie. Został wygenerowany dla Ciebie link aktywacyjny.
                  Kliknij w poniższy przycisk, aby potwierdzić swój adres e-mail i aktywować konto.
              </p>
              <div style="text-align: center;">
                  <a href="${verificationLink}" style="background-color: #3498db; color: #ffffff; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                      Potwierdź adres e-mail
                  </a>
              </div>
              <p style="font-size: 14px; color: #aaaaaa; text-align: center; margin-top: 20px;">
                  Jeśli przycisk nie działa, skopiuj i wklej poniższy link do przeglądarki:
                  <br>
                  <a href="${verificationLink}" style="color: #3498db;">
                      ${verificationLink}
                  </a>
              </p>
          </div>
      </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
