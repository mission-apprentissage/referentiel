const { dbCollection } = require("../../common/db/mongodb");
const Boom = require("boom");
module.exports = () => {
  return async (req, res, next) => {
    const user = req.user;
    const siret = req.params.siret;

    try {
      const organisme = await dbCollection("organismes").findOne({
        siret,
        ...(user.isAdmin ? {} : { [`adresse.${user.type}.code`]: user.code }),
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
