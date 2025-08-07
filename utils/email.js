const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const { Resend } = require('resend');

//not 100% functional yet

module.exports = class Email {
  constructor(user, url = null) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Fragrâncias <noreply@yourdomain.com>`; //process.env.EMAIL_FROM
    // this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // Use Resend for production
    if (process.env.NODE_ENV === 'PRODUCTION') {
      return await this.resend.emails.send({
        from: this.from,
        to: this.to,
        subject,
        html
      });
    }

    // Fallback: Nodemailer (Mailtrap, Gmail)
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Bem vindo ao nosso site!');
  }
};
