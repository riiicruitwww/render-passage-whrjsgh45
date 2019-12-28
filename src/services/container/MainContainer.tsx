import * as React from 'react';
import Exam from '../canvas/component/exam';
import Result from '../canvas/component/result';
import Loading from '../canvas/component/loading';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../store/modules';
import {
    ToeicPart6,
    Choice,
    actionCreators as toeicActions,
    jsonParser
} from '../../store/modules/toeicData';

// MainContainer에서 시용하는 Redux 상태값 및 액션들
interface Props {
    toeicPart6s: Array<ToeicPart6>,
    choiceList: Array<Choice>,
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
        const { toeicPart6s, choiceList, pageState } = this.props;
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
                    choiceList={choiceList}
                    updateChooseInfo={this.updateChooseInfo}
                    changePageState={this.changePageState}
                />
            );
        } else if(pageState === 'result') {
            contentArea = (
                <Result
                    choiceList={choiceList}
                    toeicPart6s={toeicPart6s}
                />
            );
        } else if(pageState === 'loading') {
            contentArea = (
                <Loading
                    changePageState={this.changePageState}
                />
            );
            this.endLoadingPage();
        }

        return (
            <div>{contentArea}</div>
        );
    };

    componentDidMount(): void {
        this.createToeicData()
            .then(() => this.createChoiceInfo())
            .catch(() => {console.log('[Create Error] TOEIC DATA ERROR')});
    };

    // sampleData 폴더에 있는 JSON 데이터를 asnyc/await을 통해 처리
    createToeicData = async (): Promise<void> => {

        const { Actions } = this.props;
        const object = await fetch('../../sampleData/task_container.json');
        const jsonData = await object.json();

        Actions.createPart6Questions(jsonParser(jsonData));
    };

    createChoiceInfo = (): void => {
        const { Actions, toeicPart6s } = this.props;
        let index = 0;
        const choiceList: Array<Choice> = [];
        let choice: Choice = {
            isSelected: false,
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
                choice = {
                    isSelected: false,
                    qId: '',
                    chooseAnswer: '',
                    correctAnswer: '',
                    studyNode: '',
                    answerValue: ''
                };

                choice.isSelected = false;
                choice.qId = questions[j].id;
                choice.chooseAnswer = '';
                choice.correctAnswer = questions[j].correctAnswer;
                choice.studyNode = questions[j].studyNote;

                const choiceInfo = questions[j].choiceArea;
                for(let k=0; k<choiceInfo.length; k++) {
                    const sample = ['a', 'b', 'c', 'd'];
                    if(sample[choiceInfo[k].number] === questions[j].correctAnswer) {
                        choice.answerValue = choiceInfo[k].numberValue;
                    }
                }

                choiceList[index++] = choice;
            }
        }

        // Store에 접근해서 State을 변경할 Action들
        Actions.createChooseInfo(choiceList);
    };

    updateChooseInfo = (qId: string, orderValue: string): void => {
        const { Actions } = this.props;
        Actions.updateChooseInfo(qId, orderValue);
    };

    changePageState = (state: string): void => {
        const { Actions } = this.props;
        Actions.changePageState(state);
    };

    endLoadingPage = (): void => {
        const { pageState } = this.props;
        if(pageState === 'loading') {
            setTimeout(() => {
                this.changePageState('result');
            }, 1000);
        }
    };
}

export default connect(
    ({toeicData}: StoreState) => ({
        toeicPart6s: toeicData.toeicPart6s,
        pageState: toeicData.pageState,
        choiceList: toeicData.choiceList
    }),
    (dispatch) => ({
        Actions: bindActionCreators(toeicActions, dispatch)
    })
)(MainContainer);