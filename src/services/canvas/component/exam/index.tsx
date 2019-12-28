
import * as React from 'react';
import classNames from 'classnames';
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
import { numberToABC } from '../../../utills/utils';
import { ToeicPart6, Choice, QuestionsData } from "../../../../store/modules/toeicData";

// Exam에서 시용하는 Redux 상태값 및 액션들
interface Props {
    toeicPart6s: Array<ToeicPart6>,
    choiceList: Array<Choice>,
    updateChooseInfo(qId: string, orderValue: string): void,
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
        const { toeicPart6s, choiceList } = this.props;

        return (
            <div className={toeicContainer}>
                {this.renderToeicPart6(toeicPart6s, choiceList)}
            </div>
        );
    }

    renderToeicPart6 = (toeicPart6s: Array<ToeicPart6>, choiceList: Array<Choice>): React.ReactElement[] => {

        let html: React.ReactElement[] = [];
        for(let i=0; i<toeicPart6s.length; i++) {
            const preview = toeicPart6s[i].preview;

            html[i] = (
                <div key={'q-' + i}>
                    <h1>Part6</h1>
                    <h2>Questions 1 - 4</h2>
                    <div className={previewArea}>{this.cleanText(preview)}</div>
                    {
                        toeicPart6s[i].questions.map((item, index) => {
                            return (
                                <React.Fragment key={'fragment_' + index}>
                                    <div className={questionArea} key={'questions_' + index}>
                                        <div className={question}>
                                            <p><b>{item.order + 1}.</b></p>
                                            {
                                                item.choiceArea.map((choiceArea, index2) => {
                                                    let html: React.ReactElement[] = [];
                                                    const activeObject = [];
                                                    activeObject[active] = this.isChooseArea(item.id, choiceArea.number);

                                                    html.push((
                                                        <p key={'choiceArea_' + index + '_' + index2} className={classNames(interest, activeObject)}
                                                           onClick={() => this.checkAnswer(item.id, numberToABC(choiceArea.number))}>
                                                            {'(' + numberToABC(choiceArea.number) + ')'} {choiceArea.numberValue}
                                                        </p>
                                                    ));
                                                    return html;
                                                })
                                            }
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }
                    <div className={buttonArea}>
                        <button onClick={() => {this.checkSubmit(choiceList)}} className={button}><span>채점하기</span></button>
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
                <div className={questionArea} key={'questions_' + i}>
                    <div className={question}>
                        <p><b>{questions[i].order + 1}.</b></p>
                        {
                            questions[i].choiceArea.map(choiceArea => {
                                let html: React.ReactElement[] = [];
                                const activeObject = [];
                                activeObject[active] = this.isChooseArea(questions[i].id, choiceArea.number);

                                html.push((
                                    <p key={'choiceArea_' + i} className={classNames(interest, activeObject)}
                                       onClick={() => this.checkAnswer(questions[i].id, numberToABC(choiceArea.number))}>
                                        {'(' + numberToABC(choiceArea.number) + ')'} {choiceArea.numberValue}
                                    </p>
                                ));
                                return html;
                            })
                        }
                    </div>
                </div>
            );
        }
        return html;
    };

    checkAnswer = (qId: string, orderValue: string): void => {
        this.props.updateChooseInfo(qId, orderValue);
    };

    checkSubmit = (choiceList: Array<Choice>): void => {

        let isValid = false;
        for(let i=0; i<choiceList.length; i++) {
            if(choiceList[i].chooseAnswer === '') {
                isValid = true;
            }
        }

        if(isValid) {
            alert('몰라도 다 푸세염 ! ^^');
        } else {
            this.props.changePageState('loading');
        }
    };

    isChooseArea = (qId: string, num: string): boolean => {
        let result = false;
        const { choiceList } = this.props;
        for(let i=0; i<choiceList.length; i++) {
            if(qId === choiceList[i].qId) {
                result = numberToABC(num) === choiceList[i].chooseAnswer;
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
                    <p key={"t_" + i}>
                        {blankText[0]}
                        <span>{blankMark}</span>
                        {blankText[1]}
                    </p>
                );
                cleanText[i] = (blankArea);
            } else {
                cleanText[i] = (<p key={"t_" + i}>{text}</p>);
            }
        }

        return cleanText;
    };
}

export default Exam;