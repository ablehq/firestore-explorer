"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseProxy_1 = require("../models/FirebaseProxy");
const json_db_1 = require("../json-db");
exports.handleQuery = ({ payload: { server, query } }) => __awaiter(this, void 0, void 0, function* () {
    let data = {};
    const localServer = json_db_1.db
        .get("servers")
        .find({ id: server })
        .value();
    if (localServer) {
        const serverType = localServer.type;
        let db = null;
        switch (serverType) {
            case "emulated":
                const serverProjectId = localServer.projectId;
                db = FirebaseProxy_1.generateFirestoreEmulatedInstance(serverProjectId);
                break;
            case "cloud":
                db = FirebaseProxy_1.generateCloudEmulatedInstance(localServer);
                break;
            default:
                break;
        }
        if (db) {
            try {
                const result = yield safeEvalQuery(db, query);
                let datum = {};
                let resultType = "";
                let res = null;
                switch (result.constructor.name) {
                    case "DocumentSnapshot":
                        resultType = "DocumentSnapshot";
                        res = result;
                        datum = {
                            id: res.id,
                            path: res.ref.path,
                            data: res.data(),
                        };
                        break;
                    case "QueryDocumentSnapshot":
                        resultType = "QueryDocumentSnapshot";
                        res = result;
                        datum = {
                            id: res.id,
                            path: res.ref.path,
                            data: res.data(),
                        };
                        break;
                    case "QuerySnapshot":
                        resultType = "QuerySnapshot";
                        res = result;
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
                                res = result;
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
            }
            catch (error) {
                data["success"] = false;
                data["error"] = `${error}`;
            }
        }
    }
    else {
        data["success"] = false;
        data["error"] = `Server with id ${server} not found`;
    }
    return data;
});
const safeEvalQuery = (firestore, query) => __awaiter(this, void 0, void 0, function* () {
    const db = firestore;
    const result = yield eval(query);
    return result;
});
//# sourceMappingURL=QueryHelper.js.map