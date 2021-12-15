import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { sortData } from '../components/CommonScript'//getComboLabelValue,, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import {queryTypeFilter} from '../components/Enumeration';



export function getSQLQueryDetail(sqlQuery, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("sqlquery/getSQLQuery", {
            nsqlquerycode: sqlQuery.nsqlquerycode,
            "userinfo": userInfo
        })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);

                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, queryResult: [], queryList: [], param: [], Dparam: [], TBLName: [] } });

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

export function getSQLQueryComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, queryTypeCode, ncontrolCode) {
    return function (dispatch) {

        if (operation === "create" || operation === "update") {

            let selectedRecord = {};
            const chartService = rsapi.post("sqlquery/getChartType", { userinfo: userInfo });
            const tableService = rsapi.post("sqlquery/getTablesFromSchema", {"tabletypecode": -1,"moduleformcode": 0, userinfo: userInfo });
            const tableType = rsapi.post("sqlquery/getQueryTableType", { userinfo: userInfo });
            let urlArray = [];
            if (operation === "create") {

                urlArray = [chartService, tableService,tableType];
            }
            else {
                const queryById = rsapi.post("sqlquery/getActiveSQLQueryById", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });

                urlArray = [chartService, tableService,tableType, queryById];
            }

            if (queryTypeCode === queryTypeFilter.LIMSDASHBOARDQUERY) {
                screenName = intl.formatMessage({ id: "IDS_LIMSDASHBOARDQUERY" });
            }
            else if (queryTypeCode === queryTypeFilter.LIMSALERTQUERY) {
                screenName = intl.formatMessage({ id: "IDS_LIMSALERTQUERY" });
            }
            else if (queryTypeCode === queryTypeFilter.LIMSBARCODEQUERY) {
                screenName = intl.formatMessage({ id: "IDS_LIMSBARCODEQUERY" });
            }
            else if (queryTypeCode === queryTypeFilter.LIMSGENERALQUERY) {
                screenName = intl.formatMessage({ id: "IDS_LIMSGENERALQUERY" });
            }
            else {
                screenName = intl.formatMessage({ id: "IDS_LIMSFILTERQUERY" });
            }

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    let chart = [];
                    if (operation === "update") {
                        selectedRecord = response[3].data;
                        chart.push({ "value": response[3].data["ncharttypecode"], "label": response[3].data["schartname"] });
                        selectedRecord["ncharttypecode"] = chart[0];
                    }

                    let tableName = undefined;
                    let tableNameOnly = [];
                    Object.values(response[1].data[0]).forEach(p => {
                        if (p.stable !== tableName) {
                            tableName = p.stable;
                            tableNameOnly.push({ tableName });
                        }
                    })

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            chartList: response[0].data || [],
                            tableList: response[1].data[0] || [],
                            tableType: response[2].data || [],
                            tableName: tableNameOnly || [],
                            operation, screenName, selectedRecord, openModal: true,
                            ncontrolCode, loading: false, showExecute: true, showParam: false, showValidate: true, showSave: false,
                            slideResult: [], slideList: [],
                            resultStatus: '', param: [], Dparam: [], TBLName: [], parentPopUpSize: "xl"
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
        // else {
        // }
    }
}

export function getTablesName(TableTypeCode,FormCode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("sqlquery/getTablesFromSchema", {
            //"tabletypecode": parseInt(selectedRecord["ntabletypecode"].value),"moduleformcode": parseInt(selectedRecord["nformcode"] ? selectedRecord["nformcode"].value: 0)
            "tabletypecode": parseInt(TableTypeCode),"moduleformcode": parseInt(FormCode)
            
        })
            .then(response => {

                let tableName = undefined;
                    let tableNameOnly = [];
                    Object.values(response.data[0]).forEach(p => {
                        if (p.stable !== tableName) {
                            tableName = p.stable;
                            tableNameOnly.push({ tableName });
                        }
                    })

                dispatch({ type: DEFAULT_RETURN, payload: {  tableList: response.data[0] || [],
                    tableName: tableNameOnly || [],loading: false } });

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

export function getModuleFormName(TableTypeCode,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("sqlquery/getModuleFormName", {
            "tabletypecode": parseInt(TableTypeCode), "userinfo": userInfo
            
        })
            .then(response => {

                dispatch({ type: DEFAULT_RETURN, payload: {  moduleFormName: response.data[0] || [],loading: false} });

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


export function executeUserQuery(inputParam) {
    return function (dispatch) {
        const Query = inputParam.query;
        const screenFlag = inputParam.screenFlag;
        const slideOperation = inputParam.slideOperation;
        const userInfo = inputParam.userInfo;
        const screenName = inputParam.screenName
        const data = inputParam.data;

        dispatch(initRequest(true));
        rsapi.post("/sqlquery/getSchemaQueryOutput", { "query": Query, userinfo: userInfo, "returnoption": "LIST" })
            .then(response => {
                const querycol = response.data[1];
                let keyarray = [];
                let temparray = [];
                let validColumns = true;
                if (querycol.length > 0) {
                    keyarray = Object.keys(querycol[0]);
                    let width="200px"
                    if(keyarray.length === 2){
                        width="300px"
                    }
                    for (let i = 0; i < keyarray.length; i++) {
                        if( keyarray[i]!==null && keyarray[i]!==''){
                            temparray.push({ "idsName": keyarray[i], "dataField": keyarray[i], "width": width
                            });
                        }else{
                            validColumns = false;
                        }
                    }
                }
                let respObject = {loading: false,
                                slideResult: response.data[1] || [],
                                slideList: temparray || [],
                                resultStatus: response.data[0] || '',
                                openModal: true,
                                showParam: true,
                                screenFlag
                                }

                if (screenFlag === "showQuery") 
                {
                    if (screenName === "Results") {
                        respObject = {...respObject,
                                        showExecute: false,                                       
                                        operation: "view",
                                        screenName: screenName,                                                               
                                        ...data
                                    }                         
                    }
                    else {
                        respObject = {...respObject, 
                                        showExecute: true,                                   
                                         operation: slideOperation,                           
                                    }
                    }
                }
                else 
                {
                    if (screenFlag === "NoParam") 
                    {
                        respObject = {...respObject,
                                            screenName: "Results",
                                            operation: "view",                                          
                                            queryResult: response.data[1] || [],
                                            queryList: temparray || [],  
                                            showExecute: inputParam.showExecute,
                                            showValidate:  inputParam.showValidate,
                                            showSave:  inputParam.showSave,
                                            noSave:  inputParam.noSave,                                          
                                        }                               
                    }
                    else {
                        respObject = {...respObject, queryResult: response.data[1] || [],
                                                    showExecute: true,                                                 
                                                    showValidate: false,
                                                    operation: "create",
                                                    screenName: "Parameter for Results",                                                                   
                                                    queryList: temparray || [],                                                    
                                                }                     
                    }                   
                }
                if(validColumns){
                    dispatch({ type: DEFAULT_RETURN, payload: {...respObject}});
                }else{
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                    toast.warn(intl.formatMessage({ id:"IDS_MAKESUREALLFIELDSHAVENAMEORALIASNAME"})) 
                }

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                   
                //toast.error(intl.formatMessage({ id: error.message }));
                if (error.response.status === 500) {                   
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function executeAlertUserQuery(Query, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/sqlquery/getSchemaQueryOutput", { "query": Query, userinfo: userInfo })
            .then(response => {


                const resultCount = response.data[1];



                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        resultCount: resultCount
                    }
                });

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                toast.error(intl.formatMessage({ id: error.message }));
            });
    }
}



export function comboChangeQueryType(querytypecode, data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/sqlquery/getSQLQueryByQueryTypeCode", { nquerytypecode: querytypecode, "userinfo": userInfo })
            .then(response => {

                const masterData = { ...data, ...response.data, searchedData: undefined }

                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false, queryList: []
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                toast.error(intl.formatMessage({ id: error.message }));
            });
    }
}

export function getColumnNamesByTableName(tableName, columnList) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/sqlquery/getColumnsFromTable", { "tablename": tableName })
            .then(response => {

                columnList = columnList || new Map();
                columnList.set(Object.keys(response.data)[0], Object.values(response.data)[0]);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        columnList, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                toast.error(intl.formatMessage({ id: error.message }));
            });
    }
}

export function comboColumnValues(tableName, fieldName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/sqlquery/getColumnValues", { "tablename": tableName, "fieldname": fieldName })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        fieldResult: response.data[1] || [], loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                toast.error(intl.formatMessage({ id: error.message }));
            });
    }
}
