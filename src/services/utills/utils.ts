
const Utils = () => {

    const numberToABC = (number: string, bType: string): string => {
        /*
            bType = S: square bracket => [ ], return '[a]';
            bType = C: curly brackets => { }, return '{a}';
            bType = P: parentheses => ( ), return '(a)';
            bType = '': not bracket, return 'a';
         */
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        return bType === 'S' ? '[' + alphabet[Number(number)] + ']'
            : bType === 'C' ? '{' + alphabet[Number(number)] + '}'
                : bType === 'P' ? '(' + alphabet[Number(number)] + ')'
                    : alphabet[Number(number)];
    };

    return {
        numberToABC: (number: string, bType: string): string => {
            return numberToABC(number, bType);
        }
    }
};

export default Utils();