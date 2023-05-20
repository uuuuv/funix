module.exports.mime = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  js: "application/javascript",
};

const path = require("path");

module.exports.uploadsPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "backend",
  "uploads"
);

module.exports.cachePath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "cached-photos"
);

module.exports.availableDimensions = new Map([
  ["800x530", { w: 800, h: 530 }],
  ["360x240", { w: 360, h: 240 }],
  ["150x100", { w: 150, h: 100 }],
]);
