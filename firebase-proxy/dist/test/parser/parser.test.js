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
const parser_1 = require("../../src/parser");
describe("Parsing basics", () => {
    const expressionWithoutDB = `collection('movies').orderBy('name asc').limit(10).get()`;
    test("it should fail when the code string is 'hello world'", (done) => __awaiter(this, void 0, void 0, function* () {
        const resp = parser_1.parse("hello world");
        expect(resp.succeeded).toBe(false);
        done();
    }));
    test("it should fail when the code string is 'hello world'", (done) => __awaiter(this, void 0, void 0, function* () {
        const resp = parser_1.parse("hello world");
        expect(resp.succeeded).toBe(false);
        done();
    }));
    test(`It should fail to parse ${expressionWithoutDB}`, (done) => __awaiter(this, void 0, void 0, function* () {
        const resp = parser_1.parse(expressionWithoutDB);
        expect(resp.succeeded).toBe(false);
        expect(resp.error).toBe("Expected db at 0");
        done();
    }));
});
describe("Collection Queries", () => {
    const collectionWithoutLimit = `db.collection('movie')`;
    test(`It should fail to parse ${collectionWithoutLimit}`, (done) => __awaiter(this, void 0, void 0, function* () {
        const resp = parser_1.parse(collectionWithoutLimit);
        expect(resp.succeeded).toBe(false);
        expect(resp.error).toBe("Expected limit or orderBy or select or where at 22");
        done();
    }));
    const collectionWithoutGet = `db.collection('movie').limit(10)`;
    test(`It should fail to parse ${collectionWithoutGet}`, (done) => __awaiter(this, void 0, void 0, function* () {
        const resp = parser_1.parse(collectionWithoutGet);
        expect(resp.succeeded).toBe(false);
        expect(resp.error).toBe("Expected get at 32");
        done();
    }));
    const simpleCollectionQuery = `db.collection('movie').limit(10).get()`;
    test(`It should successgfully parse ${simpleCollectionQuery}`, (done) => __awaiter(this, void 0, void 0, function* () {
        const resp = parser_1.parse(simpleCollectionQuery);
        expect(resp.succeeded).toBe(true);
        done();
    }));
});
//# sourceMappingURL=parser.test.js.map