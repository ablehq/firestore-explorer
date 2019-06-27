import { Query } from "../models/Commands";
import {
  generateFirestoreEmulatedInstance,
  generateCloudEmulatedInstance,
} from "../models/FirebaseProxy";
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
  CollectionReference,
  Firestore,
} from "@google-cloud/firestore";
import { db } from "../json-db";
import { Server, EmulatedServer, CloudServer } from "../models/Server";
export const handleQuery = async ({ payload: { server, query } }: Query) => {
  let data: { [key: string]: any } = {};
  const localServer: Server | undefined = db
    .get("servers")
    .find({ id: server })
    .value();
  if (localServer) {
    const serverType = localServer.type;
    let db = null;
    switch (serverType) {
      case "emulated":
        const serverProjectId = (localServer as EmulatedServer).projectId;
        db = generateFirestoreEmulatedInstance(serverProjectId);
        break;
      case "cloud":
        db = generateCloudEmulatedInstance(localServer as CloudServer);
        break;
      default:
        break;
    }
    if (db) {
      try {
        const result = await safeEvalQuery(db, query);
        let datum = {};
        let resultType = "";
        let res:
          | DocumentSnapshot
          | QueryDocumentSnapshot
          | QuerySnapshot
          | Array<CollectionReference>
          | null = null;
        switch (result.constructor.name) {
          case "DocumentSnapshot":
            resultType = "DocumentSnapshot";
            res = result as DocumentSnapshot;
            datum = {
              id: res.id,
              path: res.ref.path,
              data: res.data(),
            };
            break;
          case "QueryDocumentSnapshot":
            resultType = "QueryDocumentSnapshot";
            res = result as QueryDocumentSnapshot;
            datum = {
              id: res.id,
              path: res.ref.path,
              data: res.data(),
            };
            break;
          case "QuerySnapshot":
            resultType = "QuerySnapshot";
            res = result as QuerySnapshot;
            datum = res.docs.map(item => {
              return {
                id: item.id,
                path: item.ref.path,
                parent: item.ref.parent.path,
                data: item.data(),
              };
            });
            break;
          case "Array":
            if (result && result.length > 0) {
              resultType = "CollectionArray";
              // check the first item and figure out the type
              if (result[0].constructor.name === "CollectionReference") {
                res = result as Array<CollectionReference>;
                datum = res.map(item => {
                  return {
                    id: item.id,
                    path: item.path,
                  };
                });
              }
            }
            break;
        }
        data["queryId"] = `${Date.now()}`;
        data["success"] = true;
        data["type"] = resultType;
        data["data"] = datum;
      } catch (error) {
        data["success"] = false;
        data["error"] = `${error}`;
      }
    }
  } else {
    data["success"] = false;
    data["error"] = `Server with id ${server} not found`;
  }
  return data;
};

const safeEvalQuery = async (firestore: Firestore, query: string) => {
  const db = firestore;
  const result = await eval(query);
  return result;
};
