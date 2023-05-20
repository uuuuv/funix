module.exports = (fileLocation, res) => {
  const fs = require("fs");
  var { mime } = require("../constants/index");

  const ext = fileLocation.slice(fileLocation.lastIndexOf(".") + 1);

  var s = fs.createReadStream(fileLocation);

  s.on("open", function () {
    res.set("Content-Type", mime[ext] || "text/plain");
    s.pipe(res);
  });

  s.on("error", function (err) {
    console.log(err);
    res.set("Content-Type", "text/plain");
    res.status(404).end("Not found");
  });
};
