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
const LocalHelper_1 = require("./LocalHelper");
const FirebaseProxy_1 = require("../models/FirebaseProxy");
const handleQuery = ({ payload: { server, query } }) => __awaiter(this, void 0, void 0, function* () {
    let data = {};
    switch (server.type) {
        case "emulated":
            const db = FirebaseProxy_1.generateFirestoreEmulatedInstance(server.projectId);
            try {
                const result = yield eval(query);
                let datum = {};
                switch (result.constructor.name) {
                    case "DocumentSnapshot":
                        datum = {
                            docId: result.id,
                            data: result.data()
                        };
                        break;
                    case "QuerySnapshot":
                        datum = result.docs.map((item) => {
                            return {
                                docId: item.id,
                                data: item.data()
                            };
                        });
                        break;
                }
                data["success"] = true;
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
exports.commandsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const body = req.body;
    let data = {};
    switch (body.name) {
        case "query" /* QUERY */:
            data = yield handleQuery(body);
            break;
        case "local" /* LOCAL */:
            data = yield LocalHelper_1.handleLocalQuery(body);
            break;
        default:
            break;
    }
    res.json(data);
});
//# sourceMappingURL=Commands.js.map