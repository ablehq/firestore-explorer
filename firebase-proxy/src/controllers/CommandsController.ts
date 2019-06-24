import { Response, Request } from "express";
import { Command, CommandNames } from "../models/Commands";
import { handleLocalQuery } from "./LocalHelper";
import { handleQuery } from "./QueryHelper";
import { handleQuery as listRootsQuery } from "./RootsHelper";

export const handler = async (req: Request, res: Response) => {
  const body: Command = req.body;
  let data = {};
  switch (body.name) {
    case CommandNames.QUERY:
      data = await handleQuery(body);
      break;
    case CommandNames.LOCAL:
      data = await handleLocalQuery(body);
      break;
    case CommandNames.LIST_ROOTS:
      data = await listRootsQuery(body);
      break;
    default:
      break;
  }
  res.json(data);
};
