import { LocalQuery } from "../models/Commands";
import { Firestore } from "@google-cloud/firestore";
const grpc = require("@grpc/grpc-js");

export const generateFirestoreEmulatedInstance = (projectId: string) => {
  return new Firestore({
    servicePath: "localhost",
    port: 8080,
    projectId,
    sslCreds: grpc.credentials.createInsecure(),
    customHeaders: {
      Authorization: "Bearer owner"
    }
  });
};
