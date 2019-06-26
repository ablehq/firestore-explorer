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
exports.handleQuery = ({ payload: { server, query } }) => __awaiter(this, void 0, void 0, function* () {
    let data = {};
    switch (server.type) {
        case "emulated":
            const db = FirebaseProxy_1.generateFirestoreEmulatedInstance(server.projectId);
            try {
                const result = yield eval(query);
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
                            data: res.data()
                        };
                        break;
                    case "QueryDocumentSnapshot":
                        resultType = "QueryDocumentSnapshot";
                        res = result;
                        datum = {
                            id: res.id,
                            path: res.ref.path,
                            data: res.data()
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
                                data: item.data()
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
            }
            catch (error) {
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
});
//# sourceMappingURL=QueryHelper.js.map