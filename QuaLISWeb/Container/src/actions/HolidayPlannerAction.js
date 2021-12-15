import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { sortData, constructOptionList, rearrangeDateFormat } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function getHoildaysYear(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        let urlArray = [];
        if (operation === "update") {
            const HolidayYear = rsapi.post("/holidayplanner/getYearByID", { [primaryKeyName]: masterData.selectedYear[primaryKeyName], "userinfo": userInfo });
            urlArray = [HolidayYear];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                if (operation === "update") {
                    selectedRecord = response[0].data;
                    selectedRecord["syear"] = new Date(response[0].data.syear);
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        operation: operation,
                        screenName: screenName,
                        openModal: true, ncontrolCode: ncontrolCode, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function selectCheckBoxYear(HolidayYear, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/holidayplanner/getSelectionAllHolidayPlanner", { 'userinfo': userInfo, "nyearcode": HolidayYear.nyearcode })

            .then(response => {
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getCommonHolidays(screenName, operation, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        let urlArray = [];
        if (operation === "update") {
            const CommonHolidays = rsapi.post("/holidayplanner/getCommonHolidaysByID", { "ncommonholidaycode": masterData.CommonHolidays[0].ncommonholidaycode, "nyearcode": masterData.CommonHolidays[0].nyearcode, "nholidayYearVersion": masterData.CommonHolidays[0].nholidayyearversion, "userinfo": userInfo });
            urlArray = [CommonHolidays];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord: operation === "update" ? response[0].data : undefined,
                        operation: operation,
                        screenName: screenName,
                        openChildModal: true, ncontrolCode: ncontrolCode, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

//export function getPublicHolidays(screenName, operation, primaryKeyName,rowitem, masterData, userInfo, ncontrolCode) {
export function getPublicHolidays(fetchRecord) {
    return function (dispatch) {
        let urlArray = [];
        let selectedId = null;

        let selectedRecord = {
            // "ddate": new Date(),
            "ntzddate": {
                "value": fetchRecord.userInfo.ntimezonecode,
                "label": fetchRecord.userInfo.stimezoneid
            },
            "stzddate": fetchRecord.userInfo.stimezoneid
        };

        if (fetchRecord.operation !== "update") {

            // const yearVersion = rsapi.post("/holidayplanner/getYearVersionByID", { "nholidayyearversion": fetchRecord.masterData.selectedYearVersion.nholidayyearversion, "nyearcode": fetchRecord.masterData.selectedYearVersion.nyearcode, "userinfo": fetchRecord.userInfo });

            const timeZoneService = rsapi.post("timezone/getTimeZone");
            urlArray = [timeZoneService];

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, true);
                    const timeZoneList = timeZoneMap.get("OptionList");

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            selectedRecord,
                            operation: fetchRecord.operation,
                            screenName: "IDS_PUBLICHOLIDAYS",
                            timeZoneList: timeZoneList || [],
                            openChildModal: true, ncontrolCode: fetchRecord.ncontrolCode, loading: false,
                            selectedId
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {

            // if (fetchRecord.operation === "update") {

            const PublicHolidays = rsapi.post("/holidayplanner/getPublicHolidaysByID", { "npublicholidaycode": fetchRecord.editRow.npublicholidaycode, "nholidayYearVersion": fetchRecord.editRow.nholidayyearversion, "nyearcode": fetchRecord.editRow.nyearcode, "userinfo": fetchRecord.userInfo });
            const timeZoneService = rsapi.post("timezone/getTimeZone");
            urlArray = [timeZoneService, PublicHolidays];
            selectedId = fetchRecord.editRow.npublicholidaycode;


            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    const timeZoneMap1 = constructOptionList(response[0].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, true);
                    const timeZoneList1 = timeZoneMap1.get("OptionList");

                    let timeZone = [];

                    if (fetchRecord.operation === "update") {
                        selectedRecord = response[1].data;

                        timeZone.push({ "value": response[1].data["ntzddate"], "label": response[1].data["stzddate"] });

                        selectedRecord["ntzddate"] = timeZone[0];
                        selectedRecord["stzddate"] = timeZone[0].label;
                        selectedRecord["ddate"] = rearrangeDateFormat(fetchRecord.userInfo,response[1].data["sdate"]);

                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            selectedRecord,
                            operation: fetchRecord.operation,
                            screenName: "IDS_PUBLICHOLIDAYS",
                            timeZoneList: timeZoneList1 || [],
                            openChildModal: true, ncontrolCode: fetchRecord.ncontrolCode, loading: false,
                            selectedId
                        }
                    });
                })

                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
    }
}
export function sendApproveYearVersion(nYearCode, nHolidayVersion, userInfo) {
    return function (dispatch) {
        let urlArray = [];

        const yearVersion = rsapi.post("/holidayplanner/ApproveYearVersion", { "nholidayYearVersion": nHolidayVersion, "nyearcode": nYearCode, "userinfo": userInfo });
        urlArray = [yearVersion];


        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
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
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getCommonAndPublicHolidays(nHolidayYearVersion, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/holidayplanner/getSelectedCommonAndPublicHolidays", { 'nholidayYearVersion': nHolidayYearVersion.version.nholidayyearversion, "nyearcode": nHolidayYearVersion.version.nyearcode, "userinfo": nHolidayYearVersion.userInfo })

            .then(response => {
                masterData = {
                    ...nHolidayYearVersion.masterData,
                    CommonHolidays: response.data.CommonHolidays, PublicHolidays: response.data.PublicHolidays,
                    selectedYearVersion: nHolidayYearVersion.version,
                    CurrentYearVersion: nHolidayYearVersion.version.nholidayyearversion
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        // CommonHolidays: response[0].data, PublicHolidays: response[0].data, 
                        // CurrentYearVersion: response["CurrentYearVersion"], loading:false
                        masterData, loading: false, dataState: undefined
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}