export interface BaseServer {
  readonly type: "emulated" | "cloud";
  readonly name: string;
  readonly color: string;
  readonly projectId: string;
  readonly appId: string;
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
  appId: string
): EmulatedServer {
  return {
    type: "emulated",
    name,
    projectId,
    appId,
    color,
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
  messagingSenderId: string
): CloudServer {
  return {
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
    messagingSenderId
  };
};
