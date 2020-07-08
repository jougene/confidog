type BuiltInTypes = 'String' | 'Number' | 'Boolean';

const possibleTrue = ['true', 'TRUE', '1', true];
const possibleFalse = ['false', 'FALSE', '0', false];

export const cast = (type: BuiltInTypes, value: any) => {
    switch (type) {
        case 'String':
            return value ? String(value) : value;
        case 'Number':
            return value ? Number(value) : value;
        case 'Boolean':
            if (possibleTrue.includes(value)) return true;
            if (possibleFalse.includes(value)) return false;
            return undefined;
        default:
            return value;
    }
};
