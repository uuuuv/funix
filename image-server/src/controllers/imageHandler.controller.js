var path = require("path");
var fs = require("fs");
const url = require("url");
const sendFile = require("./sendFile");
const sharp = require("sharp");
const {
  uploadsPath,
  cachePath,
  availableDimensions,
} = require("../constants/index");

const getFileNameByPattern = (productType, productId, fileName, dimensions) => {
  const fileNameWithoutExt = fileName.slice(0, fileName.lastIndexOf("."));
  const ext = fileName.slice(fileName.lastIndexOf(".") + 1);

  return new Promise((res, _) => {
    fs.readdir(cachePath, (error, fileNames) => {
      if (error) throw error;

      const foundFileName = fileNames.find((item) => {
        const reg = new RegExp(
          `^${productType}-${productId}-${fileNameWithoutExt}\\?d=${dimensions}&e=[0-9]+\\.${ext}$`,
          "g"
        );
        return reg.test(item);
      });
      return res(foundFileName);
    });
  });
};

module.exports.imageHandler = async (req, res, next) => {
  const requestedDimensions = req.query?.d;
  const approvedDimensions = availableDimensions.get(requestedDimensions);
  const [prefix, productType, productId, fileName] = url
    .parse(req.url)
    .pathname.slice(1)
    .split("/");

  const originalFileLocation = path.join(
    uploadsPath,
    productType,
    productId,
    fileName
  );

  // original file doesn't exist
  if (!fs.existsSync(originalFileLocation)) {
    res.set("Content-Type", "text/plain");
    return res.status(404).end("Not found");
  }

  // not require dimensions > send original file
  if (!requestedDimensions) {
    return sendFile(originalFileLocation, res);
  }

  // require dimensions
  // not allowed dimensions
  if (!approvedDimensions) {
    res.set("Content-Type", "text/plain");
    return res.status(404).end("Not Found");
  }

  try {
    const foundImageName = await getFileNameByPattern(
      productType,
      productId,
      fileName,
      requestedDimensions
    );

    if (foundImageName) {
      return sendFile(path.join(cachePath, foundImageName), res);
    }

    const fileNameWithoutExt = fileName.slice(0, fileName.lastIndexOf("."));
    const ext = fileName.slice(fileName.lastIndexOf(".") + 1);

    const rs = fs.createReadStream(originalFileLocation);
    const transformer = sharp().resize({
      width: approvedDimensions.w,
      height: approvedDimensions.h,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    });

    const newImagePath = path.join(
      cachePath,
      `${productType}-${productId}-${fileNameWithoutExt}?d=${requestedDimensions}&e=${Date.now()}.${ext}`
    );

    const ws = fs.createWriteStream(newImagePath);
    rs.pipe(transformer).pipe(ws);

    ws.on("finish", () => {
      const newRs = fs.createReadStream(newImagePath);
      res.set(
        "Content-Type",
        require("../constants/index")[ext] || "text/plain"
      );
      newRs.pipe(res);
    });
  } catch (error) {
    console.error(error);
    res.set("Content-Type", "text/plain");
    return res.status(404).end("Not Found");
  }
};
