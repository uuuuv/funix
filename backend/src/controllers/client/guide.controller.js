const createError = require("../../helpers/errorCreator");
const Guide = require("../../models/guide.model");

module.exports.getGuides = async (req, res, next) => {
  try {
    const lang = req.lang;

    let guides = [];
    if (lang === "vi") {
      guides = await Guide.aggregate([
        {
          $lookup: {
            from: "guidecategories", 
            foreignField: "_id", 
            localField: "category", 
            as: "category",
            pipeline: [
              {$project: {
                en: 0
              }}
            ]
          }
        },
        {
          $set: {
            category: {
              $arrayElemAt: ["$category", 0]
            }
          }
        },
        {
          $project: {
            en: 0,
            content: 0,
            author: 0,
            origin: 0
          }
        }
      ])
    }

    if (lang === "en") {
      guides = await Guide.aggregate([
        {
          $lookup: {
            from: "guidecategories",
            localField: "category",
            foreignField: "_id",
            as: "category",
            pipeline: [
              {
                $set: {
                  name: "$en.name",
                },
              },
              {
                $project: {
                  en: 0,
                },
              },
            ],
          },
        },
        {
          $set: {
            category: { $arrayElemAt: ["$category", 0] },
            title: "$en.title"
          },
        },
        {
          $project: {
            en: 0, 
            content: 0,
            author: 0, 
            origin: 0
          }
        }
      ]);
    }

    return res.status(200).json({
      data: guides,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.getSingleGuide = async (req, res, next) => {
  try {
    const lang = req.lang;

    const { slug } = req.params;
    let guide;
    if (lang === 'vi') {
      guide = await Guide.aggregate([
        {
          $match: {
            slug
          }
        },
        {
          $lookup :{
            foreignField: "_id", 
            localField: "category", 
            from: "guidecategories", 
            as: "category", 
            pipeline: [
              {
                $project: {
                  en: 0
                }
              }
            ]
          }
        },
        {
          $set: {
            category: {
              $arrayElemAt: ["$category", 0]
            }
          }
        },
        {
          $project: {
            en: 0
          }
        }
      ])
    }


    if (lang === 'en') {
      guide = await Guide.aggregate([
        {
          $match: {
            slug
          }
        },
        {
          $lookup :{
            foreignField: "_id", 
            localField: "category", 
            from: "guidecategories", 
            as: "category", 
            pipeline: [
              {
                $set: {
                  name: "$en.name"
                }
              },
              {
                $project: {
                  en: 0
                }
              }
            ]
          }
        },
        {
          $set: {
            title: "$en.title",
            content: "$en.content",
            category: {
              $arrayElemAt: ["$category", 0]
            }
          }
        },
        {
          $project: {
            en: 0
          }
        }

      ])
    }

    if (!guide[0]) {
      return next(createError(new Error(""), 404, "Not Found"));
    }

    return res.status(200).json({
      data: guide[0],
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};
