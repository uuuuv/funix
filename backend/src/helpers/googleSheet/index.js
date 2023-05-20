const { GoogleAuth } = require("google-auth-library");
const logger = require("../logger");

let client;

async function initGoogleClient() {
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  client = await auth.getClient().catch((error) => {
    logger(`From initGoogleClien: ${error.stack}`);
    process.exit(1);
  });
}
