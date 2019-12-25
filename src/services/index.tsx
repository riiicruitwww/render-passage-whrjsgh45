
import * as React from 'react';
import MainContainer from './container/MainContainer';

/**
 *  Root
 *  - 사용할 하위 컨테이너들을 여기서 세팅함
 *
 *  컨테이너: 이 프로젝트에서 컨테이너는 특정 영역에 대한 모든 정보를 가지고 있는 Component를 의미함
 *      ex) 헤더 또는 푸터가 필요할 경우, <HeaderContainer />, <FooterContainer /> 형태로 추가
 *
 *  MainContainer: TOEIC Part6 JSON 데이터를 파싱하여 문제관련 UI및 기능을 다루는 모든 Component
 */
class Root extends React.Component {

    render() {
        return (
            <div>
                <MainContainer />
            </div>
        );
    }
}

export default Root;