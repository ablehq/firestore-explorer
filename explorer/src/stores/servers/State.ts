export interface BaseServer {
  readonly id: string;
  readonly type: "emulated" | "cloud";
  readonly name: string;
  readonly color: string;
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

export interface ServersState {
  servers: Array<Server>;
}

export const GenerateEmulatedServer = function(
  name: string,
  color: string,
  projectId: string,
  appId: string,
  roots: Array<string> = [],
  id: string = "temp"
): EmulatedServer {
  return {
    id: id,
    type: "emulated",
    name,
    projectId,
    appId,
    color,
    roots: roots,
    isEmulated: true
  };
};

export const GenerateCloudServer = function(
  name: string,
  color: string,
  projectId: string,
  appId: string,
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  storageBucket: string,
  messagingSenderId: string,
  roots: Array<string> = [],
  id: string = "temp"
): CloudServer {
  return {
    id: id,
    type: "cloud",
    name,
    projectId,
    appId,
    color,
    isCloud: true,
    apiKey,
    authDomain,
    databaseURL,
    storageBucket,
    messagingSenderId,
    roots: roots
  };
};
