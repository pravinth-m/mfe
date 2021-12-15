import {
    toast
} from "react-toastify";
import rsapi from "../rsapi";
import {
    DEFAULT_RETURN
} from "./LoginTypes";
import {
    attachmentType,
    parameterType,
    transactionStatus
} from "../components/Enumeration";
import {
    constructOptionList,
    rearrangeDateFormat,
    //formatInputDate,
    sortData
} from "../components/CommonScript";
import Axios from "axios";
import {
    intl
} from "../components/App";
import {
    initRequest
} from "./LoginAction";


export const sampleTypeOnChange = (inputParam, masterData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/testgroup" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                sortData(response.data);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        tempFilterData: inputParam.inputData.tempFilterData,
                        masterData: {
                            ...masterData,
                            ...response.data
                        },
                        loading: false
                    }
                });
            })
            .catch(error => {
                if (error.response.status === 409 || error.response.status === 417) {
                    masterData["ExistingLinkTable"] = [];
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false
                        }
                    });
                    toast.warn(error.response.data);
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        }
                    });
                    toast.error(error.message)
                }
            });
    }
}

export const filterTestGroup = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/testgroup/filterTestGroup", inputParam.inputData)
            .then(response => {
                sortData(response.data);
                searchRef.current.value = "";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        filterData: inputParam.inputData.filterData,
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData: undefined
                        },
                        loading: false,
                        historyDataState : {...inputParam.historyDataState, sort:undefined, filter:undefined}
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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

export const createTree = (selectedRecord, userInfo, selectedNode, ncontrolCode) => {
    return (dispatch) => {
        if (selectedRecord.nproductcode) {
            const inputParam = {
                sampletype: selectedRecord.nsampletypecode.item,
                ncategorycode: selectedRecord.nproductcatcode.value,
                ntreeversiontempcode: selectedRecord.ntreeversiontempcode.value,
                userinfo: userInfo,
                treetemplatemanipulation: selectedNode
            }
            dispatch(initRequest(true));
            rsapi.post("/testgroup/getTemplateMasterDetails", {
                    ...inputParam
                })
                .then(response => {
                    const treetempTranstestGroup = response.data["TreetempTranstestGroup"] || [];

                    // const treeMandatoryFields = treetempTranstestGroup.map((item, index) => {
                    //         return {
                    //             "idsName": item.slabelname,
                    //             "dataField": "sleveldescription_" + index,
                    //             "mandatory": true
                    //         }
                    // });

                  //  const selectedNodeLevel = selectedNode ? selectedNode.slevelcode.split("/1").length-2 : -1;
                    const mandatoryFields = [];
                    treetempTranstestGroup.forEach((item, index) => {
                        if (item.sleveldescription === null){
                            mandatoryFields.push({
                                "idsName": item.slabelname,
                                "dataField": "sleveldescription_" + index,
                                "mandatory": true
                            })
                        }
                    });
                   
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openModal: true,
                            operation: "create",
                            screenName: "IDS_PROFILETREE",
                            TreetempTranstestGroup: treetempTranstestGroup,
                            treeMandatoryFields :mandatoryFields,
                            //selectedRecord,
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
                    if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_PRODUCTNOTAVAILABLE"
            }));
        }
    }
}

export const editTree = (operation, selectedNode, userinfo, ncontrolCode) => {
    return (dispatch) => {
        if (selectedNode) {
            dispatch(initRequest(true));
            rsapi.post("/testgroup/getTreeById", {
                    userinfo,
                    treetemplatemanipulation: selectedNode
                })
                .then(response => {
                    const treetempTranstestGroup = response.data;
                    const treeMandatoryFields = treetempTranstestGroup && [{
                        "idsName": treetempTranstestGroup.slabelname,
                        "dataField": "sleveldescription",
                        "mandatory": true
                    }];
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openModal: true,
                            operation: operation,
                            screenName: "IDS_EDITTREE",
                            selectedRecord: {
                                ...treetempTranstestGroup
                            },
                            treeMandatoryFields,
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
                    if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTPROFILENODETOEDIT"
            }))
        }
    }
}

export const addSpecification = (operation, inputParam, ncontrolCode) => {
    return (dispatch) => {
        //if (inputParam.selectedNode != null && inputParam.selectedNode.schildnode === "") {
        if (inputParam.selectedNode != null && inputParam.selectedNode.nnextchildcode === -1){
            let urlArray = [rsapi.post("timezone/getTimeZone")];
            if (operation === "update") {
                const testgroupspecification = inputParam.testgroupspecification[0];
                if (testgroupspecification.napprovalstatus === transactionStatus.CORRECTION ||
                    testgroupspecification.napprovalstatus === transactionStatus.DRAFT) {
                    urlArray.push(rsapi.post("/testgroup/getActiveSpecificationById", {
                        testgroupspecification,
                        userinfo: inputParam.userinfo
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                    }));
                    return;
                }
            } else {
                urlArray.push(rsapi.post("/testgroup/getAddSpecification", {
                    userinfo: inputParam.userInfo,
                    //currentdate: formatInputDate(new Date(), true)
                }));
            }
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    if (operation === "update") {
                        selectedRecord = {
                            sproductname: inputParam.selectedRecord.nproductcode.label,
                            ...response[1].data,
                            //dexpirydate: new Date(response[1].data["sexpirydate"]),
                            dexpirydate: rearrangeDateFormat(inputParam.userinfo,response[1].data["sexpirydate"]),
                            ntzexpirydate: {
                                "label": response[1].data.stimezoneid,
                                "value": response[1].data.ntzexpirydate
                            }
                        };
                    } else {
                        selectedRecord = {
                            sproductname: inputParam.selectedRecord.nproductcode.label,
                            sspecname: inputParam.selectedNode.sleveldescription,
                            //dexpirydate: new Date(response[1].data.ExpiryDate),
                            dexpirydate: rearrangeDateFormat(inputParam.userInfo,response[1].data.ExpiryDate),
                            ncomponentrequired: transactionStatus.YES,
                            ntransactionstatus: transactionStatus.ACTIVE,
                            ntzexpirydate: {
                                "label": inputParam.userInfo.stimezoneid,
                                "value": inputParam.userInfo.ntimezonecode
                            }
                        };
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openModal: true,
                            operation: operation,
                            screenName: "IDS_SPECIFICATION",
                            selectedRecord,
                            timeZoneList: constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", false, false, true).get("OptionList"),
                            ncontrolCode
                        }
                    });
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        } 
        else {
            if (operation === "copy") {
                toast.warn(intl.formatMessage({
                    id: "IDS_SELECTSPECIFICATION"
                }));
            } else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SELECTLASTLEVELNODETOADDSPEC"
                }));
            }
        }
    }
}

export const addComponent = (SelectedSpecification, userInfo, ncontrolCode) => {
    return (dispatch) => {
        rsapi.post("/testgroup/getAvailableComponent", {
                userinfo: userInfo,
                testgroupspecification: SelectedSpecification
            })
            .then(response => {
                const testGroupSpecSampleType = response.data["TestGroupSpecSampleType"] || [];
                if (testGroupSpecSampleType.length > 0) {
                    const testCategory = constructOptionList(response.data["TestCategory"] || [], "ntestcategorycode", "stestcategoryname", 'ntestcategorycode', 'ascending', false);
                    const sampleTypeMap = constructOptionList(testGroupSpecSampleType, "ncomponentcode", "scomponentname", false, false, true);
                    const TestGroupTestMap = constructOptionList(response.data["TestGroupTest"]||[], "ntestcode", "stestname", false, false, true);
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openModal: true,
                            operation: "create",
                            screenName: "IDS_COMPONENT",
                            testGroupInputData: {
                                TestCategory: testCategory.get("OptionList"),
                                TestGroupSpecSampleType: sampleTypeMap.get("OptionList"),
                                TestGroupTest: TestGroupTestMap.get("OptionList"),
                            },
                            selectedRecord: {
                                ncomponentcode: sampleTypeMap.get("DefaultValue"),
                                ntestcategorycode: testCategory.get("DefaultValue") ? testCategory.get("DefaultValue") : testCategory.get("OptionList")[0]
                            },
                            ncontrolCode
                        }
                    });
                } else {
                    toast.warn(intl.formatMessage({id: "IDS_COMPONENTNOTAVAILABLE"}));
                }
            })
            .catch(error => {
                if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            })
    }
}

export const addTestGroupTest = (selectedComponent, userInfo, ncontrolCode, selectedSpecification) => {
    return dispatch => {
        if (selectedSpecification) {
            if (selectedSpecification.napprovalstatus === transactionStatus.DRAFT ||
                selectedSpecification.napprovalstatus === transactionStatus.CORRECTION) {
                if (selectedComponent) {
                    rsapi.post("/testgroup/getAvailableTest", {
                            userinfo: userInfo,
                            testgroupspecsampletype: selectedComponent
                        })
                        .then(response => {
                            const testCategory = constructOptionList(response.data["TestCategory"], "ntestcategorycode", "stestcategoryname", "ntestcategorycode", "ascending", false);
                            const TestGroupTestMap = constructOptionList(response.data["TestGroupTest"]||[], "ntestcode", "stestname", false, false, true);
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    openModal: true,
                                    operation: "create",
                                    screenName: "IDS_TEST",
                                    testGroupInputData: {
                                        TestCategory: testCategory.get("OptionList"),
                                        TestGroupTest: TestGroupTestMap.get("OptionList"),
                                    },
                                    selectedRecord: {
                                        ntestcategorycode:  {label:response.data["SelectedTestCategory"].stestcategoryname,
                                                             value: response.data["SelectedTestCategory"].stestcategorycode,
                                                             item:response.data["SelectedTestCategory"]}
                                        //ntestcategorycode: testCategory.get("DefaultValue") ? testCategory.get("DefaultValue") : testCategory.get("OptionList")[0]
                                    },
                                    ncontrolCode
                                }
                            });
                        })
                        .catch(error => {
                            if (error.response.status === 409 || error.response.status === 417) {
                                toast.warn(error.response.data);
                            } else {
                                toast.error(error.message);
                            }
                        });
                } else {
                    toast.warn(intl.formatMessage({
                        id: "IDS_NEEDCOMPONENTTOADDTEST"
                    }));
                }
            } else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                }));
            }
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTSPECIFICATION"
            }));
        }
    }
}

export const editTestGroupTest = (operation, selectedTest, userInfo, ncontrolCode, selectedSpecification) => {
    return dispatch => {
        if (selectedSpecification.napprovalstatus === transactionStatus.DRAFT ||
            selectedSpecification.napprovalstatus === transactionStatus.CORRECTION) {
            const ntestcode = selectedTest.ntestcode;
            const urlArray = [
                rsapi.post("/testgroup/getActiveTestById", {
                    userinfo: userInfo,
                    testgrouptest: selectedTest
                }),
                rsapi.post("/source/getSource", {
                    userinfo: userInfo
                }),
                rsapi.post("/testmaster/getSection", {
                    ntestcode, userinfo: userInfo
                }),
                rsapi.post("/testmaster/getMethod", {
                    ntestcode, userinfo: userInfo
                }),
                rsapi.post("/testmaster/getInstrumentCategory", {
                    ntestcode, userinfo: userInfo
                }),
                rsapi.post("/testmaster/getTestAttachment", {
                    ntestcode, userinfo: userInfo
                })
            ]
            Axios.all(urlArray)
                .then(response => {
                    const editObject = response[0].data.TestGroupTest;
                    const testFileItem = response[0].data.TestGroupTestFile;

                   
                    const selectedRecord = {
                        ...editObject,
                        nsourcecode: {
                            "label": editObject.ssourcename,
                            "value": editObject.nsourcecode
                        },
                        nsectioncode: {
                            "label": editObject.ssectionname,
                            "value": editObject.nsectioncode
                        },
                        // nmethodcode: {
                        //     "label": editObject.smethodname,
                        //     "value": editObject.nmethodcode
                        // },
                        // ninstrumentcatcode: {
                        //     "label": editObject.sinstrumentcatname,
                        //     "value": editObject.ninstrumentcatcode
                        // }
                    };
                    if (testFileItem) {
                        selectedRecord["ntestfilecode"] = {
                            "label": testFileItem.sfilename,
                            "value": testFileItem.ntestgroupfilecode,
                            item: testFileItem
                        };
                        selectedRecord["ntestgroupfilecode"] = testFileItem.ntestgroupfilecode
                    }
                    if (editObject.nmethodcode !== -1)  {
                        selectedRecord["nmethodcode"]= {"label": editObject.smethodname, "value": editObject.nmethodcode}
                    }  
                    else{
                        selectedRecord["nmethodcode"] = undefined;
                    }
                    if (editObject.ninstrumentcatcode !== -1)  {
                        selectedRecord["ninstrumentcatcode"] = {"label": editObject.sinstrumentcatname, "value": editObject.ninstrumentcatcode}
                    }  
                    else{
                        selectedRecord["ninstrumentcatcode"] = undefined; 
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openModal: true,
                            operation: operation,
                            screenName: "IDS_EDITTESTGROUPTEST",
                            testGroupInputData: {
                                source: constructOptionList(response[1].data || [], "nsourcecode", "ssourcename", false, false, true).get("OptionList"),
                                section: constructOptionList(response[2].data || [], "nsectioncode", "ssectionname", false, false, true).get("OptionList"),
                                method: constructOptionList(response[3].data || [], "nmethodcode", "smethodname", false, false, true).get("OptionList"),
                                instrumentCategory: constructOptionList(response[4].data || [], "ninstrumentcatcode", "sinstrumentcatname", false, false, true).get("OptionList"),
                                testFile: constructOptionList(response[5].data || [], "ntestfilecode", "sfilename", false, false, true).get("OptionList")
                            },
                            selectedRecord,
                            ncontrolCode
                        }
                    });
                })
                .catch(error => {
                    if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
            }));
        }
    }
}

export const editTestGroupParameter = (operation, selectedParameter, userInfo, ncontrolCode, selectedSpecification) => {
    return dispatch => {
        if (selectedSpecification.napprovalstatus === transactionStatus.DRAFT ||
            selectedSpecification.napprovalstatus === transactionStatus.CORRECTION) {
            dispatch(initRequest(true));
            const urlArray = [
                rsapi.post("/testgroup/getActiveParameterById", {
                    userinfo: userInfo,
                    testgrouptestparameter: selectedParameter
                }),
                rsapi.post("/parametertype/getParameterType", {
                    userinfo: userInfo
                }),
                rsapi.post("unit/getUnit", {
                    userinfo: userInfo
                }),
                rsapi.post("grade/getGrade", {
                    userinfo: userInfo
                }),
                rsapi.post("checklist/getApprovedChecklist", {
                    "userinfo": userInfo
                })
            ]
            Axios.all(urlArray)
                .then(response => {
                    const parameterObject = response[0].data.TestGroupTestParameter[0];
                    const predefinedObject = response[0].data.TestGroupTestPredefinedParameter;
                    const characterObject = response[0].data.TestGroupTestCharParameter;
                    const numericObject = response[0].data.TestGroupTestNumericParameter && response[0].data.TestGroupTestNumericParameter.length > 0 ? response[0].data.TestGroupTestNumericParameter[0] : {};
                    const selectedRecord = {
                        ...parameterObject,
                        nunitcode: {
                            "label": parameterObject.sunitname,
                            "value": parameterObject.nunitcode
                        },
                        nparametertypecode: {
                            "label": parameterObject.sdisplaystatus,
                            "value": parameterObject.nparametertypecode
                        },
                        parameterTypeCode: parameterObject.nparametertypecode,
                        nchecklistversioncode: {
                            "label": parameterObject.schecklistname,
                            "value": parameterObject.nchecklistversioncode
                        },
                        schecklistversionname: parameterObject.schecklistversionname,
                        ntestformulacode: parameterObject.ntestformulacode > 0 ? {
                            "label": parameterObject.sformulacalculationdetail,
                            "value": parameterObject.ntestformulacode,
                            item: {
                                sformulacalculationdetail: parameterObject.sformulacalculationdetail,
                                ntestformulacode: parameterObject.ntestformulacode,
                                sformulacalculationcode: parameterObject.sformulacalculationcode
                            }
                        } : ""
                    };
                    if (characterObject) {
                        selectedRecord["scharname"] = characterObject.scharname;
                        selectedRecord["ntestgrouptestcharcode"] = characterObject.ntestgrouptestcharcode;
                    }
                    if (predefinedObject) {
                        selectedRecord["ntestgrouptestpredefcode"] = predefinedObject.ntestgrouptestpredefcode;
                        selectedRecord["spredefinedname"] = predefinedObject.spredefinedname;
                        selectedRecord["ndefaultstatus"] = predefinedObject.ndefaultstatus;
                        selectedRecord["ngradecode"] = {
                            "label": predefinedObject.sdisplaystatus,
                            "value": predefinedObject.ngradecode
                        };
                    }
                    if (numericObject) {
                        selectedRecord["ntestgrouptestnumericcode"] = numericObject.ntestgrouptestnumericcode;
                        selectedRecord["sminlod"] = numericObject.sminlod;
                        selectedRecord["smaxlod"] = numericObject.smaxlod;
                        selectedRecord["sminb"] = numericObject.sminb;
                        selectedRecord["smina"] = numericObject.smina;
                        selectedRecord["smaxa"] = numericObject.smaxa;
                        selectedRecord["smaxb"] = numericObject.smaxb;
                        selectedRecord["sminloq"] = numericObject.sminloq;
                        selectedRecord["smaxloq"] = numericObject.smaxloq;
                        selectedRecord["sdisregard"] = numericObject.sdisregard;
                        selectedRecord["sresultvalue"] = numericObject.sresultvalue;
                    }
                    const gradeMap = constructOptionList(response[3].data || [], "ngradecode", "sdisplaystatus", false, false, true);
                    const unitMap = constructOptionList(response[2].data || [], "nunitcode", "sunitname", false, false, true);
                    const grade = gradeMap.get("OptionList");
                    const unit = unitMap.get("OptionList");
                    const disabled = parameterObject.nparametertypecode === parameterType.NUMERIC ? false : true;
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openChildModal: true,
                            operation: operation,
                            screenName: "IDS_PARAMETER",
                            testGroupInputData: {
                                unit,
                                grade,
                                testFormula: constructOptionList(response[0].data.TestFormula || [], "ntestformulacode", "sformulacalculationdetail", false, false, true).get("OptionList"),
                                parameterType: constructOptionList(response[1].data || [], "nparametertypecode", "sdisplaystatus", false, false, true).get("OptionList"),
                                checkListVersion: constructOptionList(response[4].data || [], "nchecklistversioncode", "schecklistname", false, false, true).get("OptionList"),
                                needRoundingDigit: disabled,
                                needUnit: disabled
                            },
                            parameterData: {
                                grade
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
                    if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message);
                    }
                });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
            }));
        }
    }
}

// export const addTestGroupFormula = (selectedParameter, userInfo, ncontrolCode, optionalData) => {
//     return dispatch => {
//         const testgroupspecification = optionalData.testgroupspecification;
//         if(testgroupspecification.napprovalstatus === transactionStatus.DRAFT || 
//             testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
//             dispatch(initRequest(true));
//             rsapi.post("/testgroup/getTestGroupFormula", {userinfo: userInfo, testgrouptestparameter: selectedParameter, testgroupspecification})
//             .then(response=>{
//                 dispatch({
//                     type: DEFAULT_RETURN, 
//                     payload:{
//                         openChildModal: true,
//                         operation: "create",
//                         screenName: "IDS_FORMULA",
//                         testGroupInputData: {testFormula: response.data},
//                         selectedRecord: {},
//                         ncontrolCode
//                 }});
//             })
//             .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}});
//                 if(error.response.status === 409 || error.response.status === 417) {
//                     toast.warn(error.response.data);
//                 } else {
//                     toast.error(error.message)
//                 }
//             });
//         } else {
//             toast.warn(intl.formatMessage({id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"}));
//         }
//     }
// }

export const getTestGroupParameter = (inputParam) => {
    return (dispatch) => {
        rsapi.post("/testgroup/getTestGroupTestParameter", {
                ...inputParam
            })
            .then(response => {
                sortData(response.data);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...response.data
                        }
                    }
                });
            })
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const getComponentBySpecId = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        rsapi.post("/testgroup/" + inputParam.operation + inputParam.methodUrl, {
                [inputParam.keyName]: inputParam.selectedRecord.testgroupspecification[0],
                userinfo: inputParam.userInfo
            })
            .then(response => {
                sortData(response.data);
                searchRef.current.value = "";
                const historyDataState = {...inputParam.historyDataState, sort:undefined, filter:undefined}
                    
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData: undefined
                        },
                        historyDataState
                    }
                });
            })
            .catch(error => {
                if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const getTestGroupDetails = (inputParam) => {
    return (dispatch) => { //...inputParam, 
        rsapi.post("/testgroup/getTestGroupTest", {
                ntestgrouptestcode: parseInt(inputParam['ntestgrouptestcode']),
                userinfo: inputParam.userInfo
            })
            // rsapi.post("/testgroup/"+inputParam.operation+inputParam.methodUrl, 
            //     {[inputParam.keyName]: inputParam.selectedRecord.testgroupspecification[0], userinfo: inputParam.userInfo})
            .then(response => {
                sortData(response.data);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...response.data
                        }
                    }
                });
            })
            .catch(error => {
                if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message);
                }
            });
    }
}

export const getTestGroupComponentDetails = (inputParam, masterData, searchRef) => {
    return (dispatch) => { //...inputParam, 
        rsapi.post("/testgroup/getTestByComponentId", {
                testgroupspecsampletype: inputParam['testgroupspecsampletype'],
                userinfo: inputParam.userInfo
            })
            // rsapi.post("/testgroup/"+inputParam.operation+inputParam.methodUrl, 
            //     {[inputParam.keyName]: inputParam.selectedRecord.testgroupspecification[0], userinfo: inputParam.userInfo})
            .then(response => {
                sortData(response.data);
                searchRef.current.value = "";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData: undefined
                        }
                    }
                });
            })
            .catch(error => {
                if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const getSpecification = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        if (inputParam.selectedRecord !== null) {
            rsapi.post("/testgroup/" + inputParam.operation + inputParam.methodUrl, {
                    ...inputParam,
                    [inputParam.keyName]: inputParam.selectedRecord
                })
                .then(response => {
                    sortData(response.data);
                    searchRef.current.value = "";
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData: {
                                ...masterData,
                                ActiveKey: inputParam.activeKey,
                                FocusKey: inputParam.focusKey,
                                primaryKey: inputParam.primaryKey,
                                ...response.data,
                                selectedNode: inputParam.selectedRecord,
                                searchedData: undefined,
                               
                            },
                            historyDataState : {...inputParam.historyDataState, sort:undefined, filter:undefined}
                        }
                    });
                })
                .catch(error => {
                    if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                });
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData,
                        selectedNode: inputParam.selectedRecord,
                        TestGroupSpecification: [],
                        SelectedSpecification: {},
                        TestGroupTest: [],
                        TestGroupTestParameter: [],
                        TestGroupTestNumericParameter: [],
                        TestGroupTestFormula: [],
                        TestGroupTestPredefinedParameter: [],
                        TestGroupTestCharParameter: [],
                        ActiveKey: inputParam.activeKey,
                        FocusKey: inputParam.focusKey,
                        SelectedTest: {},
                        selectedParameter: {},
                        TestGroupSpecFile: [],
                        TestGroupSpecificationHistory: [],
                        SelectedComponent: undefined
                    }
                }
            });
        }
    }
}

export const changeTestCategory = (inputParam, testGroupInputData) => {
    return (dispatch) => {
        rsapi.post("/testgroup/getTestMasterByCategory", {
                ...inputParam
            })
            .then(response => {
                sortData(response.data);
                inputParam.selectedRecord.ntestcode = [];
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord: inputParam.selectedRecord,
                        testGroupInputData: {
                            ...testGroupInputData,
                            ...response.data
                        }
                    }
                });
            })
            .catch(error => {
                if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const getSpecificationDetails = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        rsapi.post("/testgroup/get" + inputParam.methodUrl, {
                ...inputParam.inputData
            })
            .then(response => {
                searchRef.current.value = "";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData: undefined
                        },
                        screenName: inputParam.screenName
                    }
                });
            })
            .catch(error => {
                if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const editSpecFile = (inputParam) => {
    return (dispatch) => {
        if (inputParam.testgroupspecification.napprovalstatus === transactionStatus.DRAFT ||
            inputParam.testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
            let urlArray = [rsapi.post("/linkmaster/getLinkMaster", {
                    userinfo: inputParam.userInfo
                }),
                rsapi.post("/testgroup/getActiveSpecFileById", {
                    userinfo: inputParam.userInfo,
                    testgroupspecfile: inputParam.selectedRecord
                })
            ]
            Axios.all(urlArray)
                .then(response => {
                    const linkmaster = response[0].data.LinkMaster;
                    const defaultLink = linkmaster.filter(item => item.ndefaultlink === transactionStatus.YES);
                    const editObject = response[1].data;
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
                        nlinkcode = defaultLink.length > 0 ? {
                            "label": defaultLink[0].slinkname,
                            "value": defaultLink[0].nlinkcode
                        } : ""

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
                    const selectedRecord = {
                       // ...editObject,
                       ...link,
                       nallotedspeccode:editObject.nallotedspeccode,
                       nspecfilecode:editObject.nspecfilecode,
                       stypename:editObject.stypename,
                       nattachmenttypecode:editObject.nattachmenttypecode,
                        nlinkcode,
                       // disabled: true
                    };
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openModal: true,
                            operation: "update",
                            screenName: "IDS_SPECFILE",
                            editFiles: Object.values(editObject).length > 0 && editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {},
                            selectedRecord,
                            ncontrolCode: inputParam.ncontrolCode
                        }
                    });
                })
                .catch(error => {
                    if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
            }));
        }
    }
}

export const addTestGroupCodedResult = (operation, paramdata, userInfo, ncontrolCode, optionalData) => {
    return (dispatch) => {
        const testgroupspecification = optionalData.testgroupspecification;
        if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT ||
            testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
            dispatch(initRequest(true));
            const urlArray = [
                rsapi.post("grade/getGrade", {
                    "userinfo": userInfo
                })
            ];
            if (operation === "update") {
                urlArray.push(rsapi.post("testgroup/getActivePredefinedParameterById", {
                    testgrouptestpredefinedparameter: paramdata,
                    "userinfo": userInfo,
                    testgroupspecification
                }));
            }
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    const gradeMap = constructOptionList(response[0].data || [], "ngradecode", "sdisplaystatus", false, false, true);
                    const grade = gradeMap.get("OptionList");
                    if (operation === "update") {
                        const editCodedResult = response[1].data;
                        selectedRecord = {
                            ntestgrouptestpredefcode: paramdata["ntestgrouptestpredefcode"],
                            ntestgrouptestparametercode: paramdata["ntestgrouptestparametercode"],
                            ngradecode: {
                                "label": editCodedResult["sdisplaystatus"],
                                "value": editCodedResult["ngradecode"]
                            },
                            spredefinedname: editCodedResult["spredefinedname"]
                        }
                    } else {
                        selectedRecord = {
                            ngradecode: gradeMap.get("DefaultValue")
                            // {
                            //     "value": grade[0].ngradecode,
                            //     "label": grade[0]["sdisplaystatus"]
                            // }
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
                                grade,
                                needCodedResult: false
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
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
            }));
        }
    }
}

export const viewTestGroupCheckList = (inputParam, userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("checklist/viewTemplate", {
                ...inputParam
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openTemplateModal: true,
                        testGroupCheckList: {
                            templateData: response.data
                        },
                        loading: false,
                        selectedRecord: {}
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}


export const reportSpecification = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("testgroup/specReportGenerate", {
                ...inputParam
            })
            .then(response => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false, openModal: false ,showConfirmAlert:false} })
                document.getElementById("download_data").setAttribute("href", response.data.filepath);
                document.getElementById("download_data").click();
            }).catch(error => {
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


export const retireSpecification = (inputParam,masterData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("testgroup/retireSpec", {
            ...inputParam
        })
        .then(response => {
           
            // const TestGroupSpecification = response.data.TestGroupSpecificationHistory ;
            sortData(response.data);
             masterData = {
                ...masterData,
                ...response.data,
                
            };
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData,
                    loading: false
                    } 
            })
        }).catch(error => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            })
            if (error.response.status === 500) {
                toast.error(error.message);
            } else {
                toast.warn(error.response.data);
            }
        });
    }
}