import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { initRequest } from './LoginAction';



export function openEmailHostModal(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolcode) {
    return (dispatch) => {
        dispatch({type: DEFAULT_RETURN, payload:{selectedRecord : {}, screenName: screenName,
            operation: "create", openModal: true, ncontrolcode}});
    }
}

export function fetchEmailHostById(editParam) {
    return function (dispatch) {
        const URL1 = rsapi.post('emailhost/getActiveEmailHostById', { [editParam.primaryKeyField]: editParam.primaryKeyValue, "userinfo": editParam.userInfo })
        // const URL2=rsapi.post("instrumentcategory/getActiveInstrumentCategoryById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
        // const URL3= rsapi.post('instrumentcategory/getInterfacetype',{"userinfo":editParam.userInfo})
        dispatch(initRequest(true));
        Axios.all([URL1])
            .then(response => {
                let selectedRecord = {}
                let selectedId = editParam.primaryKeyValue;
                selectedRecord = response[0].data
               
                //let EmailTagParameter = response[0].data["EmailTagParameter"];
               // getComboLabelValue(selectedRecord, Tag, "nemailtagcode", "stagname");
                //     getComboLabelValue(selectedRecord, Interfacetype, "ninterfacetype", "sinterfacetypename");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        operation: editParam.operation,
                        openModal: true,
                        screenName: editParam.screenName,
                        ncontrolcode: editParam.ncontrolCode,
                        loading: false, selectedId
                    }
                });

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
