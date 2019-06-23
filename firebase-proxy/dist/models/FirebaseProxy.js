"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const grpc = require("@grpc/grpc-js");
exports.generateFirestoreEmulatedInstance = (projectId) => {
    return new firestore_1.Firestore({
        servicePath: "localhost",
        port: 8080,
        projectId,
        sslCreds: grpc.credentials.createInsecure(),
        customHeaders: {
            Authorization: "Bearer owner"
        }
    });
};
//# sourceMappingURL=FirebaseProxy.js.map