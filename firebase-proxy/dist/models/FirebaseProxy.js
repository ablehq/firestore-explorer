"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const grpc = require("@grpc/grpc-js");
const fs = __importStar(require("fs"));
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
exports.generateCloudEmulatedInstance = (server) => {
    const fileName = `server-${server.id}.json`;
    const filePath = `data/${fileName}`;
    const exists = fs.existsSync(filePath);
    if (!exists) {
        fs.writeFileSync(filePath, JSON.stringify(server.config));
    }
    return new firestore_1.Firestore({
        keyFilename: filePath
    });
};
//# sourceMappingURL=FirebaseProxy.js.map