require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

console.log("Testing MongoDB connection...");
// Mask password in logs
console.log("URI:", uri ? uri.replace(/:([^:@]+)@/, ":****@") : "undefined");

if (!uri) {
  console.error("Error: MONGODB_URI is not defined in .env");
  process.exit(1);
}

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(uri, clientOptions)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log(
      "Database ping successful. Your credentials and IP whitelist are correct."
    );
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err.message);

    if (err.message.includes("bad auth")) {
      console.error("\nPOSSIBLE CAUSES:");
      console.error("1. Incorrect Username or Password.");
      console.error("2. Special characters in password not URL-encoded.");
      console.error("3. User does not exist in this database within Atlas.");
    } else if (err.message.includes("buffering timed out")) {
      console.error("\nPOSSIBLE CAUSES:");
      console.error("1. IP Address not whitelisted in MongoDB Atlas.");
      console.error("2. Network firewall blocking port 27017.");
    }

    process.exit(1);
  });
