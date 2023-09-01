const express = require("express");
const app = express();
const port = 3002;

app.use(express.static("public"));
app.set("view engine", "ejs");
const path = require("path");
app.use(express.static("public"));
app.use("/public", (req, res, next) => {
  res.type("text/javascript");
  next();
});
app.get("/login-facebook", (req, res) => {
  const appId = "1476109913180602"; // Replace with your Facebook App ID
  res.render("index", { appId });
});
app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
