
import { combineReducers } from "redux";
import { ToeicData ,toeicData } from './toeicData';

export interface StoreState {
    toeicData: ToeicData;
}

export default combineReducers({
    toeicData
});