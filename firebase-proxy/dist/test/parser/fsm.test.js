"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const xstate_1 = require("xstate");
const parser_1 = require("../../src/parser");
describe("'none' transitions", () => {
    test(`it should be in none state initially`, () => {
        let fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
        let initialState = fsm.initialState;
        expect(initialState.value).toBe("none");
        expect(initialState.nextEvents).toEqual(["db"]);
    });
    test(`it should transition to db state on dbEvent`, () => {
        let fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
        const nextState = fsm.send({
            type: "db"
        });
        expect(nextState.value).toBe("db");
    });
});
describe("'db' transitions", () => {
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
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
    test("it should transition to listCollections", (done) => __awaiter(this, void 0, void 0, function* () {
        fsm.onDone(() => {
            done();
        });
        const nextState = fsm.send(["listCollections"]);
        expect(nextState.nextEvents).toEqual([]);
    }));
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
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
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
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
        fsm.send(["db", "collection", "limit"]);
    });
    afterEach(() => {
        fsm.stop();
    });
    test("it should transition to limit", (done) => __awaiter(this, void 0, void 0, function* () {
        fsm.onDone(() => {
            done();
        });
        const nextState = fsm.send(["get"]);
        expect(nextState.nextEvents).toEqual([]);
    }));
});
describe("'orderBy' transitions", () => {
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
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
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
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
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
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
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
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
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
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
    let fsm = null;
    beforeEach(() => {
        fsm = xstate_1.interpret(parser_1.fsmGenerator()).start();
        fsm.send(["db", "doc", "get"]);
    });
    afterEach(() => {
        fsm.stop();
    });
    test("it should not have any transitions", () => {
        expect(fsm.state.nextEvents).toEqual([]);
    });
});
//# sourceMappingURL=fsm.test.js.map