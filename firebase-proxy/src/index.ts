import express, { Response, Request, NextFunction } from "express";
var bodyParser = require("body-parser");
import * as commandsController from "./controllers/commands";

const app = express();
app.use(bodyParser.json({ type: "application/json" }));

app.set("port", process.env.PORT || 7000);
app.post("/command", commandsController.commandsHandler);
app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env"),
  );
  console.log("  Press CTRL-C to stop\n");
});
