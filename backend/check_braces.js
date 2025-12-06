const fs = require("fs");
const content = fs.readFileSync("server.js", "utf8");
let open = 0;
let close = 0;
for (let char of content) {
  if (char === "{") open++;
  if (char === "}") close++;
}
console.log(`Open: ${open}, Close: ${close}`);

let balance = 0;
const lines = content.split("\n");
let appPrepareOpened = false;
for (let i = 0; i < lines.length; i++) {
  for (let char of lines[i]) {
    if (char === "{") {
      balance++;
      if (i >= 37) appPrepareOpened = true;
    }
    if (char === "}") balance--;
  }
  if (appPrepareOpened && balance === 0) {
    console.log(`App prepare potentially closed at line ${i + 1}`);
  }
  if (balance < 0) {
    console.log(`Balance went negative at line ${i + 1}`);
    break;
  }
}
