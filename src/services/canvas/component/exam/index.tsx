
import * as React from 'react'
import {
    toeicContainer,
    previewArea,
    questionArea,
    question,
    interest,
    active,
    buttonArea,
    button
} from "./style.css";

// 공통으로 쓰이는 Util 함수들
import Utils from '../../../utills/utils';
import {ToeicPart6, ChooseData, QuestionsData, ChoiceArea} from "../../../../store/modules/toeicData";

// Exam에서 시용하는 Redux 상태값 및 액션들
interface Props {
    toeicPart6s: Array<ToeicPart6>,
    chooseInfo: Array<ChooseData>,
    updateChooseInfo(chooseInfo: Array<ChooseData>): void,
    changePageState(state: string): void
}

/**
 *  Exam
 *      - TOEIC PART6 지문과 문제를 화면에 랜더링 하고 문제 풀이 기능을 제공하는 Component
 *
 *  Function List (7)
 *      - renderToeicPart6: TOEIC PART6 정보를 랜더링
 *      - cleanText: 지문 내용을 깔끔하게 정리 해주는 함수 (빈칸에 번호 매김 및 하이라이트)
 *      - renderQuestions: 하나의 지문에 대한 여러 문제 정보를 랜더링
 *      - renderChoiceAnswer: 문제에 대한 여러 보기 정보를 랜더링
 *      - checkAnswer: 보기를 체크 했을 때 해당 정보를 Update
 *      - isChooseArea: 유저가 보기를 체크 했는지 확인
 *      - checkSubmit: 채점하기 기능 (모든 문제를 풀었다고 판단했을 경우 loading 상태로 변경)
 */
class Exam extends React.Component<Props, {}> {

    render() {
        const { toeicPart6s, chooseInfo } = this.props;

        return (
            <div className={toeicContainer}>
                {this.renderToeicPart6(toeicPart6s, chooseInfo)}
            </div>
        );
    }

    renderToeicPart6 = (toeicPart6s: Array<ToeicPart6>, chooseInfo: Array<ChooseData>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];
        for(let i=0; i<toeicPart6s.length; i++) {
            const preview = toeicPart6s[i].preview;

            html[i] = (
                <div>
                    <h1>Part6</h1>
                    <h2>Questions 1 - 4</h2>
                    <div className={previewArea}>{this.cleanText(preview)}</div>
                    {this.renderQuestions(toeicPart6s[i].questions)}

                    <div className={buttonArea}>
                        <button onClick={() => {this.checkSubmit(chooseInfo)}} className={button}><span>채점하기</span></button>
                    </div>
                </div>
            );
        }
        return html;
    };

    renderQuestions = (questions: Array<QuestionsData>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];
        for(let i=0; i<questions.length; i++) {

            html[i] = (
                <div className={questionArea}>
                    <div className={question}>
                        <p><b>{questions[i].order + 1}.</b></p>
                        {this.renderChoiceAnswer(questions[i].id, questions[i].choiceArea)}
                    </div>
                </div>
            );
        }
        return html;
    };

    renderChoiceAnswer = (qId: string, choiceArea: Array<ChoiceArea>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];
        for(let i=0; i<choiceArea.length; i++) {
            html[i] = (
                <p className={this.isChooseArea(qId, choiceArea[i].number) ? interest + ' ' + active : interest}
                    onClick={() => this.checkAnswer(qId, choiceArea[i].number)}>
                    {Utils.numberToABC(choiceArea[i].number, 'P')} {choiceArea[i].numberValue}
                </p>
            );
        }
        return html;
    };

    checkAnswer = (qId: string, num: string): void => {
        const { chooseInfo } = this.props;
        let index = 0;
        const tempChooseInfo: Array<ChooseData> = [];
        let chooseData: ChooseData = {
            click: false,
            qId: '',
            chooseAnswer: '',
            correctAnswer: '',
            studyNode: '',
            answerValue: ''
        };

        for(let i=0; i<chooseInfo.length; i++) {

            chooseData = {
                click: false,
                qId: '',
                chooseAnswer: '',
                correctAnswer: '',
                studyNode: '',
                answerValue: ''
            };

            if(qId === chooseInfo[i].qId) {
                chooseData.click = true;
                chooseData.chooseAnswer = Utils.numberToABC(num, '');
            } else {
                chooseData.click = false;
                chooseData.chooseAnswer = chooseInfo[i].chooseAnswer;
            }
            chooseData.qId = chooseInfo[i].qId;
            chooseData.correctAnswer = chooseInfo[i].correctAnswer;
            chooseData.studyNode = chooseInfo[i].studyNode;
            chooseData.answerValue = chooseInfo[i].answerValue;

            tempChooseInfo[index++] = chooseData;
        }
        this.props.updateChooseInfo(tempChooseInfo);
    };

    checkSubmit = (chooseInfo: Array<ChooseData>): void => {

        let check = false;
        for(let i=0; i<chooseInfo.length; i++) {
            if(chooseInfo[i].chooseAnswer === '') {
                check = true;
            }
        }

        if(check) {
            alert('몰라도 다 푸세염 ! ^^');
        } else {
            this.props.changePageState('loading');
        }
    };

    isChooseArea = (qId: string, num: string): boolean => {
        let result = false;
        const { chooseInfo } = this.props;
        for(let i=0; i<chooseInfo.length; i++) {
            if(qId === chooseInfo[i].qId) {
                result = Utils.numberToABC(num, '') === chooseInfo[i].chooseAnswer;
            }
        }
        return result;
    };

    cleanText = (preview: string): React.ReactElement[] => {

        let number = 1;
        let cleanText: React.ReactElement[] = [];
        let s = preview.split('\n');

        for(let i=0; i<s.length; i++) {

            let text = s[i];
            if(text.includes('_______')) {
                const blankText = text.split('_______');
                const blankMark = '___' + '(' + number++ + ')' + '___';
                const blankArea: React.ReactElement = (
                    <p>
                        {blankText[0]}
                        <span>{blankMark}</span>
                        {blankText[1]}
                    </p>
                );
                cleanText[i] = (blankArea);
            } else {
                cleanText[i] = (<p>{text}</p>);
            }
        }

        return cleanText;
    };
}

export default Exam;