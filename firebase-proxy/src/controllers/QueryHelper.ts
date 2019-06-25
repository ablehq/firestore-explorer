import { Query } from "../models/Commands";
import { generateFirestoreEmulatedInstance } from "../models/FirebaseProxy";
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
  CollectionReference
} from "@google-cloud/firestore";

export const handleQuery = async ({ payload: { server, query } }: Query) => {
  let data: { [key: string]: any } = {};
  switch (server.type) {
    case "emulated":
      const db = generateFirestoreEmulatedInstance(server.projectId);
      try {
        const result = await eval(query);
        let datum = {};
        let resultType = "";
        let res:
          | DocumentSnapshot
          | QueryDocumentSnapshot
          | QuerySnapshot
          | Array<CollectionReference>
          | null = null;
        console.log(result);
        switch (result.constructor.name) {
          case "DocumentSnapshot":
            resultType = "DocumentSnapshot";
            res = result as DocumentSnapshot;
            datum = {
              id: res.id,
              path: res.ref.path,
              data: res.data()
            };
            break;
          case "QueryDocumentSnapshot":
            resultType = "QueryDocumentSnapshot";
            res = result as QueryDocumentSnapshot;
            datum = {
              id: res.id,
              path: res.ref.path,
              data: res.data()
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
                data: item.data()
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
                    path: item.path
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
      break;
    case "cloud":
      break;
    default:
      break;
  }
  return data;
};
