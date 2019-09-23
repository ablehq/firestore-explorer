import { interpret, Interpreter } from "xstate";
import { fsmGenerator } from "../../src/parser";
import {
  ParsedEvent,
  ParserStateSchema,
  ParsingContext
} from "../../src/parser/fsm";

describe("'none' transitions", () => {
  test(`it should be in none state initially`, () => {
    let fsm = interpret(fsmGenerator()).start();
    let initialState = fsm.initialState;
    expect(initialState.value).toBe("none");
    expect(initialState.nextEvents).toEqual(["db"]);
  });
  test(`it should transition to db state on dbEvent`, () => {
    let fsm = interpret(fsmGenerator()).start();
    const nextState = fsm.send({
      type: "db"
    });
    expect(nextState.value).toBe("db");
  });
});

describe("'db' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send("db");
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should have listCollections, collection and doc as next event when in db state", () => {
    expect(fsm.state.nextEvents).toEqual([
      "listCollections",
      "collection",
      "doc"
    ]);
  });
  test("it should transition to listCollections", async done => {
    fsm.onDone(() => {
      done();
    });
    const nextState = fsm.send(["listCollections"]);
    expect(nextState.nextEvents).toEqual([]);
  });
  test("it should transition to collection", () => {
    const nextState = fsm.send(["collection"]);
    expect(nextState.nextEvents).toEqual([
      "limit",
      "orderBy",
      "select",
      "where"
    ]);
  });
  test("it should transition to doc", () => {
    const nextState = fsm.send(["doc"]);
    expect(nextState.nextEvents).toEqual([
      "collection",
      "listCollections",
      "get"
    ]);
  });
});

describe("'collection' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "collection"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should transition to limit", () => {
    const nextState = fsm.send(["limit"]);
    expect(nextState.nextEvents).toEqual(["get"]);
  });
  test("it should transition to orderBy", () => {
    const nextState = fsm.send(["orderBy"]);
    expect(nextState.nextEvents).toEqual(["select", "limit"]);
  });
  test("it should transition to where", () => {
    const nextState = fsm.send(["where"]);
    expect(nextState.nextEvents).toEqual(["where", "orderBy", "limit"]);
  });
  test("it should transition to select", () => {
    const nextState = fsm.send(["select"]);
    expect(nextState.nextEvents).toEqual(["limit"]);
  });
});

describe("'limit' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "collection", "limit"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should transition to limit", async done => {
    fsm.onDone(() => {
      done();
    });
    const nextState = fsm.send(["get"]);
    expect(nextState.nextEvents).toEqual([]);
  });
});

describe("'orderBy' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "collection", "orderBy"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should transition to select", () => {
    const nextState = fsm.send(["select"]);
    expect(nextState.nextEvents).toEqual(["limit"]);
  });
  test("it should transition to limit", () => {
    const nextState = fsm.send(["limit"]);
    expect(nextState.nextEvents).toEqual(["get"]);
  });
});

describe("'select' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "collection", "select"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should transition to limit", () => {
    const nextState = fsm.send(["limit"]);
    expect(nextState.nextEvents).toEqual(["get"]);
  });
});

describe("'where' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "collection", "select"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should transition to limit", () => {
    const nextState = fsm.send(["limit"]);
    expect(nextState.nextEvents).toEqual(["get"]);
  });
  test("it should transition to select", () => {
    const nextState = fsm.send(["select"]);
    expect(nextState.nextEvents).toEqual(["limit"]);
  });
  test("it should transition to orderBy", () => {
    const nextState = fsm.send(["orderBy"]);
    expect(nextState.nextEvents).toEqual(["limit"]);
  });
});

describe("'listCollections' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "listCollections"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should not have any transitions", () => {
    expect(fsm.state.nextEvents).toEqual([]);
  });
});

describe("'doc' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "doc"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should transition to collection", () => {
    const nextState = fsm.send(["collection"]);
    expect(nextState.nextEvents).toEqual([
      "limit",
      "orderBy",
      "select",
      "where"
    ]);
  });
  test("it should transition to listCollections", () => {
    const nextState = fsm.send(["listCollections"]);
    expect(nextState.nextEvents).toEqual([]);
  });
  test("it should transition to get", () => {
    const nextState = fsm.send(["get"]);
    expect(nextState.nextEvents).toEqual([]);
  });
});

describe("'get' transitions", () => {
  let fsm: Interpreter<ParsingContext, ParserStateSchema, ParsedEvent> = null;
  beforeEach(() => {
    fsm = interpret(fsmGenerator()).start();
    fsm.send(["db", "doc", "get"]);
  });
  afterEach(() => {
    fsm.stop();
  });
  test("it should not have any transitions", () => {
    expect(fsm.state.nextEvents).toEqual([]);
  });
});
