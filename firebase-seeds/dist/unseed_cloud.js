"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const movies_1 = require("./movies");
const grpc = require("@grpc/grpc-js");
const firestoreApp = new firestore_1.Firestore({
    keyFilename: "./FirebaseAdminConfig.json",
});
console.log("Delete movies from cloud firestore");
movies_1.deleteFromFirebase(firestoreApp);
//# sourceMappingURL=unseed_cloud.js.map