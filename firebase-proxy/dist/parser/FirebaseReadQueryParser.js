"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acorn_1 = require("acorn");
const _1 = require("./");
const xstate_1 = require("xstate");
const walk = require("acorn-walk");
exports.parse = (code) => {
    try {
        let fsm = xstate_1.interpret(_1.fsmGenerator()).start();
        const ast = acorn_1.Parser.parse(code);
        let currentNode = null;
        walk.simple(ast, {
            Identifier(node) {
                currentNode = node;
                try {
                    fsm.send({
                        type: node.name,
                        node: node
                    });
                }
                catch (error) { }
            },
            CallExpression(node) {
                currentNode = node;
                let property = currentNode.callee.property;
                if (property) {
                    let identifier = property;
                    if (identifier.name) {
                        try {
                            fsm.send({
                                type: identifier.name,
                                node: node
                            });
                        }
                        catch (error) { }
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
            error: `Expected ${fsm.state.nextEvents.join(" or ")} at ${fsm.state.context.parsedUntilIndex}`
        };
    }
    catch (error) {
        return {
            succeeded: false,
            error: error.message
        };
    }
};
//# sourceMappingURL=FirebaseReadQueryParser.js.map