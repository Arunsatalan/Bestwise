const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or your provider
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Best Wishes 🎉" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
