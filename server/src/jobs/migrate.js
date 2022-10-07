const { migrateMongodb, dbCollection } = require("../common/db/mongodb.js");
const { DateTime } = require("luxon");
const { oleoduc, writeData } = require("oleoduc");

const VERSION = 15;

async function migrate(options = {}) {
  const twoWeeksAgo = DateTime.now().minus({ day: 15 }).toJSDate();

  async function addDateMaj(path) {
    const { modifiedCount } = await dbCollection("organismes").updateMany(
      { [`${path}.0`]: { $exists: true } },
      {
        $set: {
          reseaux: [],
          [`${path}.$[].date_maj`]: twoWeeksAgo,
        },
      }
    );
    return modifiedCount;
  }

  async function updateAnomalies() {
    let modifiedCount = 0;

    await oleoduc(
      dbCollection("organismes")
        .find({ "_meta.anomalies": { $exists: true } })
        .stream(),
      writeData(async (organisme) => {
        const res = await dbCollection("organismes").updateOne(
          { _id: organisme._id },
          {
            $set: {
              "reseaux": [],
              "_meta.anomalies": organisme._meta.anomalies.map(({ date, ...rest }) => {
                return {
                  ...rest,
                  date_maj: date,
                };
              }),
            },
          }
        );
        modifiedCount += res.modifiedCount;
      })
    );

    return modifiedCount;
  }

  return migrateMongodb(
    VERSION,
    async () => {
      return {
        anomalies: await updateAnomalies(),
        uai_potentiels: await addDateMaj("uai_potentiels"),
        contacts: await addDateMaj("contacts"),
        relations: await addDateMaj("relations"),
        lieux_de_formation: await addDateMaj("lieux_de_formation"),
        certifications: await addDateMaj("certifications"),
        reset_reseaux: (await dbCollection("organismes").updateMany({}, { $set: { reseaux: [] } })).modifiedCount,
      };
    },
    options
  );
}

module.exports = migrate;
