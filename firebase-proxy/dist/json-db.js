"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonServer = require("json-server");
const jsonRouter = jsonServer.router("data/db.json");
exports.jsonRouter = jsonRouter;
const db = jsonRouter.db;
exports.db = db;
//# sourceMappingURL=json-db.js.map