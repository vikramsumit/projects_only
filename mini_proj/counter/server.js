const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const COUNTER_FILE = path.join(__dirname, "counter.json");

app.use(express.static("public"));

app.get("/api/visitor-count", (req, res) => {
  fs.readFile(COUNTER_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Read error" });

    let counter = JSON.parse(data);
    counter.count += 1;

    fs.writeFile(COUNTER_FILE, JSON.stringify(counter), (err) => {
      if (err) return res.status(500).json({ error: "Write error" });
      res.json({ count: counter.count });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
