import { Server } from "./Server";

export const enum CommandNames {
  QUERY = "query",
  LOCAL = "local"
}

export interface Query {
  name: CommandNames.QUERY;
  payload: {
    server: Server;
    query: string;
  };
}

export interface LocalQuery {
  name: CommandNames.LOCAL;
}

export type Command = Query | LocalQuery;
