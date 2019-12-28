import {ChoiceArea, QuestionsData, ToeicPart6, Voca} from "../../store/modules/toeicData";

export const numberToABC = (number: string): string => {
    /*
        bType = S: square bracket => [ ], return '[a]';
        bType = C: curly brackets => { }, return '{a}';
        bType = P: parentheses => ( ), return '(a)';
        bType = '': not bracket, return 'a';
     */
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    return alphabet[Number(number)];
};