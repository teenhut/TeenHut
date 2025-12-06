require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// 1. Configure Email Transporter (Uses Local Network - No Blocking!)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Connect to Production Database
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is missing in .env");
  process.exit(1);
}

// Minimal User Schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  twoFactorCode: String,
  twoFactorExpires: Date,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Cache to prevent resending the same code
const sentCodes = new Set();

async function startBot() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected! Watching for new 2FA codes...");
    console.log("------------------------------------------------");

    // Poll every 2 seconds
    setInterval(async () => {
      try {
        // Find users with an active 2FA code that expires in the future
        const users = await User.find({
          twoFactorCode: { $exists: true, $ne: null },
          twoFactorExpires: { $gt: new Date() },
        });

        for (const user of users) {
          const uniqueKey = `${user._id}-${user.twoFactorCode}`;

          // If we haven't sent this code yet
          if (!sentCodes.has(uniqueKey)) {
            console.log(
              `🔎 Found new code for ${user.email}: ${user.twoFactorCode}`
            );

            // Send Email
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: "Teen Hut Verification Code",
              text: `Your verification code is: ${user.twoFactorCode}\n\n(Sent automatically by TeenHut Bot)`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(
                  `❌ Failed to send to ${user.email}:`,
                  error.message
                );
              } else {
                console.log(`✅ Email sent to ${user.email}!`);
                sentCodes.add(uniqueKey); // Mark as sent
              }
            });
          }
        }
      } catch (err) {
        console.error("Polling error:", err.message);
      }
    }, 2000); // Check every 2 seconds
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

startBot();
