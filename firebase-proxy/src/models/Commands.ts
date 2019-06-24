import { Server } from "./Server";

export const enum CommandNames {
  QUERY = "query",
  LOCAL = "local",
  LIST_ROOTS = "list_roots",
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
  payload: {};
}

export interface ListRoots {
  name: CommandNames.LIST_ROOTS;
  payload: {
    server: Server;
  };
}

export type Command = Query | LocalQuery | ListRoots;
