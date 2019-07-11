import { Parser } from "acorn";
import { Identifier, CallExpression, MemberExpression } from "estree";
import { fsmGenerator } from "./";
import { interpret } from "xstate";
const walk = require("acorn-walk");

export type ParseResponse = {
  succeeded: boolean;
  error: string;
};
export const parse = (code: string): ParseResponse => {
  try {
    let fsm = interpret(fsmGenerator()).start();
    const ast = Parser.parse(code);
    let currentNode: Identifier | CallExpression = null;
    walk.simple(ast, {
      Identifier(node: Identifier) {
        currentNode = node;
        try {
          (fsm as any).send({
            type: node.name,
            node: node
          });
        } catch (error) {}
      },
      CallExpression(node: CallExpression) {
        currentNode = node;
        let property = (currentNode.callee as MemberExpression).property;
        if (property) {
          let identifier = property as Identifier;
          if (identifier.name) {
            try {
              (fsm as any).send({
                type: identifier.name,
                node: node
              });
            } catch (error) {}
          }
        }
      }
    });
    const isFSMInFinalState = fsm.state.nextEvents.length === 0;
    if (isFSMInFinalState) {
      return {
        succeeded: true,
        error: ""
      };
    }
    return {
      succeeded: false,
      error: `Expected ${fsm.state.nextEvents.join(" or ")} at ${
        fsm.state.context.parsedUntilIndex
      }`
    };
  } catch (error) {
    return {
      succeeded: false,
      error: error.message
    };
  }
};
