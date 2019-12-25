import * as React from 'react';
import Exam from '../canvas/component/exam';
import Result from '../canvas/component/result';
import Loading from '../canvas/component/loading';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../store/modules';
import {
    ToeicPart6,
    QuestionsData,
    ChoiceArea,
    Voca,
    ChooseData,
    actionCreators as toeicActions
} from '../../store/modules/toeicData';

// MainContainer에서 시용하는 Redux 상태값 및 액션들
interface Props {
    toeicPart6s: Array<ToeicPart6>,
    chooseInfo: Array<ChooseData>,
    pageState: string,
    Actions: typeof toeicActions
}

/**
 *  MainContainer
 *      - TOEIC Part6 JSON 데이터를 가공 및 제어하는 여러 함수들을 정의
 *
 *  Function List (4)
 *      - createToeicData: Store에 있는 toeicPart6s를 채우기 위한 함수
 *      - updateChooseInfo: 채점의 필요한 데이터를 유저 액션의 따라 Update 해주는 함수
 *      - changePageState: Exam, Loading, Result 페이지를 보여주기 위한 페이지 상태 정보
 *      - jsonParser: Local 경로에 있는 JSON형태의 TOEIC데이터를 파싱하는 함수
 */
class MainContainer extends React.Component<Props> {

    render() {
        const { toeicPart6s, chooseInfo, pageState } = this.props;
        let contentArea: React.ReactElement;

        /**
         *  페이지 상태의 따른 페이지 전환 로직
         *  Exam(문제 푸는 Component), result(결과를 확인하는 Component), loading(로딩 UI를 보여주는 Component)
         *
         *  시나리오
         *      1. exam -> 문제를 다 풀고 채점하기 버튼 클릭 (state: exam -> loading)
         *      2. loading -> 로딩이 완료 되면 (state: loading -> result)
         *      3. result: 결과를 확인
         */
        if(pageState === 'exam') {
            contentArea = (
                <Exam
                    toeicPart6s={toeicPart6s}
                    chooseInfo={chooseInfo}
                    updateChooseInfo={this.updateChooseInfo}
                    changePageState={this.changePageState}
                />
            );
        } else if(pageState === 'result') {
            contentArea = (
                <Result
                    chooseInfo={chooseInfo}
                    toeicPart6s={toeicPart6s}
                />
            );
        } else if(pageState === 'loading') {
            contentArea= (
                <Loading
                    changePageState={this.changePageState}
                />
            );
        }

        return (
            <div>{contentArea}</div>
        );
    };

    componentWillMount(): void {
        this.createToeicData().catch(() => {console.log('[Create Error] TOEIC DATA ERROR')});
    }

    // sampleData 폴더에 있는 JSON 데이터를 asnyc/await을 통해 처리
    createToeicData = async (): Promise<void> => {

        const { Actions } = this.props;
        const toeicPart6s: Array<ToeicPart6> = [];
        const object = await fetch('../../sampleData/task_container.json');
        const jsonData = await object.json();

        // sampleData 폴더에 있는 Json 데이터에는 하나의 지문만 존재
        // 만약 여러 지문에 대한 문제가 존재 할 경우  jsonParser return 값을 ToeicPart6 -> Array<ToeicPart6>로 변경
        // ex) toeicPart6s = this.jsonParser(jsonData);
        toeicPart6s[0] = this.jsonParser(jsonData);

        let index = 0;
        const chooseInfo: Array<ChooseData> = [];
        let chooseData: ChooseData = {
            click: false,
            qId: '',
            chooseAnswer: '',
            correctAnswer: '',
            studyNode: '',
            answerValue: ''
        };

        // 문제에 대한 유저 액션 및 정답과 같은 기본 값 초기화
        for(let i=0; i<toeicPart6s.length; i++) {
            const questions = toeicPart6s[i].questions;
            for(let j=0; j<questions.length; j++) {
                chooseData = {
                    click: false,
                    qId: '',
                    chooseAnswer: '',
                    correctAnswer: '',
                    studyNode: '',
                    answerValue: ''
                };

                chooseData.click = false;
                chooseData.qId = questions[j].id;
                chooseData.chooseAnswer = '';
                chooseData.correctAnswer = questions[j].correctAnswer;
                chooseData.studyNode = questions[j].studyNote;

                const choiceInfo = questions[j].choiceArea;
                for(let k=0; k<choiceInfo.length; k++) {
                    const sample = ['a', 'b', 'c', 'd'];
                    if(sample[choiceInfo[k].number] === questions[j].correctAnswer) {
                        chooseData.answerValue = choiceInfo[k].numberValue;
                    }
                }

                chooseInfo[index++] = chooseData;
            }
        }

        // Store에 접근해서 State을 변경할 Action들
        Actions.createChooseInfo(chooseInfo);
        Actions.createPart6Questions(toeicPart6s);
    };

    updateChooseInfo = (chooseInfo: Array<ChooseData>): void => {
        const { Actions } = this.props;
        Actions.updateChooseInfo(chooseInfo);
    };

    changePageState = (state: string): void => {
        const { Actions } = this.props;
        Actions.changePageState(state);
    };

    jsonParser = (jsonData: object): ToeicPart6 => {

        let boxIdArray = [];
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
        return toeicPart6;
    };
}

export default connect(
    ({toeicData}: StoreState) => ({
        toeicPart6s: toeicData.toeicPart6s,
        pageState: toeicData.pageState,
        chooseInfo: toeicData.chooseInfo
    }),
    (dispatch) => ({
        Actions: bindActionCreators(toeicActions, dispatch)
    })
)(MainContainer);