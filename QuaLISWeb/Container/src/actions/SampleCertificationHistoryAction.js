import rsapi from '../rsapi';
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { sortData } from '../components/CommonScript';


export function getTestResultDataHistory(methodParam) {
    return function (dispatch) {
        return rsapi.post("/samplecertificationhistory/getParameterSampleResults",
            { transactiontestcode: methodParam.primaryKeyValue,
              userinfo: methodParam.userInfo })
            .then(response => {
                let sampleTestResults = methodParam.masterData.sampleTestResults||new Map();
                sampleTestResults.set(methodParam.primaryKeyValue,  Object.values(response.data["ParameterSampleResults"]));
                const masterData = {
                    ...methodParam.masterData,
                    sampleTestResults,
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        //...masterData,
                        masterData: masterData,
                        dataState: methodParam.dataState,
                        loading: false
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


export function getActiveSampleHistory(Sample, userInfo, masterData, dataStateParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("samplecertificationhistory/getSampleCertificationById",
            { nregcertificatecode: parseInt(Sample.nregcertificatecode), userinfo: userInfo,
                npreregno: masterData.SelectedRegistration.npreregno })
            .then(response => {
                const printHistory = response.data.printHistory;
                masterData = { ...masterData, ...response.data, printHistory };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
                        loading: false,
                        printHistoryDataState:{...dataStateParam.printHistoryDataState,sort:undefined, filter:undefined},
                        appHistoryDataState:{...dataStateParam.appHistoryDataState,sort:undefined, filter:undefined},
                        resultsDataState:{...dataStateParam.resultsDataState,sort:undefined, filter:undefined},
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


export function getWholeFilterStatusHistory(masterData, inputData, operation, dataStateParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("samplecertificationhistory/getFilterWholeStatus",
            {
                FromDate: inputData.FromDate, ToDate: inputData.ToDate, userinfo: inputData.userinfo, nsampletypecode: inputData.nsampletypecode,
                nregtypecode: inputData.nregtypecode, nregsubtypecode: inputData.nregsubtypecode
                //nfilterstatus:inputData.nfilterstatus
            })

            .then(response => {
                const SelectedRegistration = response.data.SelectedRegistration ? response.data.SelectedRegistration : "";
                const Registration = response.data.Registration ? response.data.Registration : "";
                const FilterStatusValue = response.data.FilterStatusValue ? response.data.FilterStatusValue : "";
                const RegistrationSubTypeValue = response.data.RegistrationSubTypeValue ? response.data.RegistrationSubTypeValue : masterData.RegistrationSubTypeValue;
                masterData = {
                    ...masterData, ...response.data, Registration, SelectedRegistration, FilterStatusValue,
                    RegistrationSubTypeValue, operation,
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        printHistoryDataState:{...dataStateParam.printHistoryDataState,sort:undefined, filter:undefined},
                        appHistoryDataState:{...dataStateParam.appHistoryDataState,sort:undefined, filter:undefined},
                        resultsDataState:{...dataStateParam.resultsDataState,sort:undefined, filter:undefined},
                    }
                })
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