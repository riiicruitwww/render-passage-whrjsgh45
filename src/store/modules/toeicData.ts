
export interface ToeicData {
    toeicPart6s: Array<ToeicPart6>,
    pageState: string,
    choiceList: Array<Choice>
}

export interface ToeicPart6 {
    name: string,
    type: string,
    preview: string,
    questions: Array<QuestionsData>,
    voca: Array<Voca>
}

export interface QuestionsData {
    id: string,
    packType: string,
    passageBoxId: string,
    correctAnswer: string,
    order: string,
    choiceArea: Array<ChoiceArea>,
    studyNote: string
}

export interface ChoiceArea {
    number: string,
    numberValue: string
}

export interface Voca {
    word: string,
    meaning: string
}

export interface Choice {
    isSelected: boolean,
    qId: string,
    chooseAnswer: string,
    correctAnswer: string,
    studyNode: string,
    answerValue: string
}

export const CREATE_TOEIC_PART_6_QUESTIONS = 'toeicData/CREATE_TOEIC_PART_6_QUESTIONS';

export const CHANGE_PAGE_STATE = 'toeicData/CHANGE_PAGE_STATE';

export const CREATE_CHOOSE_INFO = 'toeicData/CREATE_CHOOSE_INFO';
export const UPDATE_CHOOSE_INFO = 'toeicData/UPDATE_CHOOSE_INFO';

interface CreateQuestionsAction {
    type: typeof CREATE_TOEIC_PART_6_QUESTIONS;
    meta: {
        toeicPart6s: Array<ToeicPart6>
    }
}

interface ChangePageState {
    type: typeof CHANGE_PAGE_STATE;
    meta: {
        pageState: string
    }
}

interface CreateChooseInfo {
    type: typeof CREATE_CHOOSE_INFO;
    meta: {
        choiceList: Array<Choice>
    }
}

interface UpdateChooseInfo {
    type: typeof UPDATE_CHOOSE_INFO;
    meta: {
        qId: string,
        orderValue: string
    }
}

// Action 타입 선언
export type ActionTypes =
    | CreateQuestionsAction
    | ChangePageState
    | CreateChooseInfo
    | UpdateChooseInfo;

function createPart6Questions(toeicPart6s: Array<ToeicPart6>) {

    return {
        type: CREATE_TOEIC_PART_6_QUESTIONS,
        meta: {
            toeicPart6s: toeicPart6s
        }
    }
}

function changePageState(pageState: string) {

    return {
        type: CHANGE_PAGE_STATE,
        meta: {
            pageState: pageState
        }
    }
}

function createChooseInfo(choiceList: Array<Choice>) {

    return {
        type: CREATE_CHOOSE_INFO,
        meta: {
             choiceList: choiceList
        }
    }
}

function updateChooseInfo(qId: string, orderValue: string) {

    return {
        type: UPDATE_CHOOSE_INFO,
        meta: {
            qId: qId,
            orderValue: orderValue
        }
    }
}


export function jsonParser(jsonData: object): Array<ToeicPart6> {
    let boxIdArray = [];
    let ToeicPart6List: Array<ToeicPart6> = [];
    const toeicPart6: ToeicPart6 = {
        name: '',
        type: '',
        preview: '',
        questions: [],
        voca: []
    };

    for(let key in jsonData) {
        if(jsonData.hasOwnProperty(key)) {
            switch(key) {
                case 'name': toeicPart6.name = jsonData[key];
                    break;
                case 'type': toeicPart6.type = jsonData[key];
                    break;
                case 'preview': toeicPart6.preview = jsonData[key];
                    break;
                case 'questions': {
                    let index = 0, bIndex = 0;
                    let subJsonData = jsonData[key];
                    const questions: Array<QuestionsData> = [];
                    let data: QuestionsData = {
                        id: '',
                        packType: '',
                        passageBoxId: '',
                        correctAnswer: '',
                        order: '',
                        choiceArea: [],
                        studyNote: ''
                    };

                    for(let i=0; i<subJsonData.length; i++) {

                        data = {
                            id: '',
                            packType: '',
                            passageBoxId: '',
                            correctAnswer: '',
                            order: '',
                            choiceArea: [],
                            studyNote: ''
                        };

                        const subJsonDataValue = subJsonData[i];
                        for(let key in subJsonDataValue) {
                            if(subJsonDataValue.hasOwnProperty(key)) {
                                switch (key) {
                                    case 'id':
                                        data.id = subJsonDataValue[key];
                                        break;
                                    case 'pack_type':
                                        data.packType = subJsonDataValue[key];
                                        break;
                                    case 'passage_box_id': {
                                        data.passageBoxId = subJsonDataValue[key];
                                        boxIdArray[bIndex++] = subJsonDataValue[key];
                                    }
                                        break;
                                    case 'correct_answer':
                                        data.correctAnswer = subJsonDataValue[key];
                                        break;
                                    case 'order':
                                        data.order = subJsonDataValue[key];
                                        break;
                                    case 'view_tree': {
                                        let viewTree = subJsonDataValue[key];
                                        for(key in viewTree) {
                                            if(viewTree.hasOwnProperty(key)) {
                                                if(key === 'children') {
                                                    let children = viewTree[key];
                                                    for(let i=0; i<children.length; i++) {

                                                        let nameType = '';
                                                        let childrenJsonData = children[i];
                                                        for(key in childrenJsonData) {
                                                            if(childrenJsonData.hasOwnProperty(key)) {
                                                                if(key === 'name') {
                                                                    nameType = childrenJsonData[key];
                                                                }
                                                                else if(key === 'children') {

                                                                    if(nameType === 'blank')
                                                                    {
                                                                        let studyNote = '';
                                                                        const subChildren = childrenJsonData[key];
                                                                        for(let j=0; j<subChildren.length; j++) {
                                                                            let chunkId = '';
                                                                            const subChildrenJsonData = subChildren[j];
                                                                            for(key in subChildrenJsonData) {
                                                                                if(subChildrenJsonData.hasOwnProperty(key)) {
                                                                                    if(key === 'chunk_id') {
                                                                                        chunkId = subChildrenJsonData[key];
                                                                                        studyNote += jsonData['chunk_map'][chunkId]['text_en'];
                                                                                        studyNote += '\\n';
                                                                                        studyNote += jsonData['chunk_map'][chunkId]['text_kr'];
                                                                                    }
                                                                                }
                                                                            }
                                                                            studyNote += '\\n';
                                                                            studyNote += '\\n';
                                                                        }
                                                                        data.studyNote = studyNote;
                                                                    }
                                                                    else if(nameType === 'choice_area')
                                                                    {
                                                                        let cIndex = 0;
                                                                        const subChildren = childrenJsonData[key];
                                                                        for(let j=0; j<subChildren.length; j++) {
                                                                            let choiceArea: ChoiceArea = {
                                                                                number: '',
                                                                                numberValue: ''
                                                                            };
                                                                            const subChildrenJsonData = subChildren[j];
                                                                            for(key in subChildrenJsonData) {
                                                                                if(subChildrenJsonData.hasOwnProperty(key)) {
                                                                                    if(key === 'number') {
                                                                                        choiceArea.number = subChildrenJsonData[key];
                                                                                    } else if(key === 'children') {
                                                                                        const subSubChildren = subChildrenJsonData[key];
                                                                                        for(let k=0; k<subSubChildren.length; k++) {
                                                                                            const subSubChildrenJsonData = subSubChildren[k];
                                                                                            for(key in subSubChildrenJsonData) {
                                                                                                if(subSubChildrenJsonData.hasOwnProperty(key)) {
                                                                                                    if(key === 'children') {
                                                                                                        const subSubSubChildren = subSubChildrenJsonData[key];
                                                                                                        for(let l=0; l<subSubSubChildren.length; l++) {
                                                                                                            const subSubSubChildrenJsonData = subSubSubChildren[l];
                                                                                                            for(key in subSubSubChildrenJsonData) {
                                                                                                                if(subSubSubChildrenJsonData.hasOwnProperty(key)) {
                                                                                                                    if(key === 'chunk_id') {
                                                                                                                        const chunkId = subSubSubChildrenJsonData[key];
                                                                                                                        choiceArea.numberValue = jsonData['chunk_map'][chunkId]['text_en'];
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            data.choiceArea[cIndex++] = choiceArea;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        }
                                    }
                                        break;
                                }
                            }
                        }
                        questions[index++] = data;
                    }
                    toeicPart6.questions = questions;
                    boxIdArray = Array.from(new Set(boxIdArray));
                }
                    break;
                case 'passage_box': {
                    let index = 0;
                    let passagesIdList = [];
                    let subJsonData = jsonData[key];
                    const vocaList: Array<Voca> = [];
                    let data: Voca = { word: '', meaning: '' };

                    for(let key in subJsonData) {
                        if(subJsonData.hasOwnProperty(key)) {
                            if(key === 'passages') {

                                let passagesId = '';
                                let passageBoxId = '';
                                let subSubJsonData = subJsonData[key];

                                for(let i=0; i<subSubJsonData.length; i++) {

                                    let subSubJsonDataValue = subSubJsonData[i];
                                    for(let key in subSubJsonDataValue) {
                                        if(subSubJsonDataValue.hasOwnProperty(key)) {
                                            if(key === 'id') { passagesId = subSubJsonDataValue[key]; }
                                            else if(key == 'passage_box_id') { passageBoxId = subSubJsonDataValue[key]; }
                                        }
                                    }

                                    for(let j=0; j<boxIdArray.length; j++) {

                                        if(passageBoxId === boxIdArray[j]) {
                                            passagesIdList[index++] = passagesId;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    index = 0;
                    passagesIdList = Array.from(new Set(passagesIdList));
                    for(let key in subJsonData) {
                        if(subJsonData.hasOwnProperty(key)) {
                            if(key === 'vocabularies') {
                                let subSubJsonData = subJsonData[key];

                                for(let i=0; i<subSubJsonData.length; i++) {

                                    let passagesId = '';
                                    data = {word: '', meaning: ''};
                                    let subSubJsonDataValue = subSubJsonData[i];

                                    for(let key in subSubJsonDataValue) {
                                        if(subSubJsonDataValue.hasOwnProperty(key)) {
                                            if(key === 'passage_id') { passagesId = subSubJsonDataValue[key]; }
                                            else if(key === 'word') { data.word = subSubJsonDataValue[key]; }
                                            else if(key === 'meaning') { data.meaning = subSubJsonDataValue[key]; }
                                        }
                                    }

                                    for(let j=0; j<passagesIdList.length; j++) {
                                        if(passagesId === passagesIdList[j]) {
                                            vocaList[index++] = data;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    toeicPart6.voca = vocaList;
                }
                    break;
            }
        }
    }
    ToeicPart6List[0] = toeicPart6;
    return ToeicPart6List;
}

// Action 함수 정의
export const actionCreators = {
    createPart6Questions,
    changePageState,
    createChooseInfo,
    updateChooseInfo
};

// 기본값 초기화
const initialState: ToeicData = {
    toeicPart6s: [],
    pageState: 'exam',
    choiceList: []
};

export function toeicData(state = initialState, action: ActionTypes) {

    switch(action.type) {
        case CREATE_TOEIC_PART_6_QUESTIONS:
            return {
                ...state,
                toeicPart6s: action.meta.toeicPart6s
            };
        case CHANGE_PAGE_STATE:
            return {
                ...state,
                pageState: action.meta.pageState
            };
        case CREATE_CHOOSE_INFO:
            return {
                ...state,
                choiceList: action.meta.choiceList
            };
        case UPDATE_CHOOSE_INFO:
            return {
                ...state,
                choiceList: state.choiceList.map(key => {
                    if(key.qId === action.meta.qId) {
                        key.isSelected = true;
                        key.chooseAnswer = action.meta.orderValue
                    }

                    return key;
                })
            };
        default:
            return state;
    }
}