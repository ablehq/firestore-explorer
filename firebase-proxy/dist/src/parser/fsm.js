"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstate_1 = require("xstate");
const processNode = xstate_1.assign({
    parsedUntilIndex: (ctx, event) => {
        if (event.node) {
            return event.node.end;
        }
        return 0;
    }
});
exports.fsmGenerator = () => xstate_1.Machine({
    id: "parse_fsm",
    initial: "none",
    strict: true,
    context: {
        parsedUntilIndex: 0
    },
    states: {
        none: {
            on: {
                db: "db"
            }
        },
        db: {
            entry: ["processNode"],
            on: {
                listCollections: "listCollections",
                collection: "collection",
                doc: "doc"
            }
        },
        collection: {
            entry: ["processNode"],
            on: {
                limit: "limit",
                orderBy: "orderBy",
                select: "select",
                where: "where"
            }
        },
        limit: {
            entry: ["processNode"],
            on: {
                get: "get"
            }
        },
        orderBy: {
            entry: ["processNode"],
            on: {
                select: "select",
                limit: "limit"
            }
        },
        select: {
            entry: ["processNode"],
            on: {
                limit: "limit"
            }
        },
        where: {
            entry: ["processNode"],
            on: {
                where: "where",
                orderBy: "orderBy",
                limit: "limit"
            }
        },
        listCollections: {
            entry: ["processNode"],
            type: "final"
        },
        doc: {
            entry: ["processNode"],
            on: {
                collection: "collection",
                listCollections: "listCollections",
                get: "get"
            }
        },
        get: {
            entry: ["processNode"],
            type: "final"
        }
    }
}, {
    actions: {
        processNode
    }
});
//# sourceMappingURL=fsm.js.map