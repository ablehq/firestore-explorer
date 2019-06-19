"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseEmulated = __importStar(require("@firebase/testing"));
const handleQuery = ({ payload: { server, query } }) => __awaiter(this, void 0, void 0, function* () {
    let data = {};
    switch (server.type) {
        case "emulated":
            const app = firebaseEmulated.initializeAdminApp({
                databaseName: server.appId,
                projectId: server.projectId,
            });
            if (app) {
                const db = app.firestore();
                try {
                    const result = yield eval(query);
                    let datum = {};
                    switch (result.constructor.name) {
                        case "DocumentSnapshot":
                            datum = {
                                docId: result.id,
                                data: result.data(),
                            };
                            break;
                        case "QuerySnapshot":
                            datum = result.docs.map((item) => {
                                return {
                                    docId: item.id,
                                    data: item.data(),
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
        default:
            break;
    }
    res.json(data);
});
//# sourceMappingURL=commands.js.map