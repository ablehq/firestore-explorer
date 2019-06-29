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
const Commands_1 = require("../models/Commands");
const LocalHelper_1 = require("./LocalHelper");
const QueryHelper_1 = require("./QueryHelper");
const RootsHelper_1 = require("./RootsHelper");
exports.handler = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const body = req.body;
    let data = {};
    switch (body.name) {
        case Commands_1.CommandNames.QUERY:
            data = yield QueryHelper_1.handleQuery(body);
            break;
        case Commands_1.CommandNames.LOCAL:
            data = yield LocalHelper_1.handleLocalQuery(body);
            break;
        case Commands_1.CommandNames.LIST_ROOTS:
            data = yield RootsHelper_1.handleQuery(body);
            break;
        default:
            break;
    }
    res.json(data);
});
//# sourceMappingURL=CommandsController.js.map