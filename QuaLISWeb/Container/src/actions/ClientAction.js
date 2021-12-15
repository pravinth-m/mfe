import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
//import { sortData, getComboLabelValue, searchData } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';

//export function getClientComboService(screenName, operation, primaryKeyName, primaryKeyValue, userInfo, ncontrolCode) {
//export function getClientComboService(screenName, primaryKeyName, primaryKeyValue, operation, inputParam, userInfo, ncontrolCode) {
export function getClientComboService(clientparam) {
    return function (dispatch) {
        if (clientparam.operation === "create" || clientparam.operation === "update") {
            const countryService = rsapi.post("country/getCountry", { userinfo: clientparam.userInfo });
            let urlArray = [];
            let selectedId = null;
            if (clientparam.operation === "create") {

                urlArray = [countryService];
            }
            else {
                const clientById = rsapi.post("client/getActiveClientById", { [clientparam.primaryKeyField]: clientparam.primaryKeyValue, "userinfo": clientparam.userInfo });

                urlArray = [countryService, clientById];
                selectedId = clientparam.primaryKeyValue;
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let country = [];
                    let selectedRecord = {};
                    if (clientparam.operation === "update") {
                        selectedRecord = response[1].data;
                        country.push({ "value": response[1].data["ncountrycode"], "label": response[1].data["scountryname"] });
                        selectedRecord["ncountrycode"] = country[0];
                    } else {
                        selectedRecord["ntransactionstatus"] = 1;
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            countryList: response[0].data || [],

                            selectedRecord, openModal: true,
                            operation: clientparam.operation, screenName: clientparam.screenName,
                            ncontrolCode: clientparam.ncontrolCode, loading: false, selectedId
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
        // else {
        //     toast.warn(this.props.formatMessage({ id: masterData.SelectedMAHolder.stranstatus }));
        // }
    }
}