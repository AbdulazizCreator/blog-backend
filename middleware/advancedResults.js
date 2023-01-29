const advancedResults =
  (model, populate, searchArr = []) =>
  async (req, res, next) => {
    let query;

    let reqQuery = { ...req.query };
    let search = req.query.search;

    let removeFields = ["select", "sort", "page", "limit", "search"];

    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(lte|lt|gte|gt|in)\b/g,
      (match) => `$${match}`
    );

    // All the datas
    const searchQuery = searchArr.map((el) => ({
      [el]: {
        $regex: search,
        $options: "i",
      },
    }));
    const resultQuery = { ...JSON.parse(queryStr), $or: searchQuery };
    console.log(resultQuery);
    query = model.find(resultQuery);

    // Select Fields
    if (req.query.select) {
      console.log("Select");
      let fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      let sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    const results = await query;

    let pagination = {};

    if (endIndex < total) {
      pagination.next = page + 1;
    }

    if (startIndex > 0) {
      pagination.prev = page - 1;
    }
    pagination.limit = limit;
    pagination.page = page;
    pagination.total = results.length;

    res.advancedResults = {
      pagination,
      data: results,
    };
    next();
  };

module.exports = advancedResults;
