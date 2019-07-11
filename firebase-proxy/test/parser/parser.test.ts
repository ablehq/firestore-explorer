import { parse } from "../../src/parser";
describe("Parsing basics", () => {
  const expressionWithoutDB = `collection('movies').orderBy('name asc').limit(10).get()`;

  test("it should fail when the code string is 'hello world'", async done => {
    const resp = parse("hello world");
    expect(resp.succeeded).toBe(false);
    done();
  });
  test("it should fail when the code string is 'hello world'", async done => {
    const resp = parse("hello world");
    expect(resp.succeeded).toBe(false);
    done();
  });
  test(`It should fail to parse ${expressionWithoutDB}`, async done => {
    const resp = parse(expressionWithoutDB);
    expect(resp.succeeded).toBe(false);
    expect(resp.error).toBe("Expected db at 0");
    done();
  });
});

describe("Collection Queries", () => {
  const collectionWithoutLimit = `db.collection('movie')`;
  test(`It should fail to parse ${collectionWithoutLimit}`, async done => {
    const resp = parse(collectionWithoutLimit);
    expect(resp.succeeded).toBe(false);
    expect(resp.error).toBe(
      "Expected limit or orderBy or select or where at 22",
    );
    done();
  });
  const collectionWithoutGet = `db.collection('movie').limit(10)`;
  test(`It should fail to parse ${collectionWithoutGet}`, async done => {
    const resp = parse(collectionWithoutGet);
    expect(resp.succeeded).toBe(false);
    expect(resp.error).toBe("Expected get at 32");
    done();
  });
  const simpleCollectionQuery = `db.collection('movie').limit(10).get()`;
  test(`It should successgfully parse ${simpleCollectionQuery}`, async done => {
    const resp = parse(simpleCollectionQuery);
    expect(resp.succeeded).toBe(true);
    done();
  });
});
