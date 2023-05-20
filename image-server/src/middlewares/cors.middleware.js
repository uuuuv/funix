const whiteList = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://vvvv.space",
  "http://admin.vvvv.space",
  "http://api.vvvv.space",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = require("cors")(corsOptions);
