const jsonServer = require("json-server");
const jsonRouter = jsonServer.router("data/db.json");
const db = jsonRouter.db;
export { jsonRouter, db };
