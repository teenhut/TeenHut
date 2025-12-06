const mongoose = require("mongoose");
require("dotenv").config();

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

const dummyVideos = [
  {
    title: "Exploring the Mountains",
    description: "A beautiful journey through the Alps.",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/v1687252627/samples/sea-turtle.mp4",
    thumbnailUrl:
      "https://res.cloudinary.com/demo/image/upload/v1687252627/samples/landscapes/beach-boat.jpg",
    views: 1200,
    likes: 350,
    duration: "12:34",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    title: "Coding a React App in 10 Minutes",
    description: "Speed coding challenge!",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/v1687252627/samples/elephants.mp4",
    thumbnailUrl:
      "https://res.cloudinary.com/demo/image/upload/v1687252627/samples/animals/kitten-playing.gif",
    views: 5400,
    likes: 1200,
    duration: "10:05",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    title: "Top 10 Gaming Moments",
    description: "Best plays of the month.",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/v1687252627/samples/cld-sample-video.mp4",
    thumbnailUrl:
      "https://res.cloudinary.com/demo/image/upload/v1687252627/samples/animals/reindeer.jpg",
    views: 8900,
    likes: 2100,
    duration: "15:20",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
  },
  {
    title: "How to Cook Pasta",
    description: "Authentic Italian recipe.",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/v1687252627/samples/sea-turtle.mp4",
    thumbnailUrl:
      "https://res.cloudinary.com/demo/image/upload/v1687252627/samples/food/pot-mussels.jpg",
    views: 320,
    likes: 45,
    duration: "08:15",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    title: "Tech Review 2024",
    description: "Latest gadgets reviewed.",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/v1687252627/samples/elephants.mp4",
    thumbnailUrl:
      "https://res.cloudinary.com/demo/image/upload/v1687252627/samples/landscapes/architecture-signs.jpg",
    views: 15000,
    likes: 4000,
    duration: "20:00",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
  },
  {
    title: "My Morning Routine",
    description: "Get ready with me.",
    videoUrl:
      "https://res.cloudinary.com/demo/video/upload/v1687252627/samples/cld-sample-video.mp4",
    thumbnailUrl:
      "https://res.cloudinary.com/demo/image/upload/v1687252627/samples/people/smiling-man.jpg",
    views: 200,
    likes: 20,
    duration: "05:45",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Video.deleteMany({}); // Clear existing videos
    console.log("Cleared existing videos");
    await Video.insertMany(dummyVideos);
    console.log("Inserted dummy videos");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
