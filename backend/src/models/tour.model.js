const { mongooseDeltaSchema } = require("../helpers/quillDelta");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    code: { type: String, required: true },
    views_count: {
      type: Number,
      default: 0,
    },
    name: { type: String, required: true },
    journey: { type: String, required: true },
    description: { type: String, required: true },
    highlights: mongooseDeltaSchema,
    slug: { type: String, required: true },
    destinations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
    hot: { type: Boolean, required: true, default: false },
    start_at: { type: Schema.Types.ObjectId, ref: "Place" },
    start_at_text: String,

    thumb: { type: String, required: true },
    banner: { type: String, required: true },

    price: { type: Number, min: 0 },
    duration: {
      days: {
        type: Number,
        min: 1,
      },
      nights: {
        type: Number,
        min: 0,
      },
    },

    departure_dates: {
      type: [{ type: Number, min: 1 }],
      default: [],
    },
    departure_dates_text: String,
    rating: {
      type: [
        {
          name: { type: String, required: true },
          stars: { type: Number, min: 1, max: 5, required: true },
          content: { type: String, required: true },
        },
      ],
      default: [],
    },

    itinerary: [
      {
        id: { type: String, required: true },
        day: { type: String, required: true },
        destination: { type: String, required: true },
        images: [
          {
            id: { type: String, required: true },
            url: {
              type: String,
              default: "",
            },
            caption: { type: String, required: true },
          },
        ],
        content: mongooseDeltaSchema,
      },
    ],

    price_policies: {
      type: Object,
      required: true,
      includes: mongooseDeltaSchema,
      excludes: mongooseDeltaSchema,
      other: mongooseDeltaSchema,
    },

    terms: {
      type: Object,
      required: true,
      registration: mongooseDeltaSchema,
      cancellation: mongooseDeltaSchema,
      payment: mongooseDeltaSchema,
      notes: mongooseDeltaSchema,
    },

    en: {
      type: Object,
      required: true,
      name: { type: String, required: true },
      journey: { type: String, required: true },
      description: { type: String, required: true },
      highlights: mongooseDeltaSchema,
      departure_dates_text: String,
      start_at_text: String,

      price_policies: {
        type: Object,
        required: true,
        includes: mongooseDeltaSchema,
        excludes: mongooseDeltaSchema,
        other: mongooseDeltaSchema,
      },

      terms: {
        type: Object,
        required: true,
        registration: mongooseDeltaSchema,
        cancellation: mongooseDeltaSchema,
        payment: mongooseDeltaSchema,
        notes: mongooseDeltaSchema,
      },

      itinerary: [
        {
          type: Object,
          required: true,
          day: { type: String, required: true },
          destination: { type: String, required: true },
          content: mongooseDeltaSchema,
          images: [
            {
              id: { type: String, required: true },
              caption: { type: String, required: true },
            },
          ],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tour", schema);
