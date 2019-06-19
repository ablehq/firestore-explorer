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
  EXPLORE_APP = "explore_app",
}

interface ExploreAppCommand {
  name: CommandNames.EXPLORE_APP;
  payload: Server;
}

type Command = ExploreAppCommand;

const handleExploreApp = async (server: Server) => {
  let data: { [key: string]: any } = {};
  let rootsData: Array<{ [key: string]: any }> = [];
  switch (server.type) {
    case "emulated":
      const app = firebaseEmulated.initializeAdminApp({
        databaseName: server.appId,
        projectId: server.projectId,
      });
      if (app) {
        const promises = server.roots.map(root => {
          return app
            .firestore()
            .collection(root)
            .get()
            .then(data => ({
              root,
              data,
            }));
        });
        try {
          const snapshots = await Promise.all(promises);
          data["success"] = true;
          data["data"] = snapshots.map(item => ({
            root: item.root,
            size: item.data.size,
          }));
        } catch (error) {
          data["success"] = false;
          data["error"] = error;
        }
      }
    case "cloud":
    default:
      break;
  }
  return data;
};

export let commandsHandler = async (req: Request, res: Response) => {
  const body: Command = req.body;
  let data = {};
  switch (body.name) {
    case CommandNames.EXPLORE_APP:
      data = await handleExploreApp(body.payload);
      break;

    default:
      break;
  }
  res.json(data);
};
