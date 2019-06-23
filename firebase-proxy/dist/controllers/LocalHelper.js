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
const firestore_1 = require("@google-cloud/firestore");
const grpc = require("@grpc/grpc-js");
// Create a new client
const firestore = new firestore_1.Firestore({
    servicePath: "localhost",
    port: 8080,
    projectId: "firebase-explorer-test",
    sslCreds: grpc.credentials.createInsecure(),
    customHeaders: {
        Authorization: "Bearer owner"
    }
});
exports.handleLocalQuery = (query) => __awaiter(this, void 0, void 0, function* () {
    let data = {};
    const db = firestore;
    const rootCollectionRefs = yield db.listCollections();
    const datum = rootCollectionRefs.map(collectionListRef => {
        return {
            id: collectionListRef.id,
            path: collectionListRef.path
        };
    });
    data["success"] = true;
    data["data"] = datum;
    return data;
});
//# sourceMappingURL=LocalHelper.js.map