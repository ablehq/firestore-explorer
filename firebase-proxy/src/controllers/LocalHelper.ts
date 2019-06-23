import { LocalQuery } from "../models/Commands";
import { Firestore } from "@google-cloud/firestore";
const grpc = require("@grpc/grpc-js");
// Create a new client
const firestore = new Firestore({
  servicePath: "localhost",
  port: 8080,
  projectId: "firebase-explorer-test",
  sslCreds: grpc.credentials.createInsecure(),
  customHeaders: {
    Authorization: "Bearer owner"
  }
});

export const handleLocalQuery = async (query: LocalQuery) => {
  let data: { [key: string]: any } = {};
  const db = firestore;
  const rootCollectionRefs = await db.listCollections();
  const datum = rootCollectionRefs.map(collectionListRef => {
    return {
      id: collectionListRef.id,
      path: collectionListRef.path
    };
  });
  data["success"] = true;
  data["data"] = datum;
  return data;
};
