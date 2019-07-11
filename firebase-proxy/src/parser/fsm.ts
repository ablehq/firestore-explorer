import { Machine, assign } from "xstate";
import { Identifier, CallExpression } from "estree";

export interface ParserStateSchema {
  states: {
    none: {};
    db: {};
    collection: {};
    limit: {};
    orderBy: {};
    select: {};
    where: {};
    listCollections: {};
    doc: {};
    get: {};
  };
}

export type ParsedEvent =
  | { type: "db"; node?: Identifier | CallExpression }
  | { type: "collection"; node?: Identifier | CallExpression }
  | { type: "limit"; node?: Identifier | CallExpression }
  | { type: "doc"; node?: Identifier | CallExpression }
  | { type: "listCollections"; node?: Identifier | CallExpression }
  | { type: "where"; node?: Identifier | CallExpression }
  | { type: "select"; node?: Identifier | CallExpression }
  | { type: "orderBy"; node?: Identifier | CallExpression }
  | { type: "get"; node?: Identifier | CallExpression };

export interface ParsingContext {
  parsedUntilIndex: 0;
}
const processNode = assign<ParsingContext>({
  parsedUntilIndex: (ctx, event: ParsedEvent) => {
    if (event.node) {
      return (event.node as any).end;
    }
    return 0;
  }
});

export const fsmGenerator = () =>
  Machine<ParsingContext, ParserStateSchema, ParsedEvent>(
    {
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
    },
    {
      actions: {
        processNode
      }
    }
  );
