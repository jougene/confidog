"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cast = void 0;
const possibleTrue = ['true', 'TRUE', '1', true];
const possibleFalse = ['false', 'FALSE', '0', false];
exports.cast = (type, value) => {
    switch (type) {
        case 'String':
            return value ? String(value) : value;
        case 'Number':
            return value ? Number(value) : value;
        case 'Boolean':
            if (possibleTrue.includes(value))
                return true;
            if (possibleFalse.includes(value))
                return false;
            return undefined;
        default:
            return value;
    }
};
//# sourceMappingURL=typecaster.js.map