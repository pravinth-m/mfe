import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { sortData, constructjsonOptionList, constructOptionList, parentChildComboLoad } from '../components/CommonScript';
import { replaceChildFromChildren } from '../components/droparea/helpers';

export function getReactInputFields(userinfo, operation) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("dynamicpreregdesign/getReactComponents", { userinfo })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ReactComponents: getJsonValue(response.data.components),
                        ReactTables: constructOptionList(response.data.tables, 'stablename', 'displayname').get("OptionList"),
                        selectedFieldRecord: {},
                        openModal: false,
                        loading: false,
                        openPortal: true,
                        operation
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function selectRegistrationTemplate(template, masterData, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("dynamicpreregdesign/getRegistrationTemplateById", {
            nreactregtemplatecode: template.nreactregtemplatecode,
            userinfo
        })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: { masterData: { ...masterData, selectedTemplate: response.data }, loading: false }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getRegistrationTemplate(selectedSampleType, masterData, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("dynamicpreregdesign/getDynamicPreRegDesign", {
            nsampletypecode: selectedSampleType.value,
            userinfo
        })
            .then(response => {
                masterData = { ...masterData, ...response.data }
                sortData(masterData)
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        realSampleType: [{
                            "label": "IDS_SAMPLETYPE",
                            "value": selectedSampleType.label,
                            "item": selectedSampleType
                        }],
                        loading: false
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getEditRegTemplate(masterData, userinfo, editId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("dynamicpreregdesign/getRegistrationTemplateById", {
            nreactregtemplatecode: masterData.selectedTemplate.nreactregtemplatecode,
            userinfo
        })
            .then(response => {
                let jsonData = JSON.parse(response.data.jsondata.value);
                sortData(masterData)
                dispatch(getReactInputFields(userinfo, "update"))

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        ncontrolcode: editId,
                        openPortal: true,
                        loading: false,
                        openModal: false,
                        design: jsonData,
                        selectedRecord: { templateName: response.data.sregtemplatename }
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getJsonValue(PGjsonData) {

    if (Array.isArray(PGjsonData)) {
        let JSONData = [];
        PGjsonData.map(data => {
            JSONData.push(JSON.parse(data.jsondata.value))
        })
        return JSONData;
    } else {
        return JSON.parse(PGjsonData.value);
    }

}
export function getTableColumns(design, selectedFieldRecord, stablename, userinfo, path) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("dynamicpreregdesign/getTableColumns", { stablename, userinfo })
            .then(response => {
                const staicColumns = response.data.jstaticcolumns ? getJsonValue(response.data.jstaticcolumns) : []
                const dynamicColumns = response.data.jdynamiccolumns ? getJsonValue(response.data.jdynamiccolumns) : []
                const multilingualColumns = response.data.jmultilingualcolumn ? getJsonValue(response.data.jmultilingualcolumn) : []
                const primaryKeyName = response.data.sprimarykeyname
                let defaultColumn;
                let comboData = []
                staicColumns.map(item => {
                    comboData.push({
                        label: item.displayname[userinfo.slanguagetypecode],
                        value: item.columnname,
                        item
                    })
                    if (item.default) {
                        defaultColumn = {
                            label: item.displayname[userinfo.slanguagetypecode],
                            value: item.columnname,
                            item
                        }
                    }
                })
                dynamicColumns.map(item => {
                    comboData.push({
                        label: item.displayname[userinfo.slanguagetypecode],
                        value: item.columnname,
                        item
                    })
                    if (item.default) {
                        defaultColumn = {
                            label: item.displayname[userinfo.slanguagetypecode],
                            value: item.columnname,
                            item
                        }
                    }
                })
                multilingualColumns.map(item => {
                    comboData.push({
                        label: item.displayname[userinfo.slanguagetypecode],
                        value: item.columnname,
                        item
                    })
                    if (item.default) {
                        defaultColumn = {
                            label: item.displayname[userinfo.slanguagetypecode],
                            value: item.columnname,
                            item
                        }
                    }
                })
                selectedFieldRecord = { ...selectedFieldRecord, column: defaultColumn, displaymember: defaultColumn.value };
                design = replaceChildFromChildren(design, path, selectedFieldRecord)
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        design,
                        selectedFieldRecord,
                        tableColumn: comboData,
                        primaryKeyName
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getPreviewTemplate(masterData, userinfo,
     editId, columnList, selectedRecord,childColumnList,comboComponents,withoutCombocomponent) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("dynamicpreregdesign/getComboValues", {
            parentcolumnlist: columnList,
            childcolumnlist:childColumnList,
            userinfo
        })
            .then(response => {
               const newcomboData=parentChildComboLoad(columnList,response.data,selectedRecord,childColumnList,withoutCombocomponent)
                sortData(masterData)
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        ncontrolcode: editId,
                        openModal: true,
                        loading: false,
                        comboData:newcomboData.comboData,
                        selectedRecord:newcomboData.selectedRecord,
                        comboComponents,
                        withoutCombocomponent
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

export function getChildValues(inputParem, 
    userinfo, selectedRecord, comboData,parentcolumnlist,
    childcolumnlist,withoutCombocomponent,parentListWithReadonly) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post('dynamicpreregdesign/getChildValues', {child:inputParem.child,
            parentdata:inputParem.item,parentsource:inputParem.source, 
            [inputParem.primarykeyField]:inputParem.value,valuemember:inputParem.primarykeyField,
             childcolumnlist, userinfo ,parentcolumnlist})
            .then(response => {
                let returnObj={...comboData, ...response.data}
                 returnObj=parentChildComboLoad(parentListWithReadonly, returnObj,selectedRecord,childcolumnlist,withoutCombocomponent,inputParem.item)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        comboData: { ...returnObj.comboData },
                        selectedRecord:returnObj.selectedRecord
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