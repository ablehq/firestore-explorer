export interface BaseServer {
  readonly type: "emulated" | "cloud";
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
