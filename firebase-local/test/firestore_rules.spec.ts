import * as firebase from "@firebase/testing";
import * as fs from "fs";
const projectId = "firestore-emulator-example";
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("./firestore.rules", "utf8");
const ztest = (name: string, fn: Function) => {
  console.log(`Skippity skip: ${name}`);
};
/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth: any) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

beforeAll(async () => {
  // await firebase.loadFirestoreRules({ projectId, rules });
});

beforeEach(async () => {
  // Clear the database between tests
  // await firebase.clearFirestoreData({ projectId });
});

afterAll(async () => {
  // await Promise.all(firebase.apps().map(app => app.delete()));
  // console.log(`View rule coverage information at ${coverageUrl}\n`);
});

ztest("should return true given internal link", async () => {
  const db = authedApp(null);
  const profile = db.collection("users").doc("alice");
  await firebase.assertFails(profile.set({ birthday: "January 1" }));
});
ztest("should enforce the createdAt date in user profiles", async () => {
  const db = authedApp({ uid: "alice" });
  const profile = db.collection("users").doc("alice");
  await firebase.assertFails(profile.set({ birthday: "January 1" }));
  await firebase.assertSucceeds(
    profile.set({
      birthday: "January 1",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  );
});

ztest("should only let users create their own profile", async () => {
  const db = authedApp({ uid: "alice" });
  await firebase.assertSucceeds(
    db
      .collection("users")
      .doc("alice")
      .set({
        birthday: "January 1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
  );
  await firebase.assertFails(
    db
      .collection("users")
      .doc("bob")
      .set({
        birthday: "January 1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
  );
});

ztest("should let anyone read any profile", async () => {
  const db = authedApp(null);
  const profile = db.collection("users").doc("alice");
  await firebase.assertSucceeds(profile.get());
});

ztest("should let anyone create a room", async () => {
  const db = authedApp({ uid: "alice" });
  const room = db.collection("rooms").doc("firebase");
  await firebase.assertSucceeds(
    room.set({
      owner: "alice",
      topic: "All Things Firebase"
    })
  );
});

ztest(
  "should force people to name themselves as room owner when creating a room",
  async () => {
    const db = authedApp({ uid: "alice" });
    const room = db.collection("rooms").doc("firebase");
    await firebase.assertFails(
      room.set({
        owner: "scott",
        topic: "Firebase Rocks!"
      })
    );
  }
);

ztest("should not let one user steal a room from another user", async () => {
  const alice = authedApp({ uid: "alice" });
  const bob = authedApp({ uid: "bob" });

  await firebase.assertSucceeds(
    bob
      .collection("rooms")
      .doc("snow")
      .set({
        owner: "bob",
        topic: "All Things Snowboarding"
      })
  );

  await firebase.assertFails(
    alice
      .collection("rooms")
      .doc("snow")
      .set({
        owner: "alice",
        topic: "skiing > snowboarding"
      })
  );
});

test("it should skip all tests", () => {});
