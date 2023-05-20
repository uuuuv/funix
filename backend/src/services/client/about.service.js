const About = require("../../models/about.model");

module.exports.getAbout = async (lang) => {
  let about = await About.get();
  if (lang === "en") {
    return { content: about.en.content };
  } else {
    return { content: about.content };
  }
};
