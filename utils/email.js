const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
    }
  });

  // 2. Define email option
  const mailOptions = {
    from: "Francis Badasu <nytro04@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
