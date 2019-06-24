import { Query, Command, ListRoots } from "../models/Commands";
import { generateFirestoreEmulatedInstance } from "../models/FirebaseProxy";

export const handleQuery = async ({ payload: { server } }: ListRoots) => {
  let data: { [key: string]: any } = {};
  switch (server.type) {
    case "emulated":
      const db = generateFirestoreEmulatedInstance(server.projectId);
      try {
        const rootCollectionRefs = await db.listCollections();
        const datum = rootCollectionRefs.map(collectionListRef => {
          return {
            id: collectionListRef.id,
            path: collectionListRef.path,
          };
        });
        data["success"] = true;
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
