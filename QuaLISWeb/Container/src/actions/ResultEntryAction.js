import rsapi from '../rsapi';
import {
    DEFAULT_RETURN
} from './LoginTypes';
import {
    toast
} from 'react-toastify';
import {
    initRequest
} from './LoginAction';
import {
    intl
} from '../components/App';
import Axios from 'axios';
// import {
//     numericGrade
// } from '../pages/ResultEntryBySample/ResultEntryValidation';
import {
    constructOptionList,
    fillRecordBasedOnCheckBoxSelection,
    filterRecordBasedOnTwoArrays,
    getRecordBasedOnPrimaryKeyName,
    getSameRecordFromTwoArrays,
    replaceUpdatedObject,
    sortData,
    updatedObjectWithNewElement, rearrangeDateFormat
} from '../components/CommonScript';
import {
    transactionStatus
} from '../components/Enumeration';

export function getsubSampleREDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 2,
            nflag: 2,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntranscode: String(inputData.ntransactionstatus),
            ntransactiontestcode: 0,
            userinfo: inputData.userinfo,
            ntestcode: inputData.ntestcode,
            napprovalversioncode: inputData.napprovalversioncode,
            fromdate: inputData.fromdate,
            todate: inputData.todate,
            activeTestKey: inputData.activeTestKey,
            activeSampleKey: inputData.activeSampleKey
        }
        let activeName = "";
        let dataStateName = "";
        // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
        //     documentDataState, testCommentDataState } = inputData
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi.post("resultentrybysample/getResultEntryDetails", inputParamData)
                .then(response => {
                    // if (response.data.DynamicGetSamples) {
                    //     sortData(response.data.DynamicGetSamples, "", "");
                    // }
                    // if (response.data.DynamicGetTests) {
                    //     sortData(response.data.DynamicGetTests, "descending", "npreregno");
                    // }
                    //sortData(response.data);
                    let oldSelectedTest = inputData.masterData.RESelectedTest
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        // ...response.data,
                        RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                        RESelectedSample: inputData.RESelectedSample,
                        RESelectedSubSample: inputData.masterData.RE_SUBSAMPLE
                    }
                    // if (inputData.searchSampleRef !== undefined && inputData.searchSampleRef.current !== null) {
                    //     inputData.searchSampleRef.current.value = "";
                    //     masterData['searchedSample'] = undefined
                    // }
                    if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                        inputData.searchSubSampleRef.current.value = "";
                        masterData['searchedSubSample'] = undefined
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTests'] = undefined
                    }
                    let {
                        testskip,
                        testtake
                    } = inputData
                    let bool = false;
                    let skipInfo = {}
                    if (inputData.masterData.RE_TEST.length <= inputData.testskip) {
                        testskip = 0;
                        bool = true
                    }
                    if (bool) {
                        skipInfo = {
                            testskip,
                            testtake
                        }
                    }
                    let TestParameters = [];
                    let ResultUsedInstrument = [];
                    let ResultUsedTasks = [];
                    let RegistrationTestAttachment = [];
                    let ResultChangeHistory = [];
                    let RegistrationTestComment = [];

                    if (inputData.checkBoxOperation === 1) {
                        //added by sudharshanan for test select issue while sample click
                        let wholeTestList = masterData.RE_TEST.map(b => b.ntransactiontestcode)
                        oldSelectedTest.map((test, index) => {
                            if (!wholeTestList.includes(test.ntransactiontestcode)) {
                                oldSelectedTest.splice(index, 1)
                            }
                            return null;
                        })
                        let keepOld = false;
                        let ntransactiontestcode;
                        if (oldSelectedTest.length > 0) {
                            keepOld = true
                            masterData = {
                                ...masterData,
                                RESelectedTest: oldSelectedTest
                            }
                        } else {
                            ntransactiontestcode = masterData.RESelectedTest[0].ntransactiontestcode
                        }
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_TASK":
                                ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                ResultChangeHistory = keepOld ? inputData.masterData.ResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            default:
                                TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                        }

                    } else if (inputData.checkBoxOperation === 5) {
                        let list = []
                        let dbData = [];
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.TestParameters, ...response.data.TestParameters];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_INSTRUMENT":
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.ResultUsedInstrument, ...response.data.ResultUsedInstrument];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TASK":
                                dbData = response.data.ResultUsedTasks || []
                                list = [...inputData.masterData.ResultUsedTasks, ...dbData];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                dbData = response.data.ResultChangeHistory || []
                                list = [...inputData.masterData.ResultChangeHistory, ...dbData];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            default:
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.TestParameters, ...dbData];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                    } else {
                        let list = []
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                list = response.data.TestParameters ? sortData(response.data.TestParameters,'ascending','ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                list = response.data.ResultUsedInstrument ? sortData(response.data.ResultUsedInstrument,'descending','nresultusedinstrumentcode') :  [];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_TASK":
                                list = response.data.ResultUsedTasks ? sortData(response.data.ResultUsedTasks,'descending','nresultusedtaskcode') :  [];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment,'descending','ntestattachmentcode') :  [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                list = response.data.ResultChangeHistory ? sortData(response.data.ResultChangeHistory,'descending','nresultchangehistorycode') : [];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment ? sortData(response.data.RegistrationTestComment,'descending','ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            default:
                                list = response.data.TestParameters ? sortData(response.data.TestParameters,'ascending','ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                        }
                    }

                    masterData = {
                        ...masterData,
                        // wholeApprovalParameter,
                        TestParameters,
                        // wholeResultUsedInstrument,
                        ResultUsedInstrument,
                        // wholeResultUsedTasks,
                        ResultUsedTasks,
                        // wholeRegistrationTestAttachment,
                        RegistrationTestAttachment,
                        // wholeResultChangeHistory,
                        ResultChangeHistory,
                        // wholeRegistrationTestComments,
                        RegistrationTestComment
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }else{
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false,
                            skip: undefined,
                            take: undefined,
                            ...skipInfo
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
        } else {
            let oldSelectedTest = inputData.masterData.RESelectedTest
            let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = true;
            } else {
                isGrandChildGetRequired = false;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.RESelectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode.toString() : "";
                let RESelectedSample = inputData.RESelectedSample;
                let RESelectedTest = inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [];
                let RESelectedSubSample = inputData.masterData.RE_SUBSAMPLE

                inputData = {
                    ...inputData,
                    childTabsKey: ["TestParameters", "ResultUsedInstrument", "ResultUsedTasks", "RegistrationTestAttachment",
                        "ResultChangeHistory", "RegistrationTestComment", "ResultChangeHistory"
                    ],
                    ntransactiontestcode,
                    RESelectedSample,
                    RESelectedTest,
                    RESelectedSubSample,
                    checkBoxOperation: 3,
                    activeTestKey: inputData.activeTestKey
                }
                dispatch(getTestChildTabREDetail(inputData, true));
            } else {
                //added by sudharshanan for test select issue while sample click
                let masterData = {
                    ...inputData.masterData,
                    RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                    RESelectedSample: inputData.RESelectedSample,
                    RESelectedSubSample: inputData.masterData.RE_SUBSAMPLE
                }
                let wholeTestList = masterData.RE_TEST.map(b => b.ntransactiontestcode)
                oldSelectedTest.map((test, index) => {
                    if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        oldSelectedTest.splice(index, 1)
                    }
                    return null;
                })
                let keepOld = false;
                let ntransactiontestcode;
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        RESelectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = masterData.RE_TEST[0].ntransactiontestcode
                }
                const TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters,
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultChangeHistory = keepOld ? inputData.masterData.ResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultChangeHistory || [],
                    ntransactiontestcode, "ntransactiontestcode");
                let { testskip, testtake } = inputData
                let bool = false;
                let skipInfo = {}
                if (inputData.masterData.RE_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = {
                        testskip,
                        testtake
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            RESelectedSample: inputData.RESelectedSample,
                            // selectedPreregno: inputData.npreregno,
                            // RESelectedTest: inputData.masterData.searchedTest && inputData.masterData.searchedTest.length > 0 ? [inputData.masterData.
                            //     searchedTest[0]
                            // ] : inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.
                            //     RE_TEST[0]
                            // ] : [],
                            // RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                            TestParameters,
                            ResultUsedInstrument,
                            ResultUsedTasks,
                            RegistrationTestAttachment,
                            RegistrationTestComment,
                            ResultChangeHistory,
                            RESelectedSubSample: inputData.masterData.RE_SUBSAMPLE
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestKey: inputData.activeTestKey,
                        ...skipInfo,
                    }
                })
            }
        }
    }
}

export function getTestREDetail(inputData) {
    return function (dispatch) {
        let inputParamData = {
            nflag: 3,
            ntype: 3,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactiontestcode: 0,
            ntranscode: inputData.ntransactionstatus.toString(),
            ntransactionsamplecode: inputData.ntransactionsamplecode,
            userinfo: inputData.userinfo,
            ntestcode: inputData.ntestcode,
            activeTestKey: inputData.activeTestKey
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getResultEntryDetails", inputParamData)
            .then(response => {
                // if (response.data.DynamicGetTests) {
                //     sortData(response.data.DynamicGetTests, "descending", "npreregno");
                // }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            RESelectedSubSample: inputData.RESelectedSubSample
                        },
                        loading: false
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
            })
    }
}




export function getSampleChildTabREDetail(inputData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.ntransactiontestcode,
            npreregno: inputData.npreregno,
            userinfo: inputData.userinfo
        }
        let url = ""
        switch (inputData.activeSampleKey) {
            case "IDS_DOCUMENTS":
                url = "attachment/getSampleAttachment"
                break;
            case "IDS_SAMPLEATTACHMENTS":
                url = "attachment/getSampleAttachment"
                break;
            case "IDS_APPROVALHISTORY":
                url = "resultentrybysample/getSampleApprovalHistory"
                break;
            default:
                url = "attachment/getSampleAttachment"
                break;
        }
        dispatch(initRequest(true));
        rsapi.post(url, inputParamData)
            .then(response => {
                let responseData = {
                    ...response.data
                }
                //responseData = sortData(responseData)
                fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            RESelectedSample: inputData.RESelectedSample
                        },
                        loading: false,
                        activeSampleKey: inputData.activeSampleKey,
                        screenName: inputData.screenName
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

export function getTestChildTabREDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(","),
            npreregno: inputData.npreregno,
            userinfo: inputData.userinfo
        }
        let activeName = "";
        let dataStateName = "";
        // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
        //     documentDataState, testCommentDataState } = inputData
        let url = "resultentrybysample/getTestbasedParameter"
        switch (inputData.activeTestKey) {
            case "IDS_RESULTS":
                url = "resultentrybysample/getTestbasedParameter"
                activeName = "TestParameters"
                dataStateName = "resultDataState"
                break;
            case "IDS_INSTRUMENT":
                url = "resultentrybysample/getResultUsedInstrument"
                activeName = "ResultUsedInstrument"
                dataStateName = "instrumentDataState"
                break;
            case "IDS_MATERIAL":
                url = "resultentrybysample/getResultUsedMaterial";
                activeName = ""
                dataStateName = "materialDataState"
                break;
            case "IDS_TASK":
                url = "resultentrybysample/getResultUsedTask"
                activeName = "ResultUsedTasks"
                dataStateName = "taskDataState"
                break;
            case "IDS_TESTATTACHMENTS":
                url = "attachment/getTestAttachment"
                activeName = "RegistrationTestAttachment"
                break;
            case "IDS_TESTCOMMENTS":
                url = "comments/getTestComment"
                activeName = "RegistrationTestComment"
                dataStateName = "testCommentDataState"
                break;
            case "IDS_DOCUMENTS":
                url = "attachment/getSampleAttachment"
                activeName = ""
                dataStateName = "documentDataState"
                break;
            case "IDS_RESULTCHANGEHISTORY":
                url = "resultentrybysample/getResultChangeHistory"
                activeName = "ResultChangeHistory"
                dataStateName = "resultChangeDataState"
                break;
            case "IDS_SAMPLEATTACHMENTS":
                url = "attachment/getSampleAttachment"
                activeName = ""
                dataStateName = "resultDataState"
                break;
            default:
                url = "resultentrybysample/getTestbasedParameter"
                activeName = "TestParameters"
                dataStateName = "resultDataState"
                break;
        }
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi.post(url, inputParamData)
                .then(response => {
                    let responseData = {
                        ...response.data,
                        RESelectedSample: inputData.RESelectedSample || inputData.masterData.RESelectedSample,
                        RESelectedTest: inputData.RESelectedTest
                    }
                    let skipInfo = {};
                    //responseData = sortData(responseData)
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        ...sortData(responseData),
                        RESelectedTest: inputData.RESelectedTest
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {

                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }else{
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false,
                            activeTestKey: inputData.activeTestKey,
                            screenName: inputData.activeTestKey,
                            testskip: undefined,
                            testtake: undefined,
                            ...skipInfo
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
                })
        } else {
            //fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.RESelectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode", inputData.removeElementFromArray);
            let skipInfo = {};
            let masterData = {
                ...inputData.masterData,
                RESelectedTest: inputData.RESelectedTest
            }
            if (masterData[activeName].length <= inputData[dataStateName].skip) {

                skipInfo = {

                    [dataStateName]: {
                        ...inputData[dataStateName],
                        skip: 0,
                        sort:undefined,
                        filter:undefined
                    }
                }
            }else{
                skipInfo = {
                    ...skipInfo,
                    [dataStateName]: {
                        ...inputData[dataStateName],
                        sort:undefined,
                        filter:undefined
                    }
                }
            }
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData,
                    loading: false,
                    showFilter: false,
                    activeTestKey: inputData.activeTestKey,
                    screenName: inputData.screenName,
                    ...skipInfo
                }
            })
        }
    }
}

export function getRERegistrationType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getRegistrationType", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                        },
                        loading: false
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
            })
    }
}

export function getRERegistrationSubType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getRegistrationsubType", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultRegistrationType: inputData.defaultRegistrationType
                        },
                        loading: false
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
            })
    }
}

export function getREApprovalConfigVersion(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getApprovalConfigVersion", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultRegistrationSubType: inputData.defaultRegistrationSubType,
                           // fromDate: inputData.fromdate,
                          //  toDate: inputData.todate
                        },
                        loading: false
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
            })
    }
}

export function getREFilterStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getFilterStatus", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultjobstatus: inputData.defaultjobstatus,
                            // fromDate: inputData.fromdate,
                            // toDate: inputData.todate
                        },
                        loading: false
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
            })
    }
}


export function getREJobStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getJobStatus", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultApprovalConfigVersion: inputData.defaultApprovalConfigVersion,
                            // fromDate: inputData.fromdate,
                            // toDate: inputData.todate
                        },
                        loading: false
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
            })
    }
}

export function getResultEntryDetails(inputParamData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getResultEntryDetails", inputParamData.inputData)
            .then(response => {
                let masterData = { ...inputParamData.masterData }
                if (inputParamData.refs.searchSampleRef !== undefined && inputParamData.refs.searchSampleRef.current !== null) {
                    inputParamData.refs.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputParamData.refs.searchSubSampleRef !== undefined && inputParamData.refs.searchSubSampleRef.current !== null) {
                    inputParamData.refs.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputParamData.refs.searchTestRef !== undefined && inputParamData.refs.searchTestRef.current !== null) {
                    inputParamData.refs.searchTestRef.current.value = ""
                    // masterData['searchedTests'] = undefined
                    masterData['searchedTest'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            realFromDate:response.data["fromDate"],
                            realToDate:response.data["toDate"]
                        },
                        loading: false,
                        showTest: inputParamData.inputData.showTest,
                        showSample: inputParamData.inputData.showSample,
                        activeTestKey: inputParamData.inputData.activeTestKey,
                        skip: 0,
                        take: inputParamData.inputData.take,
                        testskip: 0,
                        testtake: inputParamData.inputData.testtake,
                        resultDataState: {...inputParamData.resultDataState,sort:undefined,filter:undefined},
                        instrumentDataState: {...inputParamData.instrumentDataState,sort:undefined,filter:undefined},
                        materialDataState: {...inputParamData.materialDataState,sort:undefined,filter:undefined},
                        taskDataState: {...inputParamData.taskDataState,sort:undefined,filter:undefined},
                        documentDataState: {...inputParamData.documentDataState,sort:undefined,filter:undefined},
                        resultChangeDataState: {...inputParamData.resultChangeDataState,sort:undefined,filter:undefined},
                        testCommentDataState:{...inputParamData.testCommentDataState,sort:undefined,filter:undefined},
                        historyDataState: {...inputParamData.historyDataState,sort:undefined,filter:undefined},
                        samplePrintHistoryDataState: {...inputParamData.samplePrintHistoryDataState,sort:undefined,filter:undefined},
                        sampleHistoryDataState: {...inputParamData.sampleHistoryDataState,sort:undefined,filter:undefined}
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
            })
    }
}

export function resultGetModule(inputData, userInfo, ncontrolcode, testskip, testtake) {
    return function (dispatch) {
    let TestList = [...inputData.RE_TEST];
    TestList = TestList.splice(testskip, testskip + testtake);
    let acceptTestList = getSameRecordFromTwoArrays(TestList, inputData.RESelectedTest, "ntransactiontestcode");
    if (acceptTestList && acceptTestList.length > 0) {
        if (Object.values(inputData).length > 0 && inputData.RESelectedTest.length > 0) {
                let inputParamData = {
                    ntransactiontestcode: acceptTestList ? acceptTestList.map(test => test.ntransactiontestcode).join(",") : "",
                    userinfo: userInfo
                }
                dispatch(initRequest(true));
                rsapi.post("resultentrybysample/getResultEntryResults", inputParamData)
                    .then(response => {
                        let selectedResultGrade = [];
                        let paremterResultcode = [];
                        const parameterResults = response.data.ResultParameter
                        parameterResults.map((param, index) => {
                            selectedResultGrade[index] = { ngradecode: param.ngradecode };
                            paremterResultcode[index] = param.ntransactionresultcode;

                            (response.data.PredefinedValues && response.data.PredefinedValues[parameterResults[index].ntransactionresultcode]) &&
                                response.data.PredefinedValues[parameterResults[index].ntransactionresultcode].map(predefinedvalue => {
                                    if (predefinedvalue.ndefaultstatus === transactionStatus.YES) {
                                        response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] =
                                            constructOptionList(response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] || [], 'spredefinedname', 'spredefinedname', undefined,
                                                undefined, undefined).get("OptionList");
                                        if (response.data.ResultParameter[index].sresult === null) {
                                            response.data.ResultParameter[index].sresult = predefinedvalue.spredefinedname;
                                            response.data.ResultParameter[index].sfinal = predefinedvalue.spredefinedname;
                                            response.data.ResultParameter[index].editable = true;
                                            response.data.ResultParameter[index].ngradecode = predefinedvalue.ngradecode;
                                        }
                                    }
                                    return null;
                                });
                            return null;
                        });
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...inputData,
                                    ...response.data,
                                    paremterResultcode//,
                                    //selectedResultGrade ,

                                },
                                selectedRecord: {
                                    selectedResultGrade:  selectedResultGrade,
                                    ResultParameter:response.data.ResultParameter
                                },
                                loading: false,
                                screenName: "IDS_RESULTENTRY",
                                openModal: true,
                                operation: "update",
                                activeTestKey: "IDS_RESULTS",
                                ncontrolcode: ncontrolcode
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
                    })
            //}
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            })
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTTESTTOENTERRESULT"
            }));
        }
    } else {
        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                loading: false
            }
        })
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTTESTTOENTERRESULT"
        }));
     }
  }

}

export function completeTest(inputParam, acceptList, userInfo, completeResultId) {
    if (acceptList !== undefined && acceptList.length > 0) {
        return function (dispatch) {
            let inputData = inputParam.testChildGetREParam
            let inputParamData = {
                ntype: 3,
                nflag: 3,
                nsampletypecode: inputData.nsampletypecode,
                nregtypecode: inputData.nregtypecode,
                nregsubtypecode: inputData.nregsubtypecode,
                npreregno: inputData.npreregno,
                ntranscode: String(inputData.ntransactionstatus),
                napprovalversioncode: inputData.napprovalversioncode,
                napprovalconfigcode: inputData.napprovalconfigcode,
                ntransactionsamplecode: inputData.ntransactionsamplecode,
                userinfo: userInfo,
                fromdate: inputData.fromdate,
                todate: inputData.todate,
                ntestcode: inputData.ntestcode,
                transactiontestcode: acceptList ? acceptList.map(test => test.ntransactiontestcode).join(",") : "",
                ntransactiontestcode: 0,
                activeTestKey: inputData.activeTestKey,
                ncontrolcode: inputParam.inputData.ncontrolcode
            }
            let activeName = "";
            let dataStateName = "";
            // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
            //     documentDataState, testCommentDataState } = inputData
            // let url = "resultentrybysample/getTestbasedParameter"
            switch (inputData.activeTestKey) {
                case "IDS_RESULTS":
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_INSTRUMENT":
                    activeName = "ResultUsedInstrument"
                    dataStateName = "instrumentDataState"
                    break;
                case "IDS_MATERIAL":
                    activeName = ""
                    dataStateName = "materialDataState"
                    break;
                case "IDS_TASK":
                    activeName = "ResultUsedTasks"
                    dataStateName = "taskDataState"
                    break;
                case "IDS_TESTATTACHMENTS":
                    activeName = "RegistrationTestAttachment"
                    break;
                case "IDS_TESTCOMMENTS":
                    activeName = "RegistrationTestComment"
                    dataStateName = "testCommentDataState"
                    break;
                case "IDS_DOCUMENTS":
                    activeName = ""
                    dataStateName = "documentDataState"
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    activeName = "ResultChangeHistory"
                    dataStateName = "resultChangeDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    activeName = ""
                    dataStateName = "resultDataState"
                    break;
                default:
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
            }
            dispatch(initRequest(true));
            rsapi.post("resultentrybysample/completeTest", inputParamData)
                .then(response => {
                    let RE_SAMPLE = [];
                    let RE_TEST = [];
                    let responseData = response.data
                    if (responseData["RE_TEST"].length > 0) {
                        RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "npreregno");
                    } else {
                        RE_TEST = inputData.masterData["RE_TEST"];
                    }
                    RE_SAMPLE = filterRecordBasedOnTwoArrays(inputData.masterData["RE_SAMPLE"], RE_TEST, "npreregno");
                    const RESelectedSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSample"], RE_TEST, "npreregno");

                    let RESelectedTest1 = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedTest"], acceptList, "ntransactiontestcode");
                    let RESelectedTest2 = updatedObjectWithNewElement(RESelectedTest1, responseData.RESelectedTest)

                    let searchedSample = undefined;
                    if (inputData.masterData["searchedSample"]) {
                        searchedSample = filterRecordBasedOnTwoArrays(inputData.masterData["searchedSample"], RE_TEST, "npreregno");
                    }

                    let masterData = {
                        ...inputData.masterData,
                        ...responseData,
                        RE_SAMPLE,
                        RESelectedSubSample: inputData.masterData.RESelectedSubSample,
                        searchedSample,
                        RESelectedSample,
                        RESelectedTest: RESelectedTest2,
                        RE_TEST: responseData["RE_TEST"]
                    }
                    let skipInfo = {};
                    if(masterData.RE_SAMPLE && masterData.RE_SAMPLE.length<=inputParam.skip){
                        skipInfo ={
                            ...skipInfo,
                            skip:0,
                            take:inputParam.take
                        }
                    }
                    if(masterData.RE_TEST && masterData.RE_TEST.length<=inputParam.testskip){
                        skipInfo ={
                            ...skipInfo,
                            testskip:0,
                            testtake:inputParam.testtake
                        }
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }else{
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }
                    let respObject = {
                        ...inputParamData.inputData,
                        openModal: false,
                        loadEsign: false,
                        showConfirmAlert: false,
                        selectedRecord: undefined,
                        loading: false,
                        screenName: inputData.activeTestKey,
                        ...skipInfo
                    }
                    if (searchedSample && RESelectedSample.length === 0 && searchedSample.length > 0) {
                        const paramList = inputParam.postParamList[0];
                        const inputParameter = {
                            ...paramList.fecthInputObject.fecthInputObject,
                            fetchUrl: paramList.fetchUrl,
                            [paramList.primaryKeyField]: String(searchedSample[0][paramList.primaryKeyField]),
                            ntype: 2,
                            nflag: 2
                        };
                        respObject = {
                            ...respObject,
                            masterData: {
                                ...masterData,
                                RESelectedSample: [searchedSample[0]]
                            }
                        }
                        dispatch(fetchSelectedData(inputParameter, respObject));
                    } else if (!searchedSample && RESelectedSample.length === 0 && RE_SAMPLE.length > 0) {
                        const paramList = inputParam.postParamList[0];
                        const inputParameter = {
                            ...paramList.fecthInputObject.fecthInputObject,
                            fetchUrl: paramList.fetchUrl,
                            [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
                            ntype: 2,
                            nflag: 2
                        };
                        respObject = {
                            ...respObject,
                            masterData: {
                                ...masterData,
                                RESelectedSample: [RE_SAMPLE[0]]
                            }
                        }
                        dispatch(fetchSelectedData(inputParameter, respObject));
                    } else {
                        respObject = {
                            ...respObject,
                            masterData
                        };
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                ...respObject,
                                loading: false
                            }
                        });
                    }
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
                })
        }
    } else {
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTTESTTOCOMPLETE"
        }));
    }

}

//Compare two array and return the first array which is available in second array
export function compareTwoArray(firstArray, secondArray, PrimaryKey) {
    const filterArray = firstArray.filter(function (x) {
        return secondArray.some(function (y) {
            return x[PrimaryKey] === y[PrimaryKey]
        })
    });
    return filterArray;
}

function fetchSelectedData(inputParam, respObject) {
    return (dispatch) => {
        rsapi.post(inputParam.fetchUrl, {
            ...inputParam
        })
            .then(response => {
                const masterData = {
                    ...respObject.masterData,
                    ...response.data,
                    RESelectedSample:response.data.RESelectedSample||respObject.masterData.RESelectedSample||[]
                };
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...respObject,
                        masterData,
                        loading: false
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


export function testMethodSourceEdit(inputData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.test.ntransactiontestcode,
            ntestgrouptestcode: inputData.test.ntestgrouptestcode,
            ntestcode: inputData.test.ntestcode,
            ncontrolcode: inputData.editSourceMethodId,
            userinfo: inputData.userInfo
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getTestMethodSource", inputParamData)
            .then(response => {

                const TagSource = constructOptionList(response.data.SourceData || [], "nsourcecode",
                    "ssourcename", undefined, undefined, undefined);
                const TagListSource = TagSource.get("OptionList");

                const TagMethod = constructOptionList(response.data.MethodData || [], "nmethodcode",
                    "smethodname", undefined, undefined, undefined);
                const TagListMethod = TagMethod.get("OptionList");


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            SourceData: TagListSource,
                            MethodData: TagListMethod,
                            RESelectedSubSample: inputData.masterData.RESelectedSubSample
                        },
                        selectedRecord: {
                            ntransactiontestcode: inputData.test.ntransactiontestcode,
                            stestsynonym: inputData.test.stestsynonym,
                            nsourcecode: response.data.SourceDataValue,
                            nmethodcode: response.data.MethodDataValue
                        },
                        loading: false,
                        screenName: "IDS_TESTMETHODSOURCE",
                        openModal: true,
                        operation: "update",
                        ncontrolcode: inputData.editSourceMethodId
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
            })
    }
}

export function updateParameterComments(inputData, masterData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.ntransactiontestcode,
            ntransactionresultcode: inputData.ntransactionresultcode,
            sresultcomment: inputData.sresultcomment,
            transactiontestcode: inputData.transactiontestcode,
            userinfo: inputData.userinfo,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            ncontrolcode: inputData.ncontrolcode
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/updateParameterComments", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data
                        },
                        loading: false,
                        loadEsign: false,
                        screenName: "IDS_RESULT",
                        openModal: false,
                        operation: "update",
                        ncontrolcode: inputData.ncontrolcode
                        //ncontrolcode:inputData.editSourceMethodId
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
            })
    }
}


export function addREInstrument(inputData) {
    return function (dispatch) {

        let urlArray = [];
        const resultusedinstrument = rsapi.post("resultentrybysample/getResultUsedInstrumentCombo", {
            userinfo: inputData.userInfo
        });
        const timeZoneService = rsapi.post("timezone/getTimeZone");
        const UTCtimeZoneService = rsapi.post("timezone/getLocalTimeByZone", { userinfo: inputData.userInfo });
        urlArray = [resultusedinstrument, timeZoneService, UTCtimeZoneService];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const TagInstrument = constructOptionList(response[0].data.Instrument || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, undefined);
                const TagListInstrument = TagInstrument.get("OptionList");


                const TagInsturmentcategory = constructOptionList(response[0].data.InstrumentCategory || [], "ninstrumentcatcode",
                    "sinstrumentcatname", undefined, undefined, undefined);
                const TagListInstrumentCategory = TagInsturmentcategory.get("OptionList");

                const TagTimeZone = constructOptionList(response[1].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, undefined);
                const TagListTimeZone = TagTimeZone.get("OptionList")

                dispatch({


                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            Instrument: TagListInstrument,
                            InstrumentCategory: TagListInstrumentCategory

                        },
                        selectedId: null,
                        selectedRecord: {
                            stestsynonym: inputData.test.stestsynonym,
                            transactiontestcode: inputData.RESelectedTest ? inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                            ntransactiontestcode: inputData.test.ntransactiontestcode,
                            ninstrumentcatcode: TagInsturmentcategory.get("DefaultValue") ? TagInsturmentcategory.get("DefaultValue") : [],
                            ninstrumentcode: TagInstrument.get("DefaultValue") ? TagInstrument.get("DefaultValue") : [],
                            npreregno: inputData.test.npreregno,
                            //dtodate: new Date(response[2].data),//new Date(),
                            dtodate: rearrangeDateFormat( inputData.userInfo,response[2].data),//new Date(),
                            //dfromdate: new Date(response[2].data),//new Date(),
                            dfromdate: rearrangeDateFormat( inputData.userInfo,response[2].data),//new Date(),
                            ntzfromdate: {
                                "value": inputData.userInfo.ntimezonecode,
                                "label": inputData.userInfo.stimezoneid
                            },
                            ntztodate: {
                                "value": inputData.userInfo.ntimezonecode,
                                "label": inputData.userInfo.stimezoneid
                            }
                        },
                        timeZoneList: TagListTimeZone || [],
                        loading: false,
                        screenName: "IDS_INSTRUMENT",
                        openModal: true,
                        operation: "create",
                        //activeTestKey: "IDS_INSTRUMENT",
                        ncontrolcode: inputData.addResultUsedInstrumentId
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
            })
    }
}

export function deleteInstrumentRecord(inputData) {
    return function (dispatch) {
        let inputParamData = {
            nresultusedinstrumentcode: inputData.selectedRecord.nresultusedinstrumentcode,
            userinfo: inputData.userInfo,
            ntransactiontestcode: inputData.masterData.RESelectedTest ?
                inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
            nregtypecode: inputData.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: inputData.masterData.defaultRegistrationSubType.nregsubtypecode
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/deleteResultUsedInstrument", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        loading: false,
                        operation: "delete",
                        openModal: false,
                        loadEsign: false
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
            })
    }
}



export function fetchInstrumentRecord(inputData) {
    return function (dispatch) {

        let urlArray = [];
        //const resultUsedInstrumentCombo = rsapi.post("resultentrybysample/getResultUsedInstrumentCombo", { userinfo: inputData.userInfo });
        const timeZoneService = rsapi.post("resultentrybysample/getResultUsedInstrument", {
            nresultusedinstrumentcode: inputData.editRow.nresultusedinstrumentcode,
            userinfo: inputData.userInfo
        });
        const getResultUsedInstrument = rsapi.post("timezone/getTimeZone");
        urlArray = [timeZoneService, getResultUsedInstrument];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                const TagInstrument = constructOptionList(response[0].data.Instrument || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, undefined);
                const TagListInstrument = TagInstrument.get("OptionList");


                const TagInsturmentcategory = constructOptionList(response[0].data.InstrumentCategory || [], "ninstrumentcatcode",
                    "sinstrumentcatname", undefined, undefined, undefined);
                const TagListInstrumentCategory = TagInsturmentcategory.get("OptionList");

                const TagTimeZone = constructOptionList(response[1].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, undefined);
                const TagListTimeZone = TagTimeZone.get("OptionList")

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            Instrument: TagListInstrument,
                            InstrumentCategory: TagListInstrumentCategory,
                            // ...response[0].data,
                            ...response[1].data,
                            //...response[2].data
                        },
                        selectedId: inputData.editRow.nresultusedinstrumentcode,
                        selectedRecord: {
                            stestsynonym: inputData.editRow.stestsynonym,
                            npreregno: response[0].data.EditResultUsedInstrument[0].npreregno,
                            ntransactiontestcode: inputData.editRow.ntransactiontestcode,
                            nresultusedinstrumentcode: inputData.editRow.nresultusedinstrumentcode,
                            ninstrumentcatcode: {
                                "value": response[0].data.EditResultUsedInstrument[0].ninstrumentcatcode,
                                "label": response[0].data.EditResultUsedInstrument[0].sinstrumentcatname
                            },
                            ninstrumentcode: {
                                "value": response[0].data.EditResultUsedInstrument[0].ninstrumentcode,
                                "label": response[0].data.EditResultUsedInstrument[0].sinstrumentid
                            },
                            ntzfromdate: {
                                "value": response[0].data.EditResultUsedInstrument[0].ntzfromdate,
                                "label": response[0].data.EditResultUsedInstrument[0].stzfromdate
                            },
                            ntztodate: {
                                "value": response[0].data.EditResultUsedInstrument[0].ntztodate,
                                "label": response[0].data.EditResultUsedInstrument[0].stztodate
                            },
                            //dfromdate: new Date(response[0].data.EditResultUsedInstrument[0].sfromdate),
                            //dtodate: new Date(response[0].data.EditResultUsedInstrument[0].stodate)
                            dfromdate:rearrangeDateFormat(inputData.userInfo,response[0].data.EditResultUsedInstrument[0].sfromdate),
                            dtodate: rearrangeDateFormat(inputData.userInfo,response[0].data.EditResultUsedInstrument[0].stodate)
                        },
                        timeZoneList: TagListTimeZone || [],
                        ncontrolcode:inputData.ncontrolCode,
                        loading: false,
                        screenName: "IDS_INSTRUMENT",
                        openModal: true,
                        operation: "update"
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
            })
    }
}

export function deleteTaskRecord(inputData,userInfo) {
    return function (dispatch) {
        let inputParamData = {
            nresultusedtaskcode: inputData.selectedRecord.nresultusedtaskcode,
            userinfo: inputData.userInfo,
            ntransactiontestcode: inputData.masterData.RESelectedTest ?
                inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
            nregtypecode: inputData.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: inputData.masterData.defaultRegistrationSubType.nregsubtypecode
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/deleteResultUsedTasks", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        loading: false,
                        operation: "delete",
                        openModal: false,
                        loadEsign: false
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
            })
    }
}


export function fetchTaskRecord(inputData) {
    return function (dispatch) {
        let inputParamData = {
            nresultusedtaskcode: inputData.editRow.nresultusedtaskcode,
            userinfo: inputData.userInfo,
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getResultUsedTask", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        selectedId: response.data.EditResultUsedTasks[0].nresultusedtaskcode,
                        selectedRecord: {
                            npreregno: response.data.EditResultUsedTasks[0].npreregno,
                            stestsynonym: inputData.editRow.stestsynonym,
                            sanalysistime: response.data.EditResultUsedTasks[0].sanalysistime,
                            smisctime: response.data.EditResultUsedTasks[0].smisctime,
                            spreanalysistime: response.data.EditResultUsedTasks[0].spreanalysistime,
                            spreparationtime: response.data.EditResultUsedTasks[0].spreparationtime,
                            scomments: response.data.EditResultUsedTasks[0].scomments,
                            nresultusedtaskcode: response.data.EditResultUsedTasks[0].nresultusedtaskcode
                        },
                        loading: false,
                        screenName: "IDS_TASK",
                        openModal: true,
                        operation: "update",
                        ncontrolcode: inputData.ncontrolcode,
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
            })
    }
}

export function parameterRecord(inputData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactionresultcode: inputData.selectedRecord.ntransactionresultcode,
            ntransactiontestcode: inputData.masterData.RESelectedTest ? inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
            ncontrolcode: inputData.controlcode,
            userinfo: inputData.userInfo
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getParameterComments", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                        },
                        selectedId: response.data.ParameterComments.ntransactionresultcode,
                        selectedRecord: {
                            sresultcomment: response.data.ParameterComments.sresultcomment,
                            stestsynonym: inputData.selectedRecord.stestsynonym,
                            sparametersynonym: inputData.selectedRecord.sparametersynonym,
                            transactiontestcode: response.data.ParameterComments.ntransactiontestcode,
                            ntransactionresultcode: response.data.ParameterComments.ntransactionresultcode,
                            ntransactiontestcode: inputData.masterData.RESelectedTest ? inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
                            ncontrolcode: inputData.controlcode
                        },
                        loading: false,
                        screenName: "IDS_PARAMETERCOMMENTS",
                        openModal: true,
                        operation: "updateParameterComments",
                        ncontrolcode: inputData.controlcode
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
            })
    }
}


export function checkListRecord(inputData) {

    return function (dispatch) {
        let inputParamData = {
            ntransactionresultcode: inputData.selectedRecord.ntransactionresultcode,
            napprovalparametercode: inputData.selectedRecord.napprovalparametercode,
            nchecklistversioncode: inputData.selectedRecord.nchecklistversioncode,
            ntransactiontestcode: inputData.selectedRecord.ntransactiontestcode.toString(),
            ncontrolcode: inputData.ncontrolcode,
            userinfo: inputData.userInfo,
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getChecklistdesign", inputParamData)
            .then(response => {
                let selectedRecord = {};
                let lsteditedQB = [];
                selectedRecord = {
                    npreregno: inputData.selectedRecord.npreregno,
                    stestsynonym: inputData.selectedRecord.stestsynonym,
                    sparametersynonym: inputData.selectedRecord.sparametersynonym,
                    ntransactiontestcode: inputData.selectedRecord.ntransactiontestcode,
                    ntransactionresultcode: inputData.selectedRecord.ntransactionresultcode,
                    transactiontestcode: inputData.masterData.RESelectedTest ? inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : ""
                }

                response.data.ChecklistData.map(checklist => {
                    selectedRecord[checklist.nchecklistversionqbcode] = {
                        nchecklistqbcode: checklist.nchecklistqbcode,
                        nchecklistversioncode: checklist.nchecklistversioncode,
                        nchecklistversionqbcode: checklist.nchecklistversionqbcode,
                        sdefaultvalue: checklist.sdefaultvalue
                    }
                    lsteditedQB.push(checklist.nchecklistversionqbcode);
                    return null;
                });
                selectedRecord["editedQB"] = lsteditedQB;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        selectedId: response.data.selectedId,
                        selectedRecord: selectedRecord,
                        loading: false,
                        screenName: "IDS_CHECKLISTRESULT",
                        openTemplateModal: true,
                        needSaveButton: inputData.needSaveButton,
                        operation: "create",
                        ncontrolCode: inputData.ncontrolcode
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
            })
    }
}

export function onSaveCheckList(selectedRecord, userInfo, nregtypecode, nregsubtypecode) {

    return function (dispatch) {

        let listResultCheckList = [];
        if (selectedRecord && selectedRecord.editedQB) {
            selectedRecord.editedQB.map(qbcode =>
                listResultCheckList.push(selectedRecord[qbcode]))

            let inputParamData = {
                ntransactionresultcode: selectedRecord.ntransactionresultcode,
                ntransactiontestcode: selectedRecord.ntransactiontestcode.toString(),
                transactiontestcode: selectedRecord.transactiontestcode,
                npreregno: selectedRecord.npreregno,
                ResultCheckList: listResultCheckList,
                userinfo: userInfo,
                nregtypecode: nregtypecode,
                nregsubtypecode: nregsubtypecode,
                ncontrolcode: -1
            }

            dispatch(initRequest(true));
            rsapi.post("resultentrybysample/createResultEntryChecklist", inputParamData)

                .then(response => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            selectedRecord: {},
                            templateData: undefined,
                            openTemplateModal: false,
                            openModal: false,
                            loading: false,
                            loadEsign:false
                        }
                    })
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign:false
                        }
                    })
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        } else {

            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    openTemplateModal: false,
                    selectedRecord: {},
                    loading: false,
                    loadEsign:false
                }
            })
        }
    }
}

export function defaultTest(inputData, RESelectedTest, RESelectedSample, nregtypecode, nregsubtypecode) {
    if (RESelectedTest !== undefined && RESelectedTest.length > 0) {
        return function (dispatch) {
            let inputParamData = {
                userinfo: inputData.userinfo,
                ntransactiontestcode: RESelectedTest ? RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
                ntestgrouptestcode: RESelectedTest ? RESelectedTest.map(test => test.ntestgrouptestcode).join(",") : "",
                npreregno: RESelectedTest ? RESelectedTest.map(preregno => preregno.npreregno).join(",") : "",
                //RESelectedSample ? RESelectedSample.map(preregno => preregno.npreregno).join(",") : "",
                nregtypecode: nregtypecode,
                nregsubtypecode: nregsubtypecode,
                ncontrolcode: inputData.ncontrolcode
            }
            dispatch(initRequest(true));
            rsapi.post("resultentrybysample/updateDefaultValue", inputParamData)
                .then(response => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData: {
                                ...inputData.masterData,
                                ...response.data,
                                TestParameters: replaceUpdatedObject(response.data.TestParameters, inputData.masterData.TestParameters, 'ntransactionresultcode'),
                                RESelectedSubSample: inputData.masterData.RESelectedSubSample
                            },
                            loading: false,
                            activeTestKey: "IDS_RESULTS",
                            openModal: false,
                            loadEsign: false
                        }
                    })
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            openModal: false,
                            loadEsign: false
                        }
                    })
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        }
    } else {
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTTESTTOCOMPLETE"
        }));
    }

}

export function getFormula(parameterData, userInfo, masterData, index,selectedRecord) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: parameterData.ntransactiontestcode,
            nformulacode: parameterData.ntestgrouptestformulacode,
            userinfo: userInfo,
        }
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getFormulaInputs", inputParamData)
            .then(response => {

                const validateFormulaMandyFields = response.data.DynamicFormulaFields.map((item, index) => {
                    return {
                        "idsName": "IDS_FILLALLFIELDS",
                        "dataField": index,
                        "mandatory": true
                    }
                });
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                        },
                        selectedRecord: {
                            ...selectedRecord,
                            parameterData: parameterData,
                            sformulacalculationdetail: response.data.query,
                            formulainput: response.data.Formula,
                            resultindex: index,
                            selectedForumulaInput: []
                        },
                        validateFormulaMandyFields,
                        loading: false,
                        screenName: "IDS_RESULTFORMULA",
                        showFormula: true,
                        operation: "validate",
                        showValidate: true
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
            })
    }
}

export function calculateFormula(inputDataValue) {
    return function (dispatch) {
        const inputData = {
            ntransactiontestcode: inputDataValue.selectedRecord.parameterData.ntransactiontestcode,
            ntransactionresultcode: inputDataValue.selectedRecord.parameterData.ntransactionresultcode,
            npreregno: inputDataValue.selectedRecord.parameterData.npreregno,
            sformulacalculationcode: inputDataValue.selectedRecord.sformulacalculationdetail,
            nformulacode: inputDataValue.selectedRecord.parameterData.ntestgrouptestformulacode,
            userinfo: inputDataValue.userInfo,
            dynamicformulafields: inputDataValue.lstDynamicFields,
        }

        dispatch(initRequest(true));
        rsapi.post("testmaster/calculateFormula", inputData)
            .then(response => {

                 // inputDataValue.selectedResultData[inputDataValue.selectedRecord.resultindex] =
                // {
                //     ntransactionresultcode: inputDataValue.selectedRecord.parameterData.ntransactionresultcode,
                //     ntransactiontestcode: inputDataValue.selectedRecord.parameterData.ntransactiontestcode,
                //     nparametertypecode: inputDataValue.selectedRecord.parameterData.nparametertypecode,
                //     sresult: response.data.Result,
                //     nroundingdigit: inputDataValue.selectedRecord.parameterData.nroundingdigits,
                //     value: inputDataValue.selectedRecord.parameterData.ngradecode,
                //     parameter: inputDataValue.selectedRecord.parameterData
                // }
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]["sfinal"] = response.data.Result;
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]["sresult"] = response.data.Result;
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]['editable'] = true;
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]["ncalculatedresult"] = 3;
                // inputDataValue.selectedResultGrade[inputDataValue.selectedRecord.resultindex] = {
                //     ngradecode: numericGrade(inputDataValue.selectedRecord.parameterData, parseInt(response.data.Result))
                // }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputDataValue.masterData,
                            //selectedResultData: inputDataValue.selectedResultData,
                            //selectedResultGrade: inputDataValue.selectedResultGrade,
                            //ResultParameter: inputDataValue.ResultParameter
                        },
                        selectedRecord:{
                            selectedResultGrade:  inputDataValue.selectedResultGrade,
                            ResultParameter: inputDataValue.ResultParameter
                        },
                        loading: false,
                        screenName: "IDS_RESULTENTRY",
                        showFormula: false,
                        operation: "update",
                        showValidate: false
                    }
                })
            })
            .catch(error => {
                dispatch({type: DEFAULT_RETURN, payload: { loading: false}})
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    //toast.warn(error.response.data);
                    toast.warn(error.response.data["Result"]);
                }
            })
    }
}

export function getREFilterTestData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getTestBasedOnCombo", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultFilterStatus: inputData.defaultFilterStatus,
                        },
                        loading: false
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
            })
    }
}

export function updateTestMethodSource(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/updateTestMethodSource", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            RE_TEST: replaceUpdatedObject(response.data.RE_TEST, masterData.RE_TEST, 'ntransactiontestcode')
                        },
                        loading: false,
                        openModal: false,
                        loadEsign: false

                        // activeTestKey: "IDS_RESULTS"
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
            })
    }
}

export function resultImportFile(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getImportResultEntry", inputData)
            .then(response => {


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData
                        },
                        loading: false,
                        openModal: false,
                        // activeTestKey: "IDS_RESULTS"
                    }
                })

                if (response.data.returnStatus && response.data.returnStatus !== "") {
                    toast.info(response.data.returnStatus);
                }
                else {
                    toast.warn(response.data.returnStatus);
                }
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
            })
    }
}

export function validateEsignCredentialComplete(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi.post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data === "Success") {



                    const methodUrl = "performaction"
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                    }
                    if (inputParam["screenData"]["inputParam"]["operation"] === "complete") {
                        dispatch(completeTest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["inputParam"]["RESelectedTest"], inputParam.inputData.userinfo))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "default") {
                        dispatch(defaultTest(inputParam["screenData"]["inputParam"]["testChildGetREParam"], inputParam["screenData"]["inputParam"]["RESelectedTest"], inputParam["screenData"]["inputParam"]["RESelectedSample"], inputParam["screenData"]["inputParam"]["inputData"]["nregtypecode"], inputParam["screenData"]["inputParam"]["inputData"]["nregsubtypecode"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "deleteInstrument") {
                        dispatch(deleteInstrumentRecord(inputParam["screenData"]["inputParam"]["inputData"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "createMethod") {
                        dispatch(updateTestMethodSource(inputParam["screenData"]["inputParam"]["inputData"], inputParam["screenData"]["inputParam"]["masterData"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "deleteTask") {
                        dispatch(deleteTaskRecord(inputParam["screenData"]["inputParam"]["inputData"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "updateParameterComments") {
                        dispatch(updateParameterComments(inputParam["screenData"]["inputParam"]["inputData"],  inputParam["screenData"]["inputParam"]["masterData"]))
                    }else if (inputParam["screenData"]["operation"] === "updatechecklist") {
                        let { selectedRecord, userInfo, nregtypecode, nregsubtypecode } = inputParam["screenData"];
                        delete selectedRecord.esignpassword;
                        delete selectedRecord.esigncomments;
                        delete selectedRecord.agree;
                        delete inputParam.inputData.password;
                        userInfo = inputParam.inputData.userinfo;
                        dispatch(onSaveCheckList(selectedRecord, userInfo, nregtypecode, nregsubtypecode))
                    }
                }
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
            })
    };
}

export function getMeanCalculationTestParameter(meanParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        const inputData = {
            npreregno: meanParam.selectedRecord.npreregno,
            ntransactionresultcode: meanParam.selectedRecord.ntransactionresultcode,
            userinfo: meanParam.userInfo
        }
        return rsapi.post("resultentrybysample/getMeanCalculationTestParameter", inputData)
            .then(response => {

                const list = response.data || [];
                // const optionList = [];
                // list.map(item=>{
                //     console.log("item:", item);
                //         optionList.push({item:item, 
                //                         label:"["+item.stestsynonym+"]-["+item.sparametersynonym+"]-["+item.sresult+"]", 
                //                         value:item.ntransactionresultcode})
                //     })
                // const masterData = {...masterData, ResultParameter:meanParam.selectedRecord}
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal: true,
                        meanTestParameterList: list,
                        screenName: "IDS_MEANPARAMETER",
                        ncontrolcode: meanParam.ncontrolCode,
                        selectedTestParameterMean: meanParam.selectedRecord
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    };
}