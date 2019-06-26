"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const movies_1 = require("./movies");
const grpc = require("@grpc/grpc-js");
const firestoreApp = new firestore_1.Firestore({
    keyFilename: "./FirebaseAdminConfig.json",
});
let size = 100;
if (process.argv.length > 2) {
    size = Number.parseInt(process.argv[2]);
    console.log(`Seeding data of size ${size}`);
}
movies_1.seedToFirebase(firestoreApp, size);
//# sourceMappingURL=cloud.js.map