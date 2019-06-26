import express, { Response, Request, NextFunction } from "express";
var bodyParser = require("body-parser");
var cors = require("cors");
import * as commandsController from "./controllers/CommandsController";
import { jsonRouter } from "./json-db";

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: "application/json" }));
app.use("/api", jsonRouter);
app.set("port", process.env.PORT || 7000);
app.post("/command", commandsController.handler);
app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
