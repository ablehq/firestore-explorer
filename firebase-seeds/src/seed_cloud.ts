import { Firestore } from "@google-cloud/firestore";
import { seedToFirebase } from "./movies";
const grpc = require("@grpc/grpc-js");

const firestoreApp = new Firestore({
  keyFilename: "./FirebaseAdminConfig.json",
});
let size = 100;
if (process.argv.length > 2) {
  size = Number.parseInt(process.argv[2]);
  console.log(`Seeding data of size ${size}`);
}
console.log("Seeding to cloud firestore");
seedToFirebase(firestoreApp, size);
