import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { sortData, constructOptionList, rearrangeDateFormat } from '../components/CommonScript';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getGoodsInComboService(goodsInParam) {
    return function (dispatch) {

        const manufacturerService = rsapi.post("manufacturer/getManufacturerListForCombo", { userinfo: goodsInParam.userInfo });
        const courierService = rsapi.post("courier/getAllActiveCourier", { userinfo: goodsInParam.userInfo });
        const recipientService = rsapi.post("users/getUserWithDeptForCombo", { userinfo: goodsInParam.userInfo });
        const timeZoneService = rsapi.post("timezone/getTimeZone");
        const UTCtimeZoneService = rsapi.post("timezone/getLocalTimeByZone", { userinfo: goodsInParam.userInfo });
        let urlArray = [];
        let selectedId = null;
        if (goodsInParam.operation === "create") {
            urlArray = [manufacturerService, courierService, recipientService, timeZoneService, UTCtimeZoneService];
        }
        else {
            const url = goodsInParam.inputParam.classUrl + "/getActiveGoodsInById";

            const goodsInById = rsapi.post(url, { [goodsInParam.primaryKeyField]: goodsInParam.primaryKeyValue, "userinfo": goodsInParam.userInfo });
            urlArray = [manufacturerService, courierService, recipientService, timeZoneService, UTCtimeZoneService, goodsInById];
            selectedId = goodsInParam.primaryKeyValue;
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const manufacturerMap = constructOptionList(response[0].data || [], "nmanufcode",
                    "smanufname", undefined, undefined, true);

                const courierMap = constructOptionList(response[1].data || [], "ncouriercode",
                    "scouriername", undefined, undefined, false);

                const recipientMap = constructOptionList(response[2].data || [], "nusercode",
                    "susername", undefined, undefined, true);

                const timeZoneMap = constructOptionList(response[3].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, true);

                const manufacturerList = manufacturerMap.get("OptionList");
                const courierList = courierMap.get("OptionList");
                const recipientList = recipientMap.get("OptionList");
                const timeZoneList = timeZoneMap.get("OptionList");
                //const currentTime = new Date(response[4].data);
                const currentTime = rearrangeDateFormat(goodsInParam.userInfo, response[4].data);

                let validRecord = true;
                let selectedRecord = {
                    //"dgoodsindate": new Date(response[4].data),
                    "ntzgoodsindate": {
                        "value": goodsInParam.userInfo.ntimezonecode,
                        "label": goodsInParam.userInfo.stimezoneid
                    },
                    "stzgoodsindate": goodsInParam.userInfo.stimezoneid
                };
                if (goodsInParam.operation === "update") {
                    if (response[5].data["ntransactionstatus"] === transactionStatus.GOODS_RECEIVED) {
                        validRecord = false;
                    }
                    else {
                        let manufacturer = [];
                        let courier = [];
                        let user = [];
                        let timeZone = [];
                        selectedRecord = response[5].data;

                        manufacturer.push({ "value": response[5].data["nmanufcode"], "label": response[5].data["smanufname"] });
                        if (response[5].data["ncouriercode"] !== -1) {
                            courier.push({ "value": response[5].data["ncouriercode"], "label": response[5].data["scouriername"] });
                            selectedRecord["ncouriercode"] = courier[0];
                        }
                        else {
                            selectedRecord["ncouriercode"] = undefined;
                        }
                        user.push({ "value": response[5].data["nrecipientcode"], "label": response[5].data["suserfullname"] });
                        timeZone.push({ "value": response[5].data["ntzgoodsindate"], "label": response[5].data["stzgoodsindate"] });

                        selectedRecord["nmanufcode"] = manufacturer[0];
                        selectedRecord["nrecipientcode"] = user[0];
                        //selectedRecord["ndeptcode"] = response[5].data["ndeptcode"];
                        selectedRecord["sdeptname"] = response[5].data["sdeptname"];
                        selectedRecord["ntzgoodsindate"] = timeZone[0];
                        selectedRecord["stzgoodsindate"] = timeZone[0].label;

                       //selectedRecord["dgoodsindate"] = new Date(response[5].data["sgoodsindate"]);

                       selectedRecord["dgoodsindate"] = rearrangeDateFormat(goodsInParam.userInfo, response[5].data["sgoodsindate"]);
                    }

                }
                else {
                    //selectedRecord["dgoodsindate"]= new Date(response[4].data);
                    selectedRecord["dgoodsindate"] = rearrangeDateFormat(goodsInParam.userInfo, response[4].data);
                  
                  
                    selectedRecord["nmanufcode"] = manufacturerMap.get("DefaultValue");
                    selectedRecord["ncouriercode"] = courierMap.get("DefaultValue");
                    selectedRecord["nrecipientcode"] = recipientMap.get("DefaultValue");
                    // selectedRecord["ntzgoodsindate"] = timeZoneMap.get("DefaultValue");
                    //selectedRecord["stzgoodsindate"] = timeZoneMap.get("DefaultValue") ? timeZoneMap.get("DefaultValue").label :"";
                }
                if (validRecord) {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            currentTime,
                            manufacturerList,//:response[0].data || [], 
                            courierList,//:response[1].data  || [], 
                            recipientList,//:response[2].data  || [],   
                            timeZoneList,//:response[3].data  || [],                                                                                     
                            operation: goodsInParam.operation, screenName: goodsInParam.screenName,
                            selectedRecord,
                            openModal: true,
                            ncontrolCode: goodsInParam.ncontrolCode,
                            loading: false, selectedId
                        }
                    });
                }
                else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    toast.warn(intl.formatMessage({ id: "IDS_GOODSINALREADYRECEIVED" }));
                }
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

export function getGoodsInDetail(goodsIn, fromDate, toDate, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("goodsin/getGoodsIn", { nrmsno: goodsIn.nrmsno, fromDate, toDate, userinfo: userInfo })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }

            })
    }
}

export function getChainCustodyComboDataService(chainCustodyParam) {
    return function (dispatch) {

        // if (chainCustodyParam.masterData.SelectedGoodsIn.ntransactionstatus === transactionStatus.GOODS_IN) {
        //     toast.warn(intl.formatMessage({ id: "IDS_GOODSINNOTRECEIVED" }));
        // }
        // else {
        let selectedId = null;
        let selectedRecord = {
            "dreceiveddate": new Date(),
            "ntzreceiveddate": {
                "value": chainCustodyParam.userInfo.ntimezonecode,
                "label": chainCustodyParam.userInfo.stimezoneid
            },
            "stzreceiveddate": chainCustodyParam.userInfo.stimezoneid
        };

        if (chainCustodyParam.operation === "update") {
            if (chainCustodyParam.editRow.nreceivedownercode === chainCustodyParam.userInfo.nusercode) {
                selectedId = chainCustodyParam.primaryKeyValue;
                const timeZoneService = rsapi.post("timezone/getTimeZone");
                const ccById = rsapi.post("goodsin/getActiveChainCustodyById", { [chainCustodyParam.primaryKeyField]: chainCustodyParam.primaryKeyValue, "userinfo": chainCustodyParam.userInfo });
                const UTCtimeZoneService = rsapi.post("timezone/getLocalTimeByZone", { userinfo: chainCustodyParam.userInfo });
           
                const urlArray = [timeZoneService, ccById, UTCtimeZoneService];

                dispatch(initRequest(true));
                Axios.all(urlArray)
                    // dispatch(initRequest(true));
                    // return rsapi.post("goodsin/getActiveChainCustodyById", { [chainCustodyParam.primaryKeyField] : chainCustodyParam.primaryKeyValue, "userinfo": chainCustodyParam.userInfo} )
                    .then(response => {
                        selectedRecord = response[1].data;

                        let timeZone = [];
                        timeZone.push({ "value": response[1].data["ntzreceiveddate"], "label": response[1].data["stzreceiveddate"] });

                        const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
                            "stimezoneid", undefined, undefined, true);

                        const timeZoneList = timeZoneMap.get("OptionList");

                        selectedRecord["ntzreceiveddate"] = timeZone[0];
                        selectedRecord["stzreceiveddate"] = timeZone[0].label;

                        //selectedRecord["dreceiveddate"] = new Date(response[1].data["sreceiveddate"]);

                        selectedRecord["dreceiveddate"] = rearrangeDateFormat(chainCustodyParam.userInfo, response[1].data["sreceiveddate"]);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                timeZoneList,//:response[0].data  || [],                                                                                 
                                operation: chainCustodyParam.operation,
                                screenName: chainCustodyParam.screenName,
                                selectedRecord,
                                openChildModal: true,
                                ncontrolCode: chainCustodyParam.ncontrolCode,
                                loading: false, selectedId,
                                //currentTime:new Date(response[2].data)
                                currentTime:rearrangeDateFormat(chainCustodyParam.userInfo, response[2].data)
                            }
                        });

                    })
                    .catch(error => {
                        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                        if (error.response.status === 500) {
                            toast.error(intl.formatMessage({ id: error.message }));
                        }
                        else {
                            toast.warn(intl.formatMessage({ id: error.response.data }));
                        }
                    })
            }
            else {
                toast.warn(intl.formatMessage({ id: "IDS_INVALIDOWNERTOEDIT" }));
            }
        }
        else {
            dispatch(initRequest(true));
            const timeZoneService = rsapi.post("timezone/getTimeZone");
            const UTCtimeZoneService = rsapi.post("timezone/getLocalTimeByZone", { userinfo: chainCustodyParam.userInfo });
            const validateGoodsIn = rsapi.post("goodsin/validateGoodsIn", {
                nrmsno: chainCustodyParam.masterData.SelectedGoodsIn.nrmsno,
                userinfo: chainCustodyParam.userInfo
            });
            let urlArray = [timeZoneService, UTCtimeZoneService,validateGoodsIn];
            return Axios.all(urlArray)
                .then(response => {

                    const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, true);

                    const timeZoneList = timeZoneMap.get("OptionList");
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            timeZoneList,//:response.data  || [],
                            operation: chainCustodyParam.operation,
                            selectedRecord: { ...selectedRecord, 
                                //dreceiveddate: new Date(response[1].data) 
                                dreceiveddate: rearrangeDateFormat(chainCustodyParam.userInfo, response[1].data)
                            },
                            openChildModal: true,
                            screenName: chainCustodyParam.screenName,
                            ncontrolCode: chainCustodyParam.ncontrolCode,
                            loading: false, selectedId,
                            //currentTime:new Date(response[1].data)
                            currentTime: rearrangeDateFormat(chainCustodyParam.userInfo, response[1].data)
                        }
                    })
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
    }
    // }
}

export function getGoodsInPrinterComboService(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true))
        rsapi.post("barcode/getPrinter", inputParam.userInfo)
            .then(response => {
                let selectedRecord = {
                    sprintername: {
                        value: response.data[0].sprintername,
                        label: response.data[0].sprintername,
                        item: response.data[0]
                    }
                };
                const printerList = constructOptionList(response.data || [], "sprintername",
                    "sprintername", undefined, undefined, true).get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        printerList,
                        selectedRecord,
                        operation: "printer",
                        screenName: "PrintBarcode",
                        dataToPrint: inputParam.selectedGoodsIn.nrmsno,
                        ncontrolcode: inputParam.ncontrolcode,
                        loading: false,
                        openModal: true
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });

    }

}

export function reloadGoodsIn(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("goodsin/getGoodsIn", {...inputParam.inputData})
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false
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