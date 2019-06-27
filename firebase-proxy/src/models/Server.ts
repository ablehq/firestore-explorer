export interface BaseServer {
  readonly id: string;
  readonly type: "emulated" | "cloud";
  readonly name: string;
  readonly color: string;
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
