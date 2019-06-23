import { Response, Request } from "express";
import { Query, Command, CommandNames } from "../models/Commands";
import { handleLocalQuery } from "./LocalHelper";
import { generateFirestoreEmulatedInstance } from "../models/FirebaseProxy";

const handleQuery = async ({ payload: { server, query } }: Query) => {
  let data: { [key: string]: any } = {};
  switch (server.type) {
    case "emulated":
      const db = generateFirestoreEmulatedInstance(server.projectId);
      try {
        const result = await eval(query);
        let datum = {};
        switch (result.constructor.name) {
          case "DocumentSnapshot":
            datum = {
              docId: result.id,
              data: result.data()
            };
            break;
          case "QuerySnapshot":
            datum = result.docs.map((item: any) => {
              return {
                docId: item.id,
                data: item.data()
              };
            });
            break;
        }
        data["success"] = true;
        data["data"] = datum;
      } catch (error) {
        data["success"] = false;
        data["error"] = `${error}`;
      }
      break;
    case "cloud":
      break;
    default:
      break;
  }
  return data;
};

export let commandsHandler = async (req: Request, res: Response) => {
  const body: Command = req.body;
  let data = {};
  switch (body.name) {
    case CommandNames.QUERY:
      data = await handleQuery(body);
      break;
    case CommandNames.LOCAL:
      data = await handleLocalQuery(body);
      break;
    default:
      break;
  }
  res.json(data);
};
