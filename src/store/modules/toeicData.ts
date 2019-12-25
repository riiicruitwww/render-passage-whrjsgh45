
export interface ToeicData {
    toeicPart6s: Array<ToeicPart6>,
    pageState: string,
    chooseInfo: Array<ChooseData>
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

export interface ChooseData {
    click: boolean,
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
        chooseInfo: Array<ChoiceArea>
    }
}

interface UpdateChooseInfo {
    type: typeof UPDATE_CHOOSE_INFO;
    meta: {
        chooseInfo: Array<ChoiceArea>
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

function createChooseInfo(chooseInfo: Array<ChooseData>) {

    return {
        type: CREATE_CHOOSE_INFO,
        meta: {
            chooseInfo: chooseInfo
        }
    }
}

function updateChooseInfo(chooseInfo: Array<ChooseData>) {

    return {
        type: UPDATE_CHOOSE_INFO,
        meta: {
            chooseInfo: chooseInfo
        }
    }
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
    chooseInfo: []
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
                chooseInfo: action.meta.chooseInfo
            };
        case UPDATE_CHOOSE_INFO:
            return {
                ...state,
                chooseInfo: action.meta.chooseInfo
            };
        default:
            return state;
    }
}