const { program: cli } = require("commander");

cli.command("acce", "Import et gestion de la base de données ACCE", { executableFile: "jobs/acce/acceCli" });
cli.parse(process.argv);
