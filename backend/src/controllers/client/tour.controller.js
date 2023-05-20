const { main: sendMail } = require("../../helpers/nodemailer");
const createError = require("../../helpers/errorCreator");
const appendRow = require("../../helpers/googleSheet/appendRow");
const Settings = require("../../models/settings.model");
const Tour = require("../../models/tour.model");
const User = require("../../models/user.model");
const getLocalTimeString = require("../../helpers/getLocalTimeString");

module.exports.getTours = async (req, res, next) => {
  try {
    const lang = req.lang;

    let tours = [];
    if (lang === "vi") {
      tours = await Tour.find(
        {},
        {
          _id: 1,
          code: 1,
          thumb: 1,
          banner: 1,
          slug: 1,
          name: 1,
          price: 1,
          destinations: 1,
          is_home_slider: 1,
          is_domestic_slider: 1,
          is_europe_slider: 1,
          duration: 1,
        }
      ).populate("destinations");

      tours = await Tour.aggregate([
        {
          $lookup: {
            from: "places",
            localField: "destinations",
            foreignField: "_id",
            as: "destinations",
            pipeline: [
              {
                $project: {
                  en: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            en: 0,
            itinerary: 0,
            terms: 0,
            price_policies: 0,
            highlights: 0,
            start_at: 0,
            start_at_text: 0,
            description: 0,
            rating: 0,
          },
        },
      ]);
    }

    if (lang === "en") {
      tours = await Tour.aggregate([
        {
          $lookup: {
            from: "places",
            localField: "destinations",
            foreignField: "_id",
            as: "destinations",
            pipeline: [
              {
                $project: {
                  name: 0,
                },
              },
              {
                $set: {
                  name: "$en.name",
                },
              },
            ],
          },
        },
        {
          $set: {
            name: "$en.name",
          },
        },
        {
          $project: {
            en: 0,
            highlights: 0,
            description: 0,
            start_at: 0,
            start_at_text: 0,
            itinerary: 0,
          },
        },
      ]);
    }

    return res.status(200).json({
      data: tours,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.getTourBySlug = async (req, res, next) => {
  try {
    const lang = req.lang;

    const { slug } = req.params;
    let tour = await Tour.findOne({ slug })
      .populate("destinations")
      .populate("start_at");

    if (!tour) {
      return next(
        createError(new Error(""), 404, {
          en: "Tour Not Found",
          vi: "Không tìm thấy tour",
        })
      );
    }

    let result = {
      _id: tour._id,
      code: tour.code,
      slug: tour.slug,
      price: tour.price,
      departure_dates: tour.departure_dates,
      rating: tour.rating,
      duration: tour.duration,
      thumb: tour.thumb,
      banner: tour.banner,
      hot: tour.hot,
      views_count: tour.views_count,
    };

    if (lang === "vi") {
      const destinations = tour.destinations.map((item) => ({
        name: item.name,
        slug: item.slug,
        _id: item._id,
      }));

      const start_at = tour.start_at
        ? {
            name: tour.start_at.name,
            slug: tour.start_at.slug,
            _id: tour.start_at._id,
          }
        : null;

      result = {
        ...result,
        name: tour.name,
        departure_dates_text: tour.departure_dates_text,
        description: tour.description,
        journey: tour.journey,
        highlights: tour.highlights,
        destinations: destinations,
        start_at: start_at,
        start_at_text: tour.start_at_text,
        itinerary: tour.itinerary,
        terms: tour.terms,
        price_policies: tour.price_policies,
      };
    }

    tour.departure_dates = tour.departure_dates?.filter(
      (timestamp) => timestamp > Number(Date.now())
    );

    if (lang === "en") {
      let itinerary = tour.en.itinerary.map((iti, index) => {
        return {
          ...iti,
          images: iti.images.map((imageItem, imageIndex) => ({
            ...imageItem,
            url: tour.itinerary[index].images[imageIndex].url,
          })),
        };
      });

      const destinations = tour.destinations.map((item) => ({
        _id: item._id,
        name: item.en.name,
        slug: item.slug,
      }));
      const start_at = tour.start_at
        ? {
            _id: tour.start_at._id,
            slug: tour.start_at.slug,
            name: tour.start_at.en.name,
          }
        : null;

      result = {
        ...result,
        name: tour.en.name,
        departure_dates_text: tour.en.departure_dates_text,
        description: tour.en.description,
        journey: tour.en.journey,
        highlights: tour.en.highlights,
        destinations: destinations,
        start_at: start_at,
        start_at_text: tour.en.start_at_text,
        itinerary: itinerary,
        terms: tour.en.terms,
        price_policies: tour.en.price_policies,
      };
    }

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.bookTour = async (req, res, next) => {
  try {
    // google sheet
    const {
      tourCode,
      tourName,
      tourPrice,
      firstname,
      surname,
      email,
      phone,
      gender,
      address,
      adult,
      children,
      departureDate,
      tourUrl,
    } = req.body;

    const settings = await Settings.findOne();

    const range = `${settings.tourBookingSheetId}!B2:Z2`;
    const values = [
      getLocalTimeString(new Date()),
      tourCode,
      tourName,
      tourPrice.toLocaleString(),
      firstname,
      surname,
      email,
      phone,
      gender,
      address,
      adult,
      children,
      getLocalTimeString(new Date(departureDate), { time: false }),
    ];

    await appendRow(settings.sheetId, range, values);

    // send mail
    const user = await User.findOne({
      role: "admin",
    });
    const ownerEmail = user.username;
    let html = `<div style="background: black; color: white">
    <h1>Thông báo: có khách hàng đặt tour</h1>
    <h2>Đặt lúc: ${getLocalTimeString(new Date())}</h2>
    <br>
    <h3>Thông tin tour</h3>
    <ul>
      <li>Tên tour: ${tourName} [${tourCode}]</li>
      <li>Giá tour: ${tourPrice}</li>
      <li>URL: <a href="${tourUrl}">${tourUrl}</a></li>
    </ul>
    <br>
    <h3>Thông tin khách hàng</h3>
    <ul>
      <li>Họ: ${firstname}</li>
      <li>Tên: ${surname}</li>
      <li>Email: ${email}</li>
      <li>SĐT: ${phone}</li>
      <li>Giới tính: ${gender}</li>
      <li>Địa chỉ: ${address}</li>
      <li>Số người lớn: ${adult}</li>
      <li>Số trẻ em: ${children}</li>
      <li>Ngày khởi hành: ${getLocalTimeString(new Date(departureDate), {
        time: false,
      })}</li>
    </ul>
    </div>`;

    const config = {
      to: ownerEmail,
      subject: "Thông báo: có khách hàng đặt tour",
      text: "Thông báo: có khách hàng đặt tour",
      html: html,
    };

    await sendMail(config);

    return res.status(200).json({
      message: {
        en: "Thành công",
        vi: "Thành công",
      },
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.callMeBack = async (req, res, next) => {
  try {
    // google sheet
    const {
      tourCode,
      tourName,
      tourPrice,
      firstname,
      surname,
      phone,
      gender,
      tourUrl,
    } = req.body;

    const settings = await Settings.findOne();

    const range = `${settings.tourCallbackRequestSheetId}!B2:Z2`;
    const values = [
      getLocalTimeString(new Date()),
      getLocalTimeString(new Date()),
      tourCode,
      tourName,
      tourPrice.toLocaleString(),
      firstname,
      surname,
      phone,
      gender,
    ];

    await appendRow(settings.sheetId, range, values);

    // send mail
    const user = await User.findOne({
      role: "admin",
    });
    const ownerEmail = user.username;
    let html = `<h1>Thông báo: có khách hàng yêu cầu tư vấn đặt tour</h1>
      <h2>Yêu cầu lúc: ${getLocalTimeString(new Date())}</h2>
      <br>
      <h3>Thông tin tour</h3>
      <ul>
        <li>Tên tour: ${tourName} [${tourCode}]</li>
        <li>Giá tour: ${tourPrice}</li>
        <li>URL: <a href="${tourUrl}">${tourUrl}</a></li>
      </ul>
      <br>
      <h3>Thông tin khách hàng</h3>
      <ul>
        <li>Họ: ${firstname}</li>
        <li>Tên: ${surname}</li>
        <li>SĐT: ${phone}</li>
        <li>Giới tính: ${gender}</li>
      </ul>`;

    const config = {
      to: ownerEmail,
      subject: "Thông báo: có khách hàng yêu cầu tư vấn đặt tour",
      text: "Thông báo: có khách hàng yêu cầu tư vấn đặt tour",
      html: html,
    };

    await sendMail(config);

    return res.status(200).json({
      message: {
        en: "Thành công",
        vi: "Thành công",
      },
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

// count views
const tourViews = new Map([]);
let i = 0;
const CACHE_EXPIRATION = require("../../middlewares/cache.middleware");
setInterval(async () => {
  if (i === 61) {
    i = 0;
  }
  const slugs = Array.from(tourViews.keys());
  await Promise.all(
    slugs.map((slug) =>
      Tour.findOneAndUpdate(
        { slug },
        {
          $inc: {
            views_count: tourViews.get(slug).size,
          },
        }
      )
    )
  );

  tourViews.clear();
}, CACHE_EXPIRATION * 1000);

module.exports.countTourViews = (req, res, next) => {
  const userIp = req.header("x-forwarded-to") || req.connection.remoteAddress;
  const slug = req.params.slug;

  if (!tourViews.has(slug)) {
    tourViews.set(slug, new Set([userIp]));
  } else {
    tourViews.set(slug, tourViews.get(slug).add(userIp));
  }
  next();
};
