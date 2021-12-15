import rsapi from "../rsapi";
import { toast } from "react-toastify";
import { DEFAULT_RETURN } from "./LoginTypes";
import Axios from "axios";
import { initRequest, updateStore } from "./LoginAction";
import { transactionStatus } from "../components/Enumeration";
import { constructOptionList, showEsign } from "../components/CommonScript";
import { crudMaster } from './ServiceAction'
import { intl } from "../components/App";

export function getCommentsCombo(inputParam) {
    return (dispatch) => {
        if (inputParam.masterList && inputParam.masterList.length > 0) {
            dispatch(initRequest(true));
            let urlArray = [rsapi.post("/sampletestcomments/getSampleTestComments", { userinfo: inputParam.userInfo })];
            if (inputParam.operation === "update") {
                urlArray.push(rsapi.post("/comments/getEdit".concat(inputParam.methodUrl), { userinfo: inputParam.userInfo, selectedrecord: inputParam.editRow }))
            }
            Axios.all(urlArray)
                .then(response => {
                    let sampleTestComments = response[0].data;
                    let selectedRecord = {};
                    const defaultLink = sampleTestComments.filter(item => item.ndefaultstatus === transactionStatus.YES);
                    const sampleTestCommentsMap  = constructOptionList(sampleTestComments || [], "nsampletestcommentcode","ssampletestcommentname" , undefined, undefined, true);
                    sampleTestComments = sampleTestCommentsMap.get("OptionList");
                    let editObject = {};
                    if (inputParam.operation === "update") {
                        editObject = response[1].data;
                        let nsamplecommentscode = {};
                        nsamplecommentscode = { "label": editObject.ssampletestcommentname, "value": editObject.nsampletestcommentcode }
                        selectedRecord = {
                            ...editObject, nsamplecommentscode
                        };
                    } else {
                        selectedRecord = {
                            nsamplecommentscode: defaultLink.length > 0 ? { "label": defaultLink[0].ssampletestcommentname, "value": defaultLink[0].nsampletestcommentcode } : "",

                        };
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            [inputParam.modalName]: true,
                            operation: inputParam.operation,
                            screenName: inputParam.screenName,
                            ncontrolCode: inputParam.ncontrolCode,
                            selectedRecord, loading: false,
                            sampleTestComments,
                            modalType: 'comment',
                            modalName: [inputParam.modalName],
                            editObject
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                });
        } else {
            toast.warn(intl.formatMessage({ id: inputParam.masterAlertStatus }));
        }

    }
}

export function deleteComment(deleteParam) {
    return (dispatch) => {
        const methodUrl = deleteParam.methodUrl;
        const selected = deleteParam.selectedRecord;

        const inputParam = {
            inputData: {
                [methodUrl.toLowerCase()]: selected,
                npreregno: deleteParam.npreregno,
                ntransactiontestcode: deleteParam.ntransactiontestcode,
                ntransactionsamplecode: deleteParam.ntransactionsamplecode,
                userinfo: deleteParam.userInfo
            },
            classUrl: "comments",
            operation: 'delete',
            methodUrl: methodUrl,
            screenName: deleteParam.screenName
        }
        const masterData = deleteParam.masterData;
        if (showEsign(deleteParam.esignRights, deleteParam.userInfo.nformcode, deleteParam.ncontrolCode)) {
            // dispatch({
            //     type: DEFAULT_RETURN,
            //     payload: {
            //         loadEsign: true,
            //         screenData: { inputParam, masterData },
            //         openCommentModal: true,
            //         screenName: deleteParam.screenName,
            //         operation: 'delete',
            //         selectedRecord: {}
            //     }
            // });
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {   
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    openCommentModal: true,
                    screenName: deleteParam.screenName,
                    operation: 'delete',
                    selectedRecord: {}}
            }
            dispatch(updateStore(updateInfo));
        } else {
            dispatch(crudMaster(inputParam, masterData, "openCommentModal", {}));
        }
    }
}