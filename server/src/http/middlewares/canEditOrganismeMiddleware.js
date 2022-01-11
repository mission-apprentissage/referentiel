const { dbCollection } = require("../../common/db/mongodb");
const Boom = require("boom");
module.exports = () => {
  return async (req, res, next) => {
    let user = req.user;
    let siret = req.params.siret;

    try {
      let organisme = await dbCollection("organismes").findOne({
        siret,
        [`adresse.${user.type}.code`]: user.code,
      });

      if (!organisme) {
        next(Boom.badRequest("Vous ne pouvez pas modifier cet organisme"));
      } else {
        req.organisme = organisme;
        next();
      }
    } catch (e) {
      //Force the async routes to be handled by the error middleware
      return next(e);
    }
  };
};
