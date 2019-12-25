
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import Root from './services';
import { Provider } from 'react-redux';
import configureStore from "./store/configureStore";

import * as style from './style.css';

/*
    App이라는 ID를 가진 Element를 찾아서 main css를 추가함
        * main Element Style을 좀 더 편하게 다룰 수 있음
 */
const container = document.getElementById('app');
container.classList.add(style.main);

const store = configureStore();

/*
    ReactDom을 App ID를 가진 div에 랜더링 함.
    Provider를 통해 parent-child구조로 데이터를 전달 해주지 않아도 connect될 때 store에 접근 할 수 있게 해줌
 */
ReactDom.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    container
);