"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("@firebase/testing");
const movies_1 = require("./movies");
const projectId = "firebase-explorer-test";
/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth, projectId) {
    return firebase.initializeTestApp({ projectId, auth }).firestore();
}
const firebaseApp = authedApp({
    uid: "firebase-explorer",
    name: "Firebase Explorer"
}, projectId);
console.log(`Project Id: ${projectId}`);
console.log(`App Id: ${firebaseApp.app.name}`);
console.log(firebaseApp.app.options);
movies_1.seedToFirebase(firebaseApp);
//# sourceMappingURL=main.js.map