import * as firebase from "@firebase/testing";
import { FirebaseAuth } from "./models";
import { seedToFirebase } from "./movies";

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth: FirebaseAuth, projectId: string) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}
const firebaseApp = authedApp(
  {
    uid: "firebase-explorer",
    name: "Firebase Explorer"
  },
  "firebase-explorer-test"
);
seedToFirebase(firebaseApp);
