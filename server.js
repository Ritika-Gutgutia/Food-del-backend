const express = require("express");
const app = express();
const port = process.env.PORT || 300;

app.get("/", (req, res) => {
  res.send("Hello World");
});
