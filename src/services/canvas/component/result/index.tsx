
import * as React from 'react'
import {
    previewArea,
    question,
    questionArea,
    toeicContainer,
    userCheck,
    correctCheck,
    normalCheck,
    oSign,
    xSign,
    vocaArea,
    voca
} from "./style.css";

// 공통으로 쓰이는 Util 함수들
import Utils from '../../../utills/utils';
import {ChoiceArea, ChooseData, QuestionsData, ToeicPart6, Voca} from "../../../../store/modules/toeicData";

// Exam에서 시용하는 Redux 상태값 및 액션들
interface Props {
    toeicPart6s: Array<ToeicPart6>,
    chooseInfo: Array<ChooseData>
}

/**
 *  Result
 *      - 유저가 푼 문제의 대한 채점 결과를 보여주는 Component
 *
 *  Function List (7)
 *      - renderResultPage: 유저가 푼 문제의 대한 채점 결과를 랜더링
 *      - result: 채점 결과 요약
 *      - studyNote: 지문에 대한 정답 및 문장 해석 정보 랜더링
 *      - renderQuestions: 지문에 대한 문제 정보 랜더링
 *      - oxSign: 오답 및 정답 표시
 *      - renderChoiceAnswer: 문제에 대한 보기 정보 (내가 체크한 답과 실제 정답 비교)
 *      - vocaArea: voca 정보를 랜더링
 */
class Result extends React.Component<Props, {}> {

    render() {
        const { toeicPart6s, chooseInfo } = this.props;

        return (
            <div className={toeicContainer}>
                {this.renderResultPage(toeicPart6s, chooseInfo)}
            </div>
        );
    }

    renderResultPage = (toeicPart6s: Array<ToeicPart6>, chooseInfo: Array<ChooseData>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];

        for(let i=0; i<toeicPart6s.length; i++) {

            html[i] = (
                <div>
                    <h1>Part6</h1>
                    <h2>채점 결과 : {this.result(chooseInfo)}</h2>
                    <div className={previewArea}>{this.studyNote(chooseInfo)}</div>
                    {this.renderQuestions(toeicPart6s[i].questions, chooseInfo)}
                    <div className={vocaArea}>
                        <div className={voca}>
                            {this.vocaArea(toeicPart6s[i].voca)}
                        </div>
                    </div>
                </div>
            );
        }
        return html;
    };

    studyNote = (chooseInfo: Array<ChooseData>): React.ReactElement[] => {
        let index = 0;
        let html: React.ReactElement[] = [];
        for(let i=0; i<chooseInfo.length; i++) {
            const s = chooseInfo[i].studyNode.split('\\n');
            console.log(i + '  ' + chooseInfo[i].answerValue);
            for(let j=0; j<s.length; j++) {
                let text = s[j];
                if(text.includes(chooseInfo[i].answerValue)) {
                    const normalText = text.split(chooseInfo[i].answerValue);
                    const blankArea: React.ReactElement = (
                        <p>
                            {normalText[0]}
                            <span>{chooseInfo[i].answerValue}</span>
                            {normalText[1]}
                        </p>
                    );
                    html[index++] = (blankArea);
                } else {
                    html[index++] = (<p>{text}</p>);
                }
            }
        }
        return html;
    };

    renderQuestions = (questions: Array<QuestionsData>, chooseInfo: Array<ChooseData>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];
        for(let i=0; i<questions.length; i++) {

            html[i] = (
                <div className={questionArea}>
                    <div className={question}>
                        {this.oxSign(Number(questions[i].order) + 1, questions[i].id, questions[i].correctAnswer, chooseInfo)}
                        {this.renderChoiceAnswer(questions[i].id ,questions[i].choiceArea, chooseInfo)}
                    </div>
                </div>
            );
        }
        return html;
    };

    renderChoiceAnswer = (qId: string, choiceArea: Array<ChoiceArea>, chooseInfo: Array<ChooseData>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];
        for(let i=0; i<choiceArea.length; i++) {

            let state = '';
            const view = Utils.numberToABC(choiceArea[i].number, '');
            for(let j=0; j<chooseInfo.length; j++) {
                if(qId === chooseInfo[j].qId) {
                    if(chooseInfo[j].chooseAnswer === chooseInfo[j].correctAnswer) {
                        if(view === chooseInfo[j].correctAnswer) {
                            state = 'cc';
                        } else {
                            state = 'nc';
                        }
                    } else {
                        if(view === chooseInfo[j].correctAnswer) {
                            state = 'cc';
                        } else if(view === chooseInfo[j].chooseAnswer) {
                            state = 'uc';
                        } else {
                            state = 'nc';
                        }
                    }
                }
            }
            html[i] = (<p className={state === 'uc' ? userCheck : state === 'cc' ? correctCheck : normalCheck}>{Utils.numberToABC(choiceArea[i].number, 'P')} {choiceArea[i].numberValue}</p>);
        }
        return html;
    };

    result = (chooseInfo: Array<ChooseData>): string => {

        let info;
        let answerCnt = 0;
        for(let i=0; i<chooseInfo.length; i++) {
            if(chooseInfo[i].chooseAnswer === chooseInfo[i].correctAnswer) {
                answerCnt++;
            }
        }
        info = '총 ' + chooseInfo.length + '문제 중에 ' + answerCnt + '문제 맞추셨습니다. ' + '(정답률 : ' + answerCnt/chooseInfo.length*100 + '%)';
        return info;
    };

    oxSign = (number: number, qId: string, correctAnswer: string, chooseInfo: Array<ChooseData>): React.ReactElement => {

        let html: React.ReactElement;
        for(let i=0; i<chooseInfo.length; i++) {
            if(qId === chooseInfo[i].qId && correctAnswer === chooseInfo[i].chooseAnswer) {
                return html = (<p className={oSign}><b>{number}. 정답입니다!</b></p>);
            } else {
                html = (<p className={xSign}><b>{number}. 틀렸습니다.</b></p>);
            }
        }
        return html;
    };

    vocaArea = (voca: Array<Voca>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];
        for(let i=0; i<voca.length; i++) {
            html[i] = (
                <p>{voca[i].word} : {voca[i].meaning}</p>
            );
        }
        return html;
    };
}

export default Result;