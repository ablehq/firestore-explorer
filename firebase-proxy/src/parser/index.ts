import { parse as queryParser } from "./FirebaseReadQueryParser";
import { fsmGenerator as parserFsmGen } from "./fsm";
export const parse = queryParser;
export const fsmGenerator = parserFsmGen;
