module.exports = {
  paginate: async (collection, query, options = {}) => {
    let total = await collection.count(query);
    let page = options.page || 1;
    let limit = options.limit || 10;
    let skip = (page - 1) * limit;

    return {
      find: collection
        .find(query, options.projection || {})
        .sort(options.sort || {})
        .skip(skip)
        .limit(limit),
      pagination: {
        page,
        resultats_par_page: limit,
        nombre_de_page: Math.ceil(total / limit) || 1,
        total,
      },
    };
  },
  paginateAggregationWithCursor: async (collection, pipeline, options = {}) => {
    let page = options.page || 1;
    let limit = options.limit || 10;
    let skip = (page - 1) * limit;

    // FIXME Check if it is possible to use $facet with cursor
    let results = await Promise.all([
      collection.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]).stream(),
      collection
        .aggregate([
          ...pipeline,
          { $count: "total" },
          {
            $addFields: {
              page,
              resultats_par_page: limit,
              nombre_de_page: { $ceil: { $divide: ["$total", limit] } },
            },
          },
        ])
        .toArray(),
    ]);

    return {
      cursor: results[0],
      pagination: results[1][0] || {
        nombre_de_page: 1,
        page: 1,
        resultats_par_page: 10,
        total: 0,
      },
    };
  },
};
