require("dotenv").config();
const express = require("express");
const app = express();

app.use(require("./middlewares/cors.middleware"));
app.use(require("./routes/main.route"));

const port = process.env.PORT || 9999;
app.listen(port, () => {
  const fs = require("fs");
  const { cachePath } = require("./constants/index");

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  console.log(`Server is running on port ${port}`);
});
