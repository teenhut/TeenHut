const fs = require("fs");

try {
  const content = fs.readFileSync("server.log", "utf16le");
  const lines = content.split(/\r?\n/);
  lines.forEach((line) => {
    if (
      line.includes("MONGODB") ||
      line.includes("API") ||
      line.includes("KEY") ||
      line.includes("SECRET") ||
      line.includes("PASS")
    ) {
      console.log(line);
    }
  });
} catch (err) {
  console.error("Error reading file:", err);
}
