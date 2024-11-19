const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path'); // To handle file paths

// Function to send an email
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Modify the greeting to use either 'to' or fallback to email
  const recipientName = options.name || options.email;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #888; border-radius: 10px;">
      <!-- Logo -->
      <div style="text-align: center; padding: 10px 0;">
        <img src="cid:logo" alt="Company Logo" style="width: 150px;">
      </div>

      <!-- Greeting -->
      <h2 style="text-align: center; color: #333;">Hello, ${recipientName}</h2>

      <!-- OTP Section -->
      <div style="text-align: center; margin: 20px 0;">
        <h1 style="font-size: 36px; color: #333;">${options.otp}</h1>
        <p style="font-size: 18px; color: #666;">Your One-Time Password (OTP)</p>
      </div>

      <!-- Message Body -->
      <p style="font-size: 16px; color: #555;">${options.message}</p>

      <!-- Footer Instructions -->
      <div style="border-top: 1px solid #eaeaea; padding-top: 10px; margin-top: 20px;">
        <p style="font-size: 14px; color: #888;">If you did not request this, please ignore this email or contact support.</p>
        <p style="font-size: 14px; color: #888;">Thank you,<br>The Company Team</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: htmlTemplate,
    // attachments: [
    //   {
    //     filename: "logo.png",
    //     path: path.join(__dirname, "./../assets/logo.png"),
    //     cid: "logo",
    //   },
    // ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
