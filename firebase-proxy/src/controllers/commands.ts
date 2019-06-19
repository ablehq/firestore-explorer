import { Response, Request } from "express";
import * as firebaseEmulated from "@firebase/testing";
export interface BaseServer {
  readonly type: "emulated" | "cloud";
  readonly projectId: string;
  readonly appId: string;
  readonly roots: Array<string>;
}

export interface EmulatedServer extends BaseServer {
  readonly type: "emulated";
  readonly isEmulated: boolean;
}

export interface CloudServer extends BaseServer {
  readonly type: "cloud";
  readonly apiKey: string;
  readonly authDomain: string;
  readonly databaseURL: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly isCloud: boolean;
}

export type Server = EmulatedServer | CloudServer;

const enum CommandNames {
  QUERY = "query",
}

interface Query {
  name: CommandNames.QUERY;
  payload: {
    server: Server;
    query: string;
  };
}

type Command = Query;

const handleQuery = async ({ payload: { server, query } }: Query) => {
  let data: { [key: string]: any } = {};
  switch (server.type) {
    case "emulated":
      const app = firebaseEmulated.initializeAdminApp({
        databaseName: server.appId,
        projectId: server.projectId,
      });
      if (app) {
        const db = app.firestore();
        try {
          const result = await eval(query);
          let datum = {};
          switch (result.constructor.name) {
            case "DocumentSnapshot":
              datum = {
                docId: result.id,
                data: result.data(),
              };
              break;
            case "QuerySnapshot":
              datum = result.docs.map((item: any) => {
                return {
                  docId: item.id,
                  data: item.data(),
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

    default:
      break;
  }
  res.json(data);
};
