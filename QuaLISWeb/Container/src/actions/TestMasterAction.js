import rsapi from "../rsapi";
import {
    toast
} from "react-toastify";
import {
    constructOptionList,
    sortData
} from "../components/CommonScript";
import {
    DEFAULT_RETURN
} from "./LoginTypes";
import Axios from "axios";
import {
    initRequest
} from "./LoginAction";
import {
    transactionStatus,
    attachmentType
} from "../components/Enumeration";
import {
    intl
} from "../components/App";

//Test click
export const getTestMaster = (testItem, userInfo, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/testmaster/getTestById", {
                ntestcode: testItem.ntestcode,
                userinfo: userInfo
            })
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        dataState: undefined
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }
}

//tab click
export const getTestDetails = (inputParam) => {
    return function (dispatch) {
        const testParameter = inputParam.testParameter;
        dispatch(initRequest(true));
        rsapi.post("/testmaster/getothertestdetails", {
                ntestcode: testParameter.ntestcode,
                "nFlag": inputParam.nFlag,
                ntestparametercode: testParameter.ntestparametercode,
                userinfo: inputParam.userInfo
            })
            .then(response => {
                let masterData = inputParam.masterData
                masterData = {
                    ...masterData,
                    ...response.data
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}



//Add Test
export const addTest = (operation, testmaster, userInfo, ncontrolCode, nfilterTestCategory) => {
    return function (dispatch) {
        if (nfilterTestCategory && Object.values(nfilterTestCategory).length > 0) {
            dispatch(initRequest(true));
            const urlArray = [
                rsapi.post("testcategory/getTestCategory", {
                    "userinfo": userInfo
                }),
                rsapi.post("checklist/getApprovedChecklist", {
                    "userinfo": userInfo
                })
            ];
            if (operation === "update") {
                urlArray.push(rsapi.post("testmaster/getActiveTestById", {
                    "userinfo": userInfo,
                    ntestcode: testmaster.ntestcode
                }))
            } else if (operation === "create") {
                urlArray.push(rsapi.post("parametertype/getParameterType", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi.post("grade/getGrade", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi.post("section/getSection", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi.post("method/getMethod", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi.post("unit/getUnit", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi.post("instrumentcategory/fetchinstrumentcategory", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi.post("testmaster/getAddTest", {
                    "userinfo": userInfo
                }));
            } else if (operation === "copy") {
                urlArray.push(rsapi.post("testmaster/validateCopyTest", {
                    "userinfo": userInfo,
                    ntestcode: testmaster.ntestcode
                }));
            }
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    const testCategoryMap = constructOptionList(response[0].data || [], "ntestcategorycode", "stestcategoryname", false, false, true);
                    const testCategory = testCategoryMap.get("OptionList");
                    const checklistMap = constructOptionList(response[0].data || [], "nchecklistversioncode", "schecklistname", false, false, true);
                    const ChecklistVersion = checklistMap.get("OptionList");
                    const testData = {
                        testCategory,
                        ChecklistVersion
                    };
                    let parameterData = {};
                    let otherTestData = {}
                    let needOtherTest = false;
                    if (operation === "update") {
                        const editData = response[2].data;
                        selectedRecord = editData;
                        selectedRecord["ntestcategorycode"] = {
                            "value": editData["ntestcategorycode"],
                            "label": editData["stestcategoryname"]
                        };
                        selectedRecord["nchecklistversioncode"] = {
                            "value": editData["nchecklistversioncode"],
                            "label": editData["schecklistname"]
                        };
                    } else if (operation === "copy") {
                        selectedRecord = {
                            ntestcategorycode: nfilterTestCategory.value === -2 ? (testCategory.length > 0 ?
                                // {"label": testCategory[0].stestcategoryname, "value": testCategory[0].ntestcategorycode}
                                testCategory[0] : "") : nfilterTestCategory,
                            ntransactionstatus: transactionStatus.ACTIVE,
                            naccredited: transactionStatus.NOTACCREDITED,
                            stestsynonym: "",
                            stestname: "",
                            sdescription: "",
                            ncost: ""
                        }
                    } else {
                        // const { Grade } = response[7].data; //ParameterType
                        const parameterMap = constructOptionList(response[2].data || [], "nparametertypecode", "sdisplaystatus", false, false, true);
                        // const parameterType = parameterMap.get("OptionList");//response[2].data;
                        const gradeMap = constructOptionList(response[3].data || [], "ngradecode", "sdisplaystatus", false, false, true);
                        // const grade = gradeMap.get("OptionList");// response[3].data;
                        const parameterItem = parameterMap.get("DefaultValue") ? parameterMap.get("DefaultValue") : ""; //parameterType.filter(item=>{ return item.nparametertypecode === 3 });//ParameterType[0];
                        selectedRecord = {
                            // nsectioncode: {"value": response[2].data[0].nsectioncode, "label": response[2].data[0].ssectionname},
                            nunitcode: -1,
                            nparametertypecode: parameterItem, //{"value": parameterItem[0].nparametertypecode, "label": parameterItem[0].sdisplaystatus},
                            ntestcategorycode: nfilterTestCategory.value === -2 ? (testCategory.length > 0 ?
                                // {"label": testCategory[0].stestcategoryname, "value": testCategory[0].ntestcategorycode}: "")
                                testCategory[0] : "") : nfilterTestCategory,
                            ntransactionstatus: transactionStatus.ACTIVE,
                            naccredited: transactionStatus.NOTACCREDITED,
                            stestsynonym: "",
                            stestname: "",
                            sdescription: "",
                            ncost: ""
                        }
                        let needUnit = true;
                        let needRoundingDigit = true;
                        let needCodedResult = true;
                        let needActualResult = true;
                        let npredefinedcode = transactionStatus.NO;
                        const unitMap = constructOptionList(response[6].data || [], "nunitcode", "sunitname", false, false, true);
                        if (parameterItem && parameterItem.item) {
                            if (parameterItem.item["nunit"] === transactionStatus.YES) {
                                needUnit = false;
                                selectedRecord["nunitcode"] = unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : "";
                                //{"value": response[4].data[0]["nunitcode"], "label": response[4].data[0]["sunitname"]};
                            }
                            if (parameterItem.item["nroundingdigit"] === transactionStatus.YES) {
                                needRoundingDigit = false;
                            }
                            if (parameterItem.item["npredefinedcode"] === transactionStatus.YES) {
                                needCodedResult = false;
                                npredefinedcode = parameterItem.item["npredefinedcode"];
                            }
                            if (parameterItem.item["ngrade"] === transactionStatus.YES) {
                                needActualResult = false;
                                selectedRecord["ngradecode"] = gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : "";
                                //{"value": Grade.ngradecode, "label": Grade["sdisplaystatus"]};
                            }
                        }
                        // const testParameterMap = constructOptionList(response[8].data["TestParameter"] || [], "nparametertypecode", "sdisplaystatus", false, false, true);
                        parameterData = {
                            grade: gradeMap.get("OptionList"),
                            parameterType: parameterMap.get("OptionList"),
                            unit: unitMap.get("OptionList"),
                            needRoundingDigit,
                            needUnit,
                            needCodedResult,
                            needActualResult,
                            npredefinedcode,
                            testParameter: constructOptionList(response[8].data["TestParameter"] || [], 'sparametername', 'sparametername', false, false, true).get("OptionList"),
                            defaultUnit: unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : "",
                            defaultGrade: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : ""
                            //testParameterMap.get("OptionList")
                        };
                        const sectionMap = constructOptionList(response[4].data || [], "nsectioncode", "ssectionname", false, false, true);
                        const methodMap = constructOptionList(response[5].data || [], "nmethodcode", "smethodname", false, false, true);
                        const instCatMap = constructOptionList(response[7].data || [], "ninstrumentcatcode", "sinstrumentcatname", false, false, true);
                        otherTestData = {
                            section: sectionMap.get("OptionList"),
                            method: methodMap.get("OptionList"),
                            instrumentcategory: instCatMap.get("OptionList")
                        }
                        needOtherTest = true;
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openModal: true,
                            needOtherTest,
                            operation: operation,
                            screenName: "IDS_TEST",
                            selectedRecord,
                            ncontrolCode,
                            testData,
                            parameterData,
                            otherTestData,
                            loading: false
                        }
                    });
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        }
                    });
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_TESTCATEGORYNOTAVAILABLE"
            }))
        }
    }
}

//Add Test Parameter
export const addParameter = (operation, ntestparametercode, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        const urlArray = [
            rsapi.post("unit/getUnit", {
                "userinfo": userInfo
            }),
            rsapi.post("parametertype/getParameterType", {
                "userinfo": userInfo
            }),
            rsapi.post("grade/getGrade", {
                "userinfo": userInfo
            }),
            rsapi.post("testmaster/getAddTest", {
                "userinfo": userInfo
            })
        ];
        if (operation === "update") {
            urlArray.push(rsapi.post("testmaster/getActiveParameterById", {
                ntestparametercode: ntestparametercode,
                "userinfo": userInfo
            }));
        }
        Axios.all(urlArray)
            .then(response => {
                // const { Grade, ParameterType } = response[1].data;
                const parameterMap = constructOptionList(response[1].data || [], "nparametertypecode", "sdisplaystatus", false, false, true);
                const gradeMap = constructOptionList(response[2].data || [], "ngradecode", "sdisplaystatus", false, false, true);
                const unitMap = constructOptionList(response[0].data || [], "nunitcode", "sunitname", false, false, true);
                //response[2].data;
                // const grade = response[2].data;
                // const parameterType = response[1].data;
                let selectedRecord = {};
                let needUnit = true;
                let needRoundingDigit = true;
                let needCodedResult = true;
                let needActualResult = true;
                let npredefinedcode = transactionStatus.No;
                if (operation === "update") {
                    const editTestParameter = response[4].data.TestParameter[0];
                    selectedRecord = editTestParameter;
                    const nparametertypecode = editTestParameter["nparametertypecode"];
                    const parameterItem = parameterMap.get("OptionList").filter(function (item) {
                        return item.value === nparametertypecode;
                    });
                    selectedRecord["sparametername"] = {
                        value: editTestParameter["sparametername"],
                        label: editTestParameter["sparametername"]
                    };
                    selectedRecord["nparametertypecode"] = {
                        value: nparametertypecode,
                        label: editTestParameter["sdisplaystatus"]
                    };
                    if (parameterItem && parameterItem[0].item) {
                        const selectedParameterItem = parameterItem[0].item;
                        if (selectedParameterItem["nunitrequired"] === transactionStatus.YES) {
                            needUnit = false;
                            selectedRecord["nunitcode"] = {
                                value: editTestParameter["nunitcode"],
                                label: editTestParameter["sunitname"]
                            };
                        }
                        if (selectedParameterItem["nroundingrequired"] === transactionStatus.YES) {
                            needRoundingDigit = false;
                        }

                        if (selectedParameterItem["npredefinedrequired"] === transactionStatus.YES || selectedParameterItem["ngraderequired"] === transactionStatus.YES) {
                            const editCodedResult = response[4].data.TestPredefinedParameter;
                            if (editCodedResult.length > 0) {
                                const defaultCodedResult = editCodedResult.filter(function (item) {
                                    return item.ndefaultstatus === transactionStatus.YES;
                                });
                                if (defaultCodedResult.length > 0) {
                                    selectedRecord["spredefinedname"] = defaultCodedResult[0].spredefinedname;
                                    selectedRecord["ntestpredefinedcode"] = defaultCodedResult[0].ntestpredefinedcode;;
                                    selectedRecord["ngradecode"] = {
                                        value: defaultCodedResult[0].ngradecode,
                                        label: defaultCodedResult[0]["sdisplaystatus"]
                                    };
                                } else {
                                    selectedRecord["spredefinedname"] = editCodedResult[0].spredefinedname;
                                    selectedRecord["ntestpredefinedcode"] = editCodedResult[0].ntestpredefinedcode;
                                    selectedRecord["ngradecode"] = {
                                        value: editCodedResult[0].ngradecode,
                                        label: editCodedResult[0]["sdisplaystatus"]
                                    };
                                }
                            }
                        } else {
                            selectedRecord["spredefinedname"] = "";
                            selectedRecord["ngradecode"] = -1;
                        }
                        if (selectedParameterItem["npredefinedrequired"] === transactionStatus.YES) {
                            needCodedResult = false;
                            npredefinedcode = selectedParameterItem["npredefinedcode"];
                        }
                        if (selectedParameterItem["ngraderequired"] === transactionStatus.YES) {
                            needActualResult = false;
                        }
                    }
                } else {
                    const parameterItem = parameterMap.get("DefaultValue") ? parameterMap.get("DefaultValue").item : {};
                    // parameterType.filter(item=>{ return item.nparametertypecode === transactionStatus.YES });
                    if (parameterItem["nunitrequired"] === transactionStatus.YES) {
                        needUnit = false;
                        selectedRecord["nunitcode"] = unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : ""; //{"value": response[0].data[0]["nunitcode"], "label": response[0].data[0]["sunitname"]};
                    }
                    if (parameterItem["nroundingrequired"] === transactionStatus.YES) {
                        needRoundingDigit = false;
                    }
                    if (parameterItem["npredefinedcrequired"] === transactionStatus.YES) {
                        needCodedResult = false;
                        npredefinedcode = parameterItem["npredefinedcode"];
                    }
                    if (parameterItem["ngraderequired"] === transactionStatus.YES) {
                        needActualResult = false;
                        // selectedRecord["ngradecode"] = {"value": Grade.ngradecode, "label": Grade["sdisplaystatus"]};
                    }
                    selectedRecord["nparametertypecode"] = parameterMap.get("DefaultValue"); //{value: parameterItem[0].nparametertypecode, label: parameterItem[0].sdisplaystatus};
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: true,
                        operation: operation,
                        screenName: "IDS_PARAMETER",
                        selectedRecord,
                        parameterData: {
                            unit: unitMap.get("OptionList"),
                            grade: gradeMap.get("OptionList"),
                            parameterType: parameterMap.get("OptionList"),
                            needUnit,
                            needRoundingDigit,
                            needCodedResult,
                            needActualResult,
                            npredefinedcode,
                            testParameter: constructOptionList(response[3].data["TestParameter"] || [], 'sparametername', 'sparametername', false, false, true).get("OptionList"),
                            defaultUnit: unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : "",
                            defaultGrade: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : ""
                        },
                        ncontrolCode,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//Add Coded result
export const addCodedResult = (operation, paramdata, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        const urlArray = [
            rsapi.post("testmaster/getAddTest", {
                "userinfo": userInfo
            }),
            rsapi.post("grade/getGrade", {
                "userinfo": userInfo
            })
        ];
        if (operation === "update") {
            urlArray.push(rsapi.post("testmaster/getActivePredefinedParameterById", {
                ntestpredefinedcode: paramdata["ntestpredefinedcode"],
                "userinfo": userInfo
            }));
        }
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                // const grade = response[1].data;
                const gradeMap = constructOptionList(response[1].data || [], "ngradecode", "sdisplaystatus", false, false, true);
                if (operation === "update") {
                    const editCodedResult = response[2].data;
                    selectedRecord = {
                        ntestpredefinedcode: paramdata["ntestpredefinedcode"],
                        ntestparametercode: paramdata["ntestparametercode"],
                        ngradecode: {
                            "label": editCodedResult["sdisplaystatus"],
                            "value": editCodedResult["ngradecode"]
                        },
                        spredefinedname: editCodedResult["spredefinedname"],
                        ndefaultstatus: editCodedResult["ndefaultstatus"],
                    }
                } else {
                    selectedRecord = {
                        ntestparametercode: paramdata["ntestparametercode"],
                        ngradecode: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : "" //{"value": grade[0].ngradecode, "label": grade[0]["sdisplaystatus"]}
                    }
                }
              
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: operation,
                        screenName: "IDS_CODEDRESULT",
                        parameterData: {
                            grade: gradeMap.get("OptionList"),
                            defaultGrade: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : ""
                        },
                        selectedRecord,
                        ncontrolCode,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//Add parameter specification
export const addParameterSpecification = (operation, paramdata, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let inputparam = [];
        let surl = "";
        if (operation === "update") {
            surl = "getParameterSpecificationById";
            inputparam = {
                userinfo: userInfo,
                ntestparamnumericcode: paramdata["ntestparamnumericcode"]
            };
        } else {
            surl = "getParameterSpecificationByCount";
            inputparam = {
                userinfo: userInfo,
                ntestparametercode: paramdata["ntestparametercode"]
            };
        }
        rsapi.post("testmaster/" + surl, inputparam)
            .then(response => {
                let selectedRecord = {};
                if (operation === "update") {
                    selectedRecord = {
                        ...response.data
                    }
                } else {
                    selectedRecord = {
                        ntestparametercode: paramdata["ntestparametercode"]
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: operation,
                        screenName: "IDS_SPECIFICATION",
                        selectedRecord,
                        ncontrolCode,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const getAvailableData = (testItem, url, key, screenName, userInfo, ncontrolCode) => {
    return (dispatch) => {
        const inputParam = {
            TestMaster: testItem,
            "userinfo": userInfo
        }
        dispatch(initRequest(true));
        rsapi.post("testmaster/" + url, inputParam)
            .then(response => {
                const availableDataMap = constructOptionList(response.data, key === "section" ? "nsectioncode" : key === "method" ? "nmethodcode" : "ninstrumentcatcode",
                    key === "section" ? "ssectionname" : key === "method" ? "smethodname" : "sinstrumentcatname", false, false, true);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        otherTestData: {
                            [key]: availableDataMap.get("OptionList")
                        },
                        screenName: screenName,
                        selectedRecord: {
                            availableData: ""
                        },
                        operation: "create",
                        ncontrolCode,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
    }
}

//Add formula
export const addFormula = (paramdata, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("testmaster/addTestFormula", {
                userinfo: userInfo,
                nFlag: 1
            })
            .then(response => {
                const responseData = response.data;
                const testMasterMap = constructOptionList(responseData["TestMaster"], "ntestcode", "stestname", false, false, false);
                const testCategoryMap = constructOptionList(responseData["TestCategory"], "ntestcategorycode", "stestcategoryname", false, false, true);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: "create",
                        screenName: "IDS_FORMULA",
                        formulaData: {
                            operators: responseData["Operators"],
                            functions: responseData["Functions"],
                            testCategory: testCategoryMap.get("OptionList"),
                            testMaster: testMasterMap.get("OptionList"),
                            dynamicFormulaFields: responseData["DynamicFormulaFields"]
                        },
                        isFormulaOpen: true,
                        selectedRecord: {
                            ntestcategorycode: testCategoryMap.get("OptionList") && testCategoryMap.get("OptionList").length > 0 ? testCategoryMap.get("OptionList")[0] : "", //responseData["TestCategory"].length>0? {"label": responseData["TestCategory"][0]["stestcategoryname"], "value": responseData["TestCategory"][0]["ntestcategorycode"]}: "",
                            ntestcode: testMasterMap.get("OptionList") && testMasterMap.get("OptionList").length > 0 ? testMasterMap.get("OptionList")[0] : "", //responseData["TestMaster"].length>0? {"label": responseData["TestMaster"][0]["stestname"], "value": responseData["TestMaster"][0]["ntestcode"]}: "",
                            ntestparametercode: paramdata["ntestparametercode"]
                        },
                        ncontrolCode,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//Formula test category and test change event function
export const formulaChangeFunction = (inputParam, formulaData, caseNo, selectedRecordData, methodUrl) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/testmaster" + methodUrl, inputParam)
            .then(response => {
                const masterData = response.data;
                const testMasterMap = constructOptionList(masterData["TestMaster"] || [], "ntestcode", "stestname", false, false, true);
                dispatch({
                    type: DEFAULT_RETURN,

                    payload: caseNo === 1 ? {
                        formulaData: {
                            ...formulaData,
                            testMaster: testMasterMap.get("OptionList"),
                            dynamicFormulaFields: masterData["DynamicFormulaFields"] || []
                        },
                        selectedRecord: {
                            ...selectedRecordData,
                            ntestcode: testMasterMap.get("OptionList") && testMasterMap.get("OptionList").length > 0 ? testMasterMap.get("OptionList")[0] : ""
                            // masterData["TestMaster"].length>0? {"label": masterData["TestMaster"][0]["stestname"], "value": masterData["TestMaster"][0]["ntestcode"]}: ""
                        },
                        loading: false
                    } : {
                        formulaData: {
                            ...formulaData,
                            dynamicFormulaFields: masterData["DynamicFormulaFields"]
                        },
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }
}

export const changeTestCategoryFilter = (inputParam, filterTestCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/testmaster/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterTestCategory,
                            nfilterTestCategory: inputParam.inputData.nfilterTestCategory
                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }
}

export const addTestFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi.post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi.post("/testmaster/editTestFile", {
                userinfo: inputParam.userInfo,
                testfile: inputParam.selectedRecord
            }))
        }
        Axios.all(urlArray)
            .then(response => {
                const linkMap = constructOptionList(response[0].data.LinkMaster, "nlinkcode", "slinkname", false, false, true);
                const linkmaster = linkMap.get("OptionList");
                let selectedRecord = {};
                const defaultLink = linkmaster.filter(items => items.item.ndefaultlink === transactionStatus.YES);
                let disabled = false;
                let editObject = {};
                if (inputParam.operation === "update") {
                    editObject = response[1].data;
                    let nlinkcode = {};
                    let link = {};
                    if (editObject.nattachmenttypecode === attachmentType.LINK) {
                        nlinkcode = {
                            "label": editObject.slinkname,
                            "value": editObject.nlinkcode
                        }

                        link = {
                            slinkfilename:editObject.sfilename,
                            slinkdescription:editObject.sdescription,
                            nlinkdefaultstatus:editObject.ndefaultstatus,
                            sfilesize:'',
                            nfilesize:0,
                            ndefaultstatus:4,
                            sfilename:'',
                        }

                    } else {
                        nlinkcode = defaultLink.length > 0 ? defaultLink[0] : "" //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:""
                        link = {
                            slinkfilename:'',
                            slinkdescription:'',
                            nlinkdefaultstatus:4,
                            sfilesize:editObject.sfilesize,
                            nfilesize:editObject.nfilesize,
                            ndefaultstatus:editObject.ndefaultstatus,
                            sfilename:editObject.sfilename,
                        }
                    }



                    selectedRecord = {
                        ...link,
                        ntestfilecode:editObject.ntestfilecode,
                        nattachmenttypecode:editObject.nattachmenttypecode,
                      //  ...editObject,
                        nlinkcode,
        
                       // disabled: true
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode:response[0].data.AttachmentType.length>0?
                        response[0].data.AttachmentType[0].nattachmenttypecode:attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:"",
                        disabled
                    };
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        [inputParam.modalName]: true,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord,
                        loading: false,
                        linkMaster: linkmaster,
                        showSaveContinue: false,
                        editFiles: editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {}
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}