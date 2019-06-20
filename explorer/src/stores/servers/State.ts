export interface BaseServer {
  readonly id: string;
  readonly type: "emulated" | "cloud";
  readonly name: string;
  readonly color: string;
  readonly roots: Array<string>;
}

export interface EmulatedServer extends BaseServer {
  readonly type: "emulated";
  readonly isEmulated: boolean;
  readonly projectId: string;
  readonly appId: string;
}

export interface CloudServer extends BaseServer {
  readonly type: "cloud";
  readonly config: object;
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
  config: object,
  roots: Array<string> = [],
  id: string = "temp"
): CloudServer {
  return {
    id: id,
    type: "cloud",
    name,
    color,
    config,
    isCloud: true,
    roots: roots
  };
};
