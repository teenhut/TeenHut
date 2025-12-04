require("dotenv").config();
const nodemailer = require("nodemailer");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Configure Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("--- Manual 2FA Code Sender ---");
console.log("Use this tool to send codes you see in the production logs.");

rl.question("Enter User Email: ", (email) => {
  rl.question("Enter Verification Code: ", (code) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.trim(),
      subject: "Teen Hut Verification Code (Manual Send)",
      text: `Your verification code is: ${code.trim()}\n\n(Sent manually by admin)`,
    };

    console.log(`Sending code ${code} to ${email}...`);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully: " + info.response);
      }
      rl.close();
    });
  });
});
