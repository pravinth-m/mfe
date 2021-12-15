import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { constructOptionList, fillRecordBasedOnCheckBoxSelection, getRecordBasedOnPrimaryKeyName, replaceUpdatedObject, sortData } from '../components/CommonScript';
import { postCRUDOrganiseTransSearch } from './ServiceAction';
import { REPORTTYPE, reportCOAType, transactionStatus } from '../components/Enumeration';

export function getsubSampleDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 2,
            nflag: 2,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            nsectioncode: inputData.nsectioncode,
            ntestcode: inputData.ntestcode,
            napprovalversioncode: String(inputData.sample[0].napprovalversioncode),
            napprovalconfigcode: inputData.napprovalconfigcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            userinfo: inputData.userinfo
        }
        let activeName = "";
        let dataStateName = "";
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi.post("approval/getApprovalSubSample", inputParamData)
                .then(response => {
                    let responseData = { ...response.data, selectedSample: inputData.selectedSample }
                    responseData = sortData(responseData)
                    let oldSelectedTest = inputData.masterData.selectedTest
                    inputData.masterData.selectedTest = oldSelectedTest.length > 0 ? oldSelectedTest : responseData.selectedTest ? responseData.selectedTest : inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        selectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : [],
                        selectedSample: inputData.selectedSample,
                        selectedPreregno: inputData.npreregno,
                    }
                    if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                        inputData.searchSubSampleRef.current.value = "";
                        masterData['searchedSubSample'] = undefined
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTests'] = undefined
                    }
                    let { testskip, testtake } = inputData
                    let bool = false;
                    if (inputData.masterData.AP_TEST.length < inputData.testskip) {
                        testskip = 0;
                        bool = true
                    }
                    let skipInfo = {}
                    if (bool) {
                        skipInfo = { testskip, testtake }
                    }
                    // let wholeApprovalParameter = [];
                    let ApprovalParameter = [];
                    // let wholeResultUsedInstrument = [];
                    let ResultUsedInstrument = [];
                    // let wholeResultUsedTasks = [];
                    let ResultUsedTasks = [];
                    // let wholeRegistrationTestAttachment = [];
                    let RegistrationTestAttachment = [];
                    // let wholeApprovalResultChangeHistory = [];
                    let ApprovalResultChangeHistory = [];
                    // let wholeRegistrationTestComments = [];
                    let RegistrationTestComment = [];
                    let ApprovalHistory = [];
                    if (inputData.checkBoxOperation === 1) {


                        let wholeTestList = masterData.AP_TEST.map(b => b.ntransactiontestcode)
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
                                selectedTest: oldSelectedTest
                            }
                        } else {
                            ntransactiontestcode = masterData.selectedTest[0].ntransactiontestcode
                        }
                        switch (inputData.activeTestTab) {
                            case "IDS_RESULTS":
                                ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
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
                                ApprovalResultChangeHistory = keepOld ? inputData.masterData.ApprovalResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTAPPROVALHISTORY":
                                ApprovalHistory = keepOld ? inputData.masterData.ApprovalHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalHistory"
                                dataStateName = "historyDataState"
                                break;
                            default:
                                ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                    } else if (inputData.checkBoxOperation === 5) {
                        masterData = {
                            ...masterData,
                            selectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                        }
                        let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : 0;
                        let list = [];
                        let dbData = []
                        switch (inputData.activeTestTab) {
                            case "IDS_RESULTS":
                                dbData = response.data.ApprovalParameter || []
                                list = [...inputData.masterData.ApprovalParameter, ...dbData]
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, ntransactiontestcode, "ntransactiontestcode")
                                break;
                            case "IDS_INSTRUMENT":
                                dbData = response.data.ResultUsedInstrument || []
                                list = [...inputData.masterData.ResultUsedInstrument, ...dbData]
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TASK":
                                dbData = response.data.ResultUsedTasks || []
                                list = [...inputData.masterData.ResultUsedTasks, ...dbData]
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData]
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                dbData = response.data.ApprovalResultChangeHistory || []
                                list = [...inputData.masterData.ApprovalResultChangeHistory, ...dbData]
                                ApprovalResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData]
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTAPPROVALHISTORY":
                                dbData = response.data.ApprovalHistory || []
                                list = [...inputData.masterData.ApprovalHistory, ...dbData]
                                ApprovalHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            default:
                                dbData = response.data.ApprovalParameter || []
                                list = [...inputData.masterData.ApprovalParameter, ...dbData]
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                    } else {
                        masterData = {
                            ...masterData,
                            selectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                        }
                        let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : 0
                        let list = [];
                        switch (inputData.activeTestTab) {
                            case "IDS_RESULTS":
                                list = response.data.ApprovalParameter || []
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                list = response.data.ResultUsedInstrument || []
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_TASK":
                                list = response.data.ResultUsedTasks || []
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment || []
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                list = response.data.ApprovalResultChangeHistory || []
                                ApprovalResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ApprovalResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment || []
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTAPPROVALHISTORY":
                                list = response.data.ApprovalHistory || []
                                ApprovalHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ApprovalHistory"
                                dataStateName = "historyDataState"
                                break;
                            default:
                                list = [...inputData.masterData.ApprovalParameter, ...response.data.ApprovalParameter]
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                    }
                    masterData = {
                        ...masterData,
                        // wholeApprovalParameter,
                        ApprovalParameter,
                        // wholeResultUsedInstrument,
                        ResultUsedInstrument,
                        // wholeResultUsedTasks,
                        ResultUsedTasks,
                        // wholeRegistrationTestAttachment,
                        RegistrationTestAttachment,
                        // wholeApprovalResultChangeHistory,
                        ApprovalResultChangeHistory,
                        // wholeRegistrationTestComments,
                        RegistrationTestComment,
                        ApprovalHistory
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    skipInfo = {
                        ...skipInfo,
                        samplePrintHistoryDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        },
                        sampleHistoryDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab,
                            activeSampleTab: inputData.activeSampleTab,
                            skip: undefined,
                            take: undefined,
                            ...skipInfo
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
        } else {
            let oldSelectedTest = inputData.masterData.selectedTest
            let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = true;
            } else {
                isGrandChildGetRequired = false;
            }
            // let wholeApprovalParameter = [];
            let ApprovalParameter = [];
            // let wholeResultUsedInstrument = [];
            let ResultUsedInstrument = [];
            // let wholeResultUsedTasks = [];
            let ResultUsedTasks = [];
            // let wholeRegistrationTestAttachment = [];
            let RegistrationTestAttachment = [];
            // let wholeApprovalResultChangeHistory = [];
            let ApprovalResultChangeHistory = [];
            // let wholeRegistrationTestComments = [];
            let RegistrationTestComment = [];

            let ApprovalHistory = [];
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode.toString() : "";
                let selectedSample = inputData.selectedSample;
                let selectedPreregno = inputData.npreregno;
                let selectedTest = inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : [];
                let selectedSubSample = inputData.masterData.AP_SUBSAMPLE

                inputData = {
                    ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                        "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, selectedSample, selectedPreregno, selectedTest,
                    selectedSubSample, checkBoxOperation: 3
                }
                dispatch(getTestChildTabDetail(inputData, true));
            } else {
                //added by sudharshanan for test select issue while sample click
                let masterData = {
                    ...inputData.masterData,
                    selectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : [],
                    selectedSample: inputData.selectedSample,
                    selectedSubSample: inputData.masterData.AP_SUBSAMPLE
                }
                let wholeTestList = masterData.AP_TEST.map(b => b.ntransactiontestcode)
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
                        selectedTest: oldSelectedTest
                    }
                } else {
                    // ntransactiontestcode = masterData.selectedTest[0].ntransactiontestcode
                    ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "-1";
                }
                switch (inputData.activeTestTab) {
                    case "IDS_RESULTS":
                        ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                        // wholeApprovalParameter = filterRecordBasedOnPrimaryKeyName(inputData.masterData.wholeApprovalParameter,
                        //     inputData.removeElementFromArray.length > 0 ? inputData.removeElementFromArray[0].npreregno : "", "npreregno");
                        break;
                    case "IDS_INSTRUMENT":
                        ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                        // wholeResultUsedInstrument = filterRecordBasedOnPrimaryKeyName(inputData.masterData.wholeResultUsedInstrument,
                        //     inputData.removeElementFromArray.length > 0 ? inputData.removeElementFromArray[0].npreregno : "", "npreregno");
                        break;
                    case "IDS_TASK":
                        ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks, ntransactiontestcode, "ntransactiontestcode")
                        // wholeResultUsedTasks = filterRecordBasedOnPrimaryKeyName(inputData.masterData.wholeResultUsedTasks,
                        //     inputData.removeElementFromArray.length > 0 ? inputData.removeElementFromArray[0].npreregno : "", "npreregno");
                        break;
                    case "IDS_TESTATTACHMENTS":
                        RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                        // wholeRegistrationTestAttachment = filterRecordBasedOnPrimaryKeyName(inputData.masterData.wholeRegistrationTestAttachment,
                        //     inputData.removeElementFromArray.length > 0 ? inputData.removeElementFromArray[0].npreregno : "", "npreregno");
                        break;
                    case "IDS_RESULTCHANGEHISTORY":
                        ApprovalResultChangeHistory = keepOld ? inputData.masterData.ApprovalResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                        // wholeApprovalResultChangeHistory = filterRecordBasedOnPrimaryKeyName(inputData.masterData.wholeApprovalResultChangeHistory,
                        //     inputData.removeElementFromArray.length > 0 ? inputData.removeElementFromArray[0].npreregno : "", "npreregno");
                        break;
                    case "IDS_TESTCOMMENTS":
                        RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                        // wholeRegistrationTestComments = filterRecordBasedOnPrimaryKeyName(inputData.masterData.wholeRegistrationTestComments,
                        //     inputData.removeElementFromArray.length > 0 ? inputData.removeElementFromArray[0].npreregno : "", "npreregno");
                        break;
                    case "IDS_TESTAPPROVALHISTORY":
                        ApprovalHistory = keepOld ? inputData.masterData.ApprovalHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalHistory, ntransactiontestcode, "ntransactiontestcode")
                        break;
                    default:
                        ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                        // wholeRegistrationTestComments = filterRecordBasedOnPrimaryKeyName(inputData.masterData.wholeApprovalParameter,
                        //     inputData.removeElementFromArray.length > 0 ? inputData.removeElementFromArray[0].npreregno : "", "npreregno");
                        break;
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...masterData,
                            // wholeApprovalParameter,
                            ApprovalParameter,
                            // wholeResultUsedInstrument,
                            ResultUsedInstrument,
                            // wholeResultUsedTasks,
                            ResultUsedTasks,
                            // wholeRegistrationTestAttachment,
                            RegistrationTestAttachment,
                            // wholeApprovalResultChangeHistory,
                            ApprovalResultChangeHistory,
                            // wholeRegistrationTestComments,
                            RegistrationTestComment,
                            ApprovalHistory
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab
                    }
                })
            }
        }
    }
}
export function getTestDetail(inputData) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 3,
            nflag: 3,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalversioncode: inputData.napprovalversioncode,
            napprovalconfigcode: inputData.napprovalconfigcode,
            ntransactionsamplecode: inputData.ntransactionsamplecode,
            nsectioncode: inputData.nsectioncode,
            ntestcode: inputData.ntestcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            userinfo: inputData.userinfo
        }
        dispatch(initRequest(true));
        rsapi.post("approval/getApprovalTest", inputParamData)
            .then(response => {
                let responseData = { ...response.data }
                //responseData = sortData(responseData)
                inputData.searchTestRef.current.null = ""
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            selectedSubSample: inputData.selectedSubSample,
                            selectedPreregno: inputData.npreregno,
                            selectedSampleCode: inputData.ntransactionsamplecode
                        },
                        loading: false,
                        showFilter: false,
                        activeTestTab: inputData.activeTestTab
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
export function getTestChildTabDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        if (inputData.ntransactiontestcode && inputData.ntransactiontestcode.length > 0) {
            let inputParamData = {
                ntransactiontestcode: inputData.ntransactiontestcode,
                npreregno: inputData.npreregno,
                userinfo: inputData.userinfo
            }
            let url = null
            let { testtake } = inputData;
            let activeName = "";
            let dataStateName = "";
            switch (inputData.activeTestTab) {
                case "IDS_RESULTS":
                    url = "approval/getapprovalparameter"
                    activeName = "ApprovalParameter"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_PARAMETERRESULTS":
                    url = "registration/getregistrationparameter"
                    activeName = "RegistrationParameter"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_INSTRUMENT":
                    url = "resultentrybysample/getResultUsedInstrument"
                    activeName = "ResultUsedInstrument"
                    dataStateName = "instrumentDataState"
                    break;
                case "IDS_MATERIAL":
                    url = "resultentrybysample/getResultUsedMaterial"
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
                    url = "approval/getapprovalparameter"
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    url = "approval/getApprovalResultChangeHistory"
                    activeName = "ApprovalResultChangeHistory"
                    dataStateName = "resultChangeDataState"
                    break;
                case "IDS_TESTAPPROVALHISTORY":
                    url = "approval/getApprovalHistory"
                    activeName = "ApprovalHistory"
                    dataStateName = "historyDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    url = "attachment/getSampleAttachment"
                    break;
                default:
                    url = "approval/getapprovalparameter"
                    activeName = "ApprovalParameter"
                    dataStateName = "resultDataState"
                    break;
            }
            if (url !== null) {
                dispatch(initRequest(true));
                if (isServiceRequired) {
                    rsapi.post(url, inputParamData)
                        .then(response => {
                            let skipInfo = {};
                            let responseData = { ...response.data, selectedSample: inputData.selectedSample || inputData.masterData.selectedSample, selectedTest: inputData.selectedTest }
                            //responseData = sortData(responseData)
                            // fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode",inputData.removeElementFromArray);
                            fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                            let masterData = {
                                ...inputData.masterData,
                                selectedSample: inputData.selectedSample || inputData.masterData.selectedSample,
                                selectedTest: inputData.selectedTest,
                                selectedPreregno: inputData.npreregno,
                                selectedSampleCode: inputData.ntransactionsamplecode,
                                selectedTestCode: inputData.ntransactiontestcode,
                            }
                            if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                                skipInfo = {

                                    [dataStateName]: {
                                        ...inputData[dataStateName],
                                        skip: 0,
                                        sort: undefined,
                                        filter: undefined
                                    }
                                }
                            } else {
                                skipInfo = {
                                    ...skipInfo,
                                    [dataStateName]: {
                                        ...inputData[dataStateName],
                                        sort: undefined,
                                        filter: undefined
                                    }
                                }
                            }
                            dispatch({
                                type: DEFAULT_RETURN, payload: {
                                    masterData,
                                    loading: false,
                                    showFilter: false,
                                    activeTestTab: inputData.activeTestTab,
                                    screenName: inputData.screenName,
                                    testtake, testskip: undefined,
                                    ...skipInfo
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
                } else {
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode", inputData.removeElementFromArray);
                    let skipInfo = {};
                    let masterData = {
                        ...inputData.masterData,
                        selectedTest: inputData.selectedTest,
                        selectedPreregno: inputData.npreregno,
                        selectedSampleCode: inputData.ntransactionsamplecode,
                        selectedTestCode: inputData.ntransactiontestcode,
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {

                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab,
                            screenName: inputData.screenName,
                            testtake, testskip: undefined,
                            ...skipInfo
                        }
                    })
                }

            } else {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab
                    }
                })
            }
        } else {
            let { ApprovalParameter, ResultUsedInstrument, ResultUsedTasks, RegistrationTestAttachment, ApprovalResultChangeHistory,
                RegistrationTestComment, ApprovalHistory } = inputData.masterData
            switch (inputData.activeTestTab) {
                case "IDS_RESULTS":
                    ApprovalParameter = [];
                    break;
                case "IDS_INSTRUMENT":
                    ResultUsedInstrument = []
                    break;
                case "IDS_TASK":
                    ResultUsedTasks = []
                    break;
                case "IDS_TESTATTACHMENTS":
                    RegistrationTestAttachment = []
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    ApprovalResultChangeHistory = []
                    break;
                case "IDS_TESTCOMMENTS":
                    RegistrationTestComment = []
                    break;
                case "IDS_APPROVALHISTORY":
                    ApprovalHistory = []
                    break;
                default:
                    ApprovalParameter = []
                    break;
            }

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData: {
                        ...inputData.masterData,
                        selectedTest: [],
                        ApprovalParameter, ResultUsedInstrument, ResultUsedTasks, RegistrationTestAttachment,
                        ApprovalResultChangeHistory, RegistrationTestComment, ApprovalHistory
                    }, loading: false
                }
            })
        }
    }
}
export function getSampleChildTabDetail(inputData) {
    return function (dispatch) {
        if (inputData.npreregno.length > 0) {
            let inputParamData = {
                npreregno: inputData.npreregno,
                userinfo: inputData.userinfo
            }
            let url = null
            switch (inputData.activeSampleTab) {
                case "IDS_SAMPLEATTACHMENTS":
                    url = "attachment/getSampleAttachment"
                    break;
                case "IDS_SAMPLECOMMENTS":
                    url = "resultentrybysample/getResultUsedInstrument"
                    break;
                case "IDS_SUBSAMPLEATTACHMENTS":
                    url = "resultentrybysample/getResultUsedMaterial"
                    break;
                case "IDS_SUBSAMPLECOMMENTS":
                    url = "resultentrybysample/getResultUsedTask"
                    break;
                case "IDS_SOURCE":
                    url = "registration/getRegistrationSourceCountry"
                    break;
                case "IDS_SAMPLEAPPROVALHISTORY":
                    url = "approval/getSampleApprovalHistory"
                    break;

                case "IDS_PRINTHISTORY":
                    url = "approval/getPrintHistory"
                    break;
                case "IDS_REPORTHISTORY":
                    url = "approval/getCOAHistory"
                    break;
                default:
                    url = null
                    break;
            }
            if (url !== null) {
                dispatch(initRequest(true));
                rsapi.post(url, inputParamData)
                    .then(response => {
                        let responseData = { ...response.data }
                        responseData = sortData(responseData)
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData: {
                                    ...inputData.masterData,
                                    ...responseData,
                                    selectedSample: inputData.selectedSample,
                                    selectedTestCode: inputData.ntransactiontestcode,
                                },
                                loading: false,
                                showFilter: false,
                                activeSampleTab: inputData.activeSampleTab,
                                screenName: inputData.screenName
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
            } else {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            selectedSample: inputData.selectedSample
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab
                    }
                })
            }
        } else {
            toast.warn("Please Select a Sample");
        }
    }
}
export function performAction(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi.post("approval/performAction", inputParam.inputData)
            .then(response => {
                let masterData = {
                    ...inputParam.masterData,
                    ...response.data,
                    AP_SAMPLE: replaceUpdatedObject(response.data.updatedSample, inputParam.masterData.AP_SAMPLE, 'npreregno'),
                    AP_SUBSAMPLE: replaceUpdatedObject(response.data.updatedSubSample, inputParam.masterData.AP_SUBSAMPLE, 'ntransactionsamplecode'),
                    AP_TEST: replaceUpdatedObject(response.data.updatedTest, inputParam.masterData.AP_TEST, 'ntransactiontestcode')
                }
                // dispatch({type: DEFAULT_RETURN, payload:{
                // masterData:{
                //     ...inputParam.inputData.masterData,
                //     ...response.data, 
                //     AP_SAMPLE:replaceUpdatedObject(response.data.updatedSample,inputParam   .inputData.masterData.AP_SAMPLE,'npreregno'),
                //     AP_SUBSAMPLE:replaceUpdatedObject(response.data.updatedSubSample,inputParam.inputData.masterData.AP_SUBSAMPLE,'ntransactionsamplecode'),
                //     AP_TEST:replaceUpdatedObject(response.data.updatedTest,inputParam.inputData.masterData.AP_TEST,'ntransactiontestcode')
                // },
                //     loading:false ,
                //     loadEsign:false,
                //     openChildModal:false                     
                // }}) 
                let respObject = {
                    masterData,
                    inputParam,
                    openChildModal: false,
                    operation: "dynamic",
                    masterStatus: "",
                    errorCode: undefined,
                    loadEsign: false,
                    showEsign: false,
                    selectedRecord: {},
                    loading: false
                }

                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))


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
export function updateDecision(inputParam) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("approval/updateDecision", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                // dispatch({type: DEFAULT_RETURN, payload:{
                //     masterData:{
                //         ...inputParam.masterData,
                //         ...responseData, 
                //         AP_SAMPLE:replaceUpdatedObject(response.data.updatedSample,inputParam.masterData.AP_SAMPLE,'npreregno'),
                //         AP_SUBSAMPLE:replaceUpdatedObject(response.data.updatedSubSample,inputParam.masterData.AP_SUBSAMPLE,'ntransactionsamplecode'),
                //         AP_TEST:replaceUpdatedObject(response.data.updatedTest,inputParam.masterData.AP_TEST,'ntransactiontestcode')

                //     },
                //     loading:false                      
                // }}) 
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                    AP_SAMPLE: replaceUpdatedObject(response.data.updatedSample, inputParam.masterData.AP_SAMPLE, 'npreregno'),
                    AP_SUBSAMPLE: replaceUpdatedObject(response.data.updatedSubSample, inputParam.masterData.AP_SUBSAMPLE, 'ntransactionsamplecode'),
                    AP_TEST: replaceUpdatedObject(response.data.updatedTest, inputParam.masterData.AP_TEST, 'ntransactiontestcode')

                }
                let respObject = {
                    masterData,
                    inputParam,
                    openChildModal: false,
                    operation: "dynamic",
                    masterStatus: "",
                    errorCode: undefined,
                    loadEsign: false,
                    showEsign: false,
                    selectedRecord: {},
                    loading: false
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
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
export function getRegistrationType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("approval/getRegistrationType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            SampleTypeValue: inputData.SampleTypeValue
                        },
                        loading: false
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
export function getRegistrationSubType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("approval/getRegistrationSubType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegTypeValue: inputData.RegTypeValue
                        },
                        loading: false
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
export function getFilterStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("approval/getFilterStatus", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegSubTypeValue: inputData.RegSubTypeValue
                        },
                        loading: false
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

export function getFilterBasedTest(inputData) {

    
    return function (dispatch) {
    if(inputData.napprovalversioncode)
    {
        dispatch(initRequest(true));
        rsapi.post("approval/getFilterBasedTest", inputData)
            .then(response => {


                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegSubTypeValue: inputData.RegSubTypeValue
                        },
                        loading: false
                    }
                })
                if(response.data.rtn)
                {
                    toast.warn(response.data.rtn);
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
        else
        {
               toast.warn("Please Select All the Values in Filter");
        }
    }

}

export function getApprovalVersion(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("approval/getApprovalVersion", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            // fromDate: inputParam.inputData.dfrom,
                            // toDate: inputParam.inputData.dto,
                        },
                        loading: false,
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
export function getApprovalSample(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("approval/getApprovalSample", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                // responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchSampleRef !== undefined && inputParam.searchSampleRef.current !== null) {
                    inputParam.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null) {
                    inputParam.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null) {
                    inputParam.searchTestRef.current.value = ""
                    // masterData['searchedTest'] = undefined
                    masterData['searchedTests'] = undefined

                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        take: inputParam.take,
                        testskip: 0,
                        testtake: inputParam.testtake,
                        resultDataState: {...inputParam.resultDataState,sort:undefined,filter:undefined},
                        instrumentDataState: {...inputParam.instrumentDataState,sort:undefined,filter:undefined},
                        materialDataState: {...inputParam.materialDataState,sort:undefined,filter:undefined},
                        taskDataState: {...inputParam.taskDataState,sort:undefined,filter:undefined},
                        documentDataState: {...inputParam.documentDataState,sort:undefined,filter:undefined},
                        resultChangeDataState: {...inputParam.resultChangeDataState,sort:undefined,filter:undefined},
                        testCommentDataState:{...inputParam.testCommentDataState,sort:undefined,filter:undefined},
                        historyDataState: {...inputParam.historyDataState,sort:undefined,filter:undefined},
                        samplePrintHistoryDataState: {...inputParam.samplePrintHistoryDataState,sort:undefined,filter:undefined},
                        sampleHistoryDataState: {...inputParam.sampleHistoryDataState,sort:undefined,filter:undefined}
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
export function getStatusCombo(inputParam) {
    return function (dispatch) {
        let inputData = {
            ntransactionresultcode: inputParam.primaryKeyValue,
            userinfo: inputParam.userInfo
        }
        dispatch(initRequest(true));
        rsapi.post("approval/getStatusCombo", inputData)
            .then(response => {
                let responseData = { ...response.data }
                //responseData = sortData(responseData)
                const GradeListMap = constructOptionList(response.data.Grade || [], "ngradecode", "sgradename", 'ascending', 'ngradecode', false);
                let Grade = GradeListMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            Grade,
                            selectedParamId: inputParam.primaryKeyValue
                        },
                        loading: false,
                        showFilter: false,
                        openChildModal: true,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord: {
                            senforcestatuscomment: response.data.parameterComment && response.data.parameterComment.senforcestatuscomment,
                            ntransactionresultcode: response.data.parameterComment && response.data.parameterComment.ntransactionresultcode,
                            ntransactiontestcode: response.data.parameterComment && response.data.parameterComment.ntransactiontestcode
                        },
                        operation: "enforce",
                        screenName: "IDS_STATUS"
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
export function getParameterEdit(inputParam) {
    return function (dispatch) {
        let inputData = {
            ntransactiontestcode: inputParam.selectedTest && inputParam.selectedTest.map(item => item.ntransactiontestcode).join(","),
            userinfo: inputParam.userInfo
        }
        if (inputData.ntransactiontestcode && inputData.ntransactiontestcode.length > 0) {
            dispatch(initRequest(true));
            rsapi.post("approval/getEditParameter", inputData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            ...responseData,
                            loading: false,
                            openChildModal: true,
                            operation: "update",
                            screenName: "IDS_APPROVALPARAMETER"
                            // ncontrolCode:inputParam.ncontrolCode,
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
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    multilingualMsg: "IDS_SELECTTEST",
                }
            });
        }
    }
}
export function validateEsignforApproval(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi.post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data === "Success") {

                    if (inputParam.operation === 'dynamic') {
                        const methodUrl = "performaction"
                        inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                        if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                            inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                        }
                        dispatch(performAction(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
                    } else if (inputParam.operation === 'reportgeneration') {
                        delete inputParam["screenData"]["inputParam"]['reporparam']["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]['reporparam']["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]['reporparam']["agree"]
                        inputParam["screenData"]["inputParam"]["reporparam"]["userinfo"] = inputParam.inputData.userinfo;
                        dispatch(generateCOAReport(inputParam["screenData"]["inputParam"]['reporparam']))
                    }
                    else if (inputParam.operation === 'decision') {
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["agree"]
                        inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
                        dispatch(updateDecision(inputParam["screenData"]["inputParam"]))
                    }
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
    };
}

export function previewSampleReport(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        let ndecisionStatus = inputParam.sample.ndecisionstatus;
        if (inputParam.sample.ndecisionstatus === undefined || inputParam.sample.ndecisionstatus === transactionStatus.DRAFT) {
            ndecisionStatus = transactionStatus.PASS;
        }
        const inputData = {
            ndecisionstatus: ndecisionStatus,
            userinfo: inputParam.userinfo,
            nprimarykey: inputParam.sample.npreregno,
            ncoareporttypecode: reportCOAType.SAMPLECERTIFICATEPRIVIEW,
            nreporttypecode: REPORTTYPE.SAMPLEREPORT,
            sprimarykeyname: "npreregno",
            ncontrolcode: inputParam.ncontrolCode,
            nregtypecode: inputParam.sample.nregtypecode,
            nregsubtypecode: inputParam.sample.nregsubtypecode,
            npreregno: inputParam.sample.npreregno
        }
        rsapi.post("approval/previewSampleReport", inputData)
            .then(response => {

                if (response.data.rtn === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data.filepath);
                    document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openChildModal: false, loadEsign: false } })
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
export function generateCOAReport(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const inputData = {
            npreregno: inputParam.sample.npreregno,
            nsectioncode: inputParam.nsectioncode || -1,
            userinfo: inputParam.userinfo,
            nprimarykey: inputParam.sample.npreregno,
            ncoareporttypecode: reportCOAType.SAMPLEWISE,
            nreporttypecode: REPORTTYPE.COAREPORT,
            sprimarykeyname: "npreregno",
            ncontrolcode: inputParam.ncontrolCode,
            nregtypecode: inputParam.nregtypecode,
            nregsubtypecode: inputParam.nregsubtypecode
        }
        rsapi.post("approval/generateCOAReport", inputData)
            .then(response => {

                if (response.data.rtn === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data.filepath);
                    document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openChildModal: false, selectedRecord: {}, loadEsign: false } })
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
export function getEnforceCommentsHistory(selectedParam, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("approval/getEnforceCommentsHistory", {
            ntransactionresultcode: selectedParam.ntransactionresultcode,
            userinfo: userInfo
        })
            .then(response => {
                if (response.data.length > 0) {
                    masterData = { ...masterData, enforceCommentsHistory: response.data }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            masterData,
                            openChildModal: true,
                            operation: "view",
                            screenName: "IDS_ENFORCECOMMENTHISTORY"
                        }
                    })
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, multilingualMsg: "IDS_NOPREVIOUSCOMMENTSFOUND" } })

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