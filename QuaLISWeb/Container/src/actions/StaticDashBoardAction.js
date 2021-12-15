import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { initRequest } from './LoginAction';
import {getHomeDashBoard} from './DashBoardTypeAction';

export function getListStaticDashBoard(userInfo) {
    return function (dispatch) {
        // let selectedRecordStatic = {};
        dispatch(initRequest(true));
        rsapi.post("/staticdashboard/getListStaticDashBoard", { 'userinfo': userInfo })

            .then(response => { 
                //console.log("statuc dash action :", response);
                response.data = null;
               // console.log("length:", response.data.length);
                let respObject = {masterDataStatic: response.data, loading: false,};
                if (response.data !== null && Object.keys(response.data).length > 0)
                {
                   respObject = {...respObject, currentPageNo : -1 };
                   // dispatch({ type: DEFAULT_RETURN, payload: { masterDataStatic: response.data, loading: false, currentPageNo : -1 } });
                } 
                dispatch(getHomeDashBoard(userInfo, 0, false, respObject));
             })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getStaticDashBoard(userInfo, selectedDashBoardDetail, masterDataStatic, selectedRecordStatic, showModal) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/staticdashboard/getStaticDashBoard", { 'userinfo': userInfo, "nstaticDashBoardCode": selectedDashBoardDetail.nstaticdashboardcode, "sparamValue" : selectedRecordStatic })

            .then(response => {

                masterDataStatic = { ...response.data, staticDashBoardMaster: masterDataStatic.staticDashBoardMaster,
                     selectedDashBoardDetail: selectedDashBoardDetail };
              
                dispatch({ type: DEFAULT_RETURN, payload: { masterDataStatic, loading: false,  openModalForHomeDashBoard : showModal} });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getSelectionStaticDashBoard(userInfo, nstaticDashBoardCode, sparamValue, masterDataStatic,selectedItem) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/staticdashboard/getSelectionStaticDashBoard", { 'userinfo': userInfo, "nstaticDashBoardCode": nstaticDashBoardCode, "sparamValue": sparamValue })

            .then(response => {

                masterDataStatic = { 
                    ...masterDataStatic, 
                    ...response.data,
                    selectedCategoryField:selectedItem.categoryField,
                    selectedValueField:selectedItem.valueField 
                };               
                dispatch({ type: DEFAULT_RETURN, payload: { masterDataStatic, loading: false } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}