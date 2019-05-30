import * as firebase from "@firebase/testing";
import * as fs from "fs";
const projectId = "firestore-emulator-example";
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("./firestore.rules", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth: any) {
    return firebase
        .initializeTestApp({ projectId, auth })
        .firestore();
}

beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
})

beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId });
});

afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
    console.log(`View rule coverage information at ${coverageUrl}\n`);
});

test("should return true given internal link", async () => {
    const db = authedApp(null);
    const profile = db.collection("users").doc("alice");
    await profile.set({ birthday: "January 1" });
});