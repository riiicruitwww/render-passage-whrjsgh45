
import * as React from 'react'
import {
    loadingArea,
    textArea
} from "./style.css";

interface Props {
    changePageState(state: string): void
}

/**
 *  Loading
 *      - 로딩 UI를 보여줌
 */
class Loading extends React.Component<Props, {}> {

    render() {
        return (
            <div>
                <div className={loadingArea}><img src='../../../../assets/img/loading.gif' alt='loading'/></div>
                <div className={textArea}><span>채점중 . . .</span></div>
            </div>
        );
    }
}

export default Loading;