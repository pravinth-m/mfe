import { toast } from "react-toastify";
import { intl } from "../components/App";
import rsapi from "../rsapi";
import { initRequest } from './LoginAction';
import { DEFAULT_RETURN } from "./LoginTypes";


export function getCerHisDetail(CerGen, fromDate, toDate,userInfo, masterData){
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("certificatehistory/getCertificateHistory", {
            "ncertificateversionhistorycode": CerGen["ncertificateversionhistorycode"],
            "userinfo": userInfo
        })
            .then(response => {
                masterData = { ...masterData, ...response.data };
              //  sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false ,dataState:undefined} });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
    }
}




 