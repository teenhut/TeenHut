require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*", // Allow Vercel frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Allow Vercel frontend
    credentials: true,
  })
);

// Brevo (Sendinblue) Configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Helper: Send Email with Retry (using Brevo HTTP API)
const sendEmailWithRetry = async (to, subject, text, retries = 3) => {
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is missing!");
    return false;
  }

  const url = "https://api.brevo.com/v3/smtp/email";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: "teenhut10@gmail.com", // Must be a verified sender in Brevo
        name: "TeenHut",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: `<p>${text}</p>`,
    }),
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log("Email sent successfully via Brevo:", data.messageId);
      return true;
    } catch (error) {
      console.error(`Email attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error("All email attempts failed.");
        return false;
      }
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  credits: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date },
  twoFactorCode: { type: String },
  twoFactorExpires: { type: Date },
  stats: {
    commentsMade: { type: Number, default: 0 },
    hypesUploaded: { type: Number, default: 0 },
    likesGiven: { type: Number, default: 0 },
    messagesSent: { type: Number, default: 0 },
  },
  completedChallenges: [{ type: String }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Cloudinary Configuration
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Or use host/port for other providers
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(MONGODB_URI, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    migrateLegacyHypes();
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB Atlas", err);
  });

// Root Route
app.get("/", (req, res) => {
  res.send("TeenHut Backend is Running");
});

// Hype Schema
const hypeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Added creatorId
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], default: "image" },
  xp: { type: Number, default: 10 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      author: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Hype = mongoose.models.Hype || mongoose.model("Hype", hypeSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  text: { type: String, required: true }, // Encrypted
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ["image", "video", "file"] },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false },
  replyTo: {
    id: String,
    text: String,
    senderName: String,
  },
  reactions: [
    {
      userId: String,
      emoji: String,
    },
  ],
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

// Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  duration: { type: String },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: {
    text: String,
    senderName: String,
    timestamp: Date,
  },
  name: { type: String }, // For group chats
  isGroup: { type: Boolean, default: false },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
});

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

// Helper: Check Challenges
const checkChallenges = async (user) => {
  let creditsAwarded = 0;
  const challenges = [
    { id: "comment_10", target: 10, type: "commentsMade", reward: 20 },
    { id: "like_20", target: 20, type: "likesGiven", reward: 30 },
    { id: "hype_5", target: 5, type: "hypesUploaded", reward: 100 },
    { id: "message_50", target: 50, type: "messagesSent", reward: 50 },
    { id: "streak_3", target: 3, type: "streak", reward: 30 },
    { id: "streak_5", target: 5, type: "streak", reward: 50 },
    { id: "streak_7", target: 7, type: "streak", reward: 100 },
  ];

  let updated = false;

  for (const challenge of challenges) {
    if (user.completedChallenges.includes(challenge.id)) continue;

    let value = 0;
    if (challenge.type === "commentsMade") value = user.stats.commentsMade;
    if (challenge.type === "likesGiven") value = user.stats.likesGiven;
    if (challenge.type === "hypesUploaded") value = user.stats.hypesUploaded;
    if (challenge.type === "messagesSent") value = user.stats.messagesSent;
    if (challenge.type === "streak") value = user.streak;

    if (value >= challenge.target) {
      user.credits += challenge.reward;
      user.completedChallenges.push(challenge.id);
      creditsAwarded += challenge.reward;
      updated = true;
    }
  }

  if (updated) await user.save();
  return creditsAwarded;
};

// Migration: Fix legacy hypes
async function migrateLegacyHypes() {
  try {
    const hypes = await Hype.find({ creatorId: { $exists: false } });
    console.log(`Found ${hypes.length} legacy hypes to migrate...`);
    let count = 0;
    for (const hype of hypes) {
      // Case-insensitive lookup
      const user = await User.findOne({
        username: { $regex: new RegExp(`^${hype.author}$`, "i") },
      });
      if (user) {
        hype.creatorId = user._id;
        await hype.save();
        console.log(`Migrated hype "${hype.title}" to user ${user.username}`);
        count++;
      } else {
        console.log(
          `Could not find user for hype "${hype.title}" (author: ${hype.author})`
        );
      }
    }
    console.log(`Migration complete. Fixed ${count} hypes.`);
    return count;
  } catch (err) {
    console.error("Migration error:", err);
    return 0;
  }
}

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("WARNING: EMAIL_USER or EMAIL_PASS is missing.");
  console.warn("2FA codes will be logged to console instead of emailed.");
} else {
  console.log("Email system configured.");
}
console.log("---------------------------------------------------");

// Manual Fix Endpoint
app.get("/api/fix-data", async (req, res) => {
  const count = await migrateLegacyHypes();
  res.json({ success: true, message: `Fixed ${count} legacy hypes.` });
});

// Debug Endpoint
app.get("/api/debug-users", async (req, res) => {
  try {
    const users = await User.find({}, "username");
    const hypes = await Hype.find({}, "title author creatorId");
    res.json({ users, hypes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Email Endpoint
app.get("/api/test-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email query parameter required" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        error: "Email configuration missing",
        userSet: !!process.env.EMAIL_USER,
        passSet: !!process.env.EMAIL_PASS,
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "TeenHut Test Email",
      text: "If you are reading this, the email configuration is working correctly!",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Test email error:", error);
        return res
          .status(500)
          .json({ error: "Failed to send email", details: error.message });
      }
      res.json({
        success: true,
        message: "Email sent successfully",
        info: info.response,
      });
    });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// API Endpoints
app.post("/api/signup", async (req, res) => {
  const { email, username, password } = req.body;

  // Email Domain Validation
  const allowedDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "msn.com",
  ];
  const emailDomain = email.split("@")[1];
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({
      error: "Only Gmail and Microsoft accounts are allowed.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 2FA code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFactorExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
      twoFactorCode: code,
      twoFactorExpires,
      credits: 0,
      streak: 1, // Start with 1 day streak
      lastLogin: new Date(),
    });

    await newUser.save();

    // Send Email
    if (process.env.BREVO_API_KEY) {
      const sent = await sendEmailWithRetry(
        email,
        "Teen Hut Verification Code",
        `Your verification code is: ${code}`
      );

      if (!sent) {
        // FALLBACK: Log the code
        console.log("---------------------------------------------------");
        console.log(
          `FALLBACK DEBUG: Verification Code for ${email} is ${code}`
        );
        console.log("---------------------------------------------------");
      }
    } else {
      console.log(`DEBUG: Verification Code for ${email} is ${code}`);
    }

    res.json({ requires2FA: true, email: newUser.email });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Streak Logic
    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;

    if (lastLogin) {
      const diffTime = Math.abs(now - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    user.lastLogin = now;
    await user.save();
    await checkChallenges(user);

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      credits: user.credits,
      streak: user.streak,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Verify 2FA Endpoint
app.post("/api/verify-2fa", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Allow Master Code "677797" for bypass if email fails
    const isMasterCode = code === "677797";
    const isValidCode =
      user.twoFactorCode === code && user.twoFactorExpires > Date.now();

    if (isValidCode || isMasterCode) {
      // Success
      user.twoFactorCode = undefined;
      user.twoFactorExpires = undefined;
      user.isVerified = true; // Mark user as verified

      // Streak Logic (Moved here from login)
      const now = new Date();
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;

      if (lastLogin) {
        const diffTime = Math.abs(now - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }

      user.lastLogin = now;
      await user.save();
      await checkChallenges(user);

      // Return user data AND isVerified flag
      res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        credits: user.credits,
        streak: user.streak,
        isVerified: true,
      });
    } else {
      res.status(400).json({ error: "Invalid or expired code" });
    }
  } catch (error) {
    console.error("2FA Verification error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Public User Profile Endpoint
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select(
      "username credits streak stats followers following"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      credits: user.credits,
      streak: user.streak,
      stats: user.stats,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Leaderboard Endpoint
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ credits: -1 })
      .limit(100)
      .select("username credits streak"); // Only send necessary info

    res.json(users);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Hype Upload Endpoint
app.post("/api/hypes", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, author, userId } = req.body;

    // Convert buffer to base64 for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "teenhut_hypes",
    });

    const newHype = new Hype({
      title,
      title,
      author: author || "Anonymous",
      creatorId: userId, // Save creatorId
      mediaUrl: result.secure_url,
      mediaType: result.resource_type,
      xp: 10,
    });

    await newHype.save();

    // Update User Stats (Uploads)
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.stats.hypesUploaded += 1;
        await user.save();
        await checkChallenges(user);
      }
    }

    res.json(newHype);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Chat Upload Endpoint
app.post("/api/chat/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "teenhut_chat",
    });

    res.json({
      url: result.secure_url,
      type: result.resource_type,
    });
  } catch (error) {
    console.error("Chat upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get All Users (for Chat Selection)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "username email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create Conversation
app.post("/api/conversations", async (req, res) => {
  try {
    const { participantIds, name, isGroup, adminId } = req.body;

    if (!participantIds || participantIds.length === 0) {
      return res.status(400).json({ error: "Participants required" });
    }

    // Check for existing 1-on-1 conversation
    if (!isGroup && participantIds.length === 2) {
      const existingConv = await Conversation.findOne({
        isGroup: false,
        participants: { $all: participantIds },
      });
      if (existingConv) {
        return res.json(existingConv);
      }
    }

    const newConv = new Conversation({
      participants: participantIds,
      name,
      isGroup,
      admin: adminId,
      updatedAt: new Date(),
    });

    await newConv.save();

    // Populate participants for immediate UI update
    await newConv.populate("participants", "username");

    res.json(newConv);
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Get User Conversations
app.get("/api/conversations", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Fetch conversations error:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Video Upload Endpoint
app.post(
  "/api/videos/upload",
  upload.fields([{ name: "video" }, { name: "thumbnail" }]),
  async (req, res) => {
    try {
      const { title, description, duration, userId } = req.body;
      const videoFile = req.files["video"] ? req.files["video"][0] : null;
      const thumbnailFile = req.files["thumbnail"]
        ? req.files["thumbnail"][0]
        : null;

      if (!videoFile) {
        return res.status(400).json({ error: "No video file uploaded" });
      }

      // Upload Video
      const videoB64 = Buffer.from(videoFile.buffer).toString("base64");
      const videoDataURI = "data:" + videoFile.mimetype + ";base64," + videoB64;
      const videoResult = await cloudinary.uploader.upload(videoDataURI, {
        resource_type: "video",
        folder: "teenhut_videos",
      });

      // Upload Thumbnail (Optional)
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const thumbB64 = Buffer.from(thumbnailFile.buffer).toString("base64");
        const thumbDataURI =
          "data:" + thumbnailFile.mimetype + ";base64," + thumbB64;
        const thumbResult = await cloudinary.uploader.upload(thumbDataURI, {
          resource_type: "image",
          folder: "teenhut_thumbnails",
        });
        thumbnailUrl = thumbResult.secure_url;
      }

      const newVideo = new Video({
        title,
        description,
        videoUrl: videoResult.secure_url,
        thumbnailUrl,
        duration,
        uploader: userId,
      });

      await newVideo.save();
      res.json(newVideo);
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({ error: "Video upload failed" });
    }
  }
);

// Get All Videos Endpoint
app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploader", "username")
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Fetch videos error:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Get Single Video Endpoint
app.get("/api/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate("uploader", "username");
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

// Like Endpoint
app.post("/api/hypes/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID required" });

    const hype = await Hype.findById(id);
    if (!hype) return res.status(404).json({ error: "Hype not found" });

    const userIndex = hype.likedBy.indexOf(userId);
    let isLiked = false;

    if (userIndex === -1) {
      // Like
      hype.likedBy.push(userId);
      hype.likes += 1;
      isLiked = true;
    } else {
      // Unlike
      hype.likedBy.splice(userIndex, 1);
      hype.likes = Math.max(0, hype.likes - 1);
      isLiked = false;
    }

    await hype.save();

    // Update User Stats (Likes)
    if (isLiked) {
      const user = await User.findById(userId);
      if (user) {
        user.stats.likesGiven += 1;
        await user.save();
        await checkChallenges(user);
      }
    }

    res.json({ likes: hype.likes, isLiked });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "Failed to update like" });
  }
});

// Comment Endpoint
app.post("/api/hypes/:id/comment", async (req, res) => {
  console.log("Received comment request for ID:", req.params.id);
  console.log("Body:", req.body);
  try {
    const { id } = req.params;
    const { text, author, userId } = req.body; // Need userId to track stats

    const hype = await Hype.findById(id);
    if (!hype) {
      console.log("Hype not found for ID:", id);
      return res.status(404).json({ error: "Hype not found" });
    }

    const newComment = {
      text,
      author: author || "Anonymous",
      createdAt: new Date(),
    };

    hype.comments.push(newComment);
    await hype.save();
    console.log("Comment saved:", newComment);

    // Update User Stats
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.stats.commentsMade += 1;
        await user.save();
        await checkChallenges(user);
      }
    }

    res.json(newComment);
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get Comments Endpoint
app.get("/api/hypes/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const hype = await Hype.findById(id);
    if (!hype) return res.status(404).json({ error: "Hype not found" });

    res.json(hype.comments.reverse()); // Newest first
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Get Hypes Endpoint
app.get("/api/hypes", async (req, res) => {
  try {
    const { userId } = req.query;
    const hypes = await Hype.find().sort({ createdAt: -1 }).limit(20).lean();

    const hypesWithLikeStatus = hypes.map((hype) => ({
      ...hype,
      isLiked: userId
        ? hype.likedBy?.map((id) => id.toString()).includes(userId)
        : false,
    }));

    res.json(hypesWithLikeStatus);
  } catch (error) {
    console.error("Fetch hypes error:", error);
    res.status(500).json({ error: "Failed to fetch hypes" });
  }
});

// View Endpoint
app.post("/api/hypes/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    await Hype.findByIdAndUpdate(id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to track view" });
  }
});

// Follow Endpoint
app.post("/api/users/:id/follow", async (req, res) => {
  try {
    const { id: targetUserId } = req.params; // User to follow
    const { currentUserId } = req.body; // User who is following

    if (!currentUserId)
      return res.status(400).json({ error: "User ID required" });
    if (targetUserId === currentUserId)
      return res.status(400).json({ error: "Cannot follow yourself" });

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ error: "Failed to follow/unfollow" });
  }
});

// Analytics Endpoint
app.get("/api/analytics", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Aggregate views and likes from all user's hypes
    const userHypes = await Hype.find({ creatorId: userId });
    const totalViews = userHypes.reduce(
      (acc, hype) => acc + (hype.views || 0),
      0
    );
    const totalLikesReceived = userHypes.reduce(
      (acc, hype) => acc + (hype.likes || 0),
      0
    );

    // Calculate engagement rate (likes / views) * 100
    const engagementRate =
      totalViews > 0
        ? ((totalLikesReceived / totalViews) * 100).toFixed(1)
        : "0.0";

    res.json({
      totalViews,
      totalLikes: totalLikesReceived, // Likes received on their hypes (not likes given)
      followers: user.followers.length,
      engagementRate: engagementRate + "%",
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("join-room", async (data) => {
    // Handle both string (legacy/public) and object (private) payloads
    let room = data;
    let userId = null;

    if (typeof data === "object" && data.room) {
      room = data.room;
      userId = data.userId;
    }

    // Validate Private Conversations (ObjectId)
    if (mongoose.Types.ObjectId.isValid(room)) {
      if (!userId) {
        console.log(
          `Socket ${socket.id} attempted to join private room ${room} without userId`
        );
        return; // Reject
      }

      try {
        const conversation = await Conversation.findById(room);
        if (!conversation) {
          console.log(
            `Socket ${socket.id} attempted to join non-existent room ${room}`
          );
          return;
        }

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === userId
        );

        if (!isParticipant) {
          console.log(
            `Socket ${socket.id} (User ${userId}) denied access to room ${room}`
          );
          return; // Reject unauthorized access
        }
      } catch (err) {
        console.error("Error validating room access:", err);
        return;
      }
    }

    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);

    // Load history
    try {
      const messages = await Message.find({ room })
        .sort({ timestamp: 1 })
        .limit(50);
      socket.emit("history", messages);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  });

  socket.on("send-message", async (data) => {
    console.log("Message received:", data);

    try {
      const newMessage = new Message({
        room: data.room,
        text: data.text,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
        senderId: data.userId,
        senderName: data.username || "Anonymous",
        timestamp: new Date(),
        replyTo: data.replyTo,
      });

      await newMessage.save();

      // Update User Stats (Messages)
      if (data.userId) {
        const user = await User.findById(data.userId);
        if (user) {
          user.stats.messagesSent += 1;
          await user.save();
          await checkChallenges(user);
        }
      }

      io.in(data.room).emit("message", {
        id: newMessage._id,
        text: newMessage.text,
        mediaUrl: newMessage.mediaUrl,
        mediaType: newMessage.mediaType,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        timestamp: newMessage.timestamp,
        replyTo: newMessage.replyTo,
        reactions: [],
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("edit-message", async (data) => {
    try {
      const message = await Message.findById(data.messageId);
      if (message && message.senderId.toString() === data.userId) {
        message.text = data.newText;
        message.isEdited = true;
        await message.save();
        io.in(data.room).emit("message-updated", {
          id: message._id,
          text: message.text,
          isEdited: true,
        });
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  });

  socket.on("delete-message", async (data) => {
    try {
      const message = await Message.findById(data.messageId);
      if (message && message.senderId.toString() === data.userId) {
        await Message.findByIdAndDelete(data.messageId);
        io.in(data.room).emit("message-deleted", {
          messageId: data.messageId,
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });

  socket.on("react-message", async (data) => {
    try {
      const message = await Message.findById(data.messageId);
      if (message) {
        const existingReactionIndex = message.reactions.findIndex(
          (r) => r.userId === data.userId && r.emoji === data.emoji
        );

        if (existingReactionIndex > -1) {
          // Remove reaction if already exists (toggle)
          message.reactions.splice(existingReactionIndex, 1);
        } else {
          // Add reaction
          message.reactions.push({ userId: data.userId, emoji: data.emoji });
        }

        await message.save();
        io.in(data.room).emit("message-reacted", {
          messageId: message._id,
          reactions: message.reactions,
        });
      }
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});
