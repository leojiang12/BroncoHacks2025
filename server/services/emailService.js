const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: !!process.env.SMTP_SECURE, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendVerificationEmail(to, token) {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Hackathon App" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify your email',
    html: `
      <p>Welcome! Click below to verify your email:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

module.exports = { sendVerificationEmail };
