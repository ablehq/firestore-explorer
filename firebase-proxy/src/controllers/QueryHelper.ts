import { Query } from "../models/Commands";
import { generateFirestoreEmulatedInstance } from "../models/FirebaseProxy";

export const handleQuery = async ({ payload: { server, query } }: Query) => {
  let data: { [key: string]: any } = {};
  switch (server.type) {
    case "emulated":
      const db = generateFirestoreEmulatedInstance(server.projectId);
      try {
        const result = await eval(query);
        console.log(result);
        let datum = {};
        switch (result.constructor.name) {
          case "DocumentSnapshot":
            datum = {
              docId: result.id,
              data: result.data(),
            };
            break;
          case "QuerySnapshot":
            datum = result.docs.map((item: any) => {
              return {
                id: item.id,
                path: item.path,
                data: item.data(),
              };
            });
            break;
        }
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
