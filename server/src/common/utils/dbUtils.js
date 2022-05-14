module.exports = {
  findAndPaginate: async (collection, query, options = {}) => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const total = await collection.count(query);

    return {
      find: collection
        .find(query, options.projection ? { projection: options.projection } : {})
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
};
