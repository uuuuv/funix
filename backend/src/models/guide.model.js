const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { mongooseDeltaSchema } = require("../helpers/quillDelta");

const schema = new Schema(
  {
    views_count: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "GuideCategory",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    origin: String,
    content: mongooseDeltaSchema,
    thumb: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    en: {
      type: Object,
      required: true,
      title: {
        type: String,
        required: true,
      },
      content: mongooseDeltaSchema,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guide", schema);
