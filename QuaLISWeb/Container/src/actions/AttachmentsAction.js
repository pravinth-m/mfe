import rsapi from "../rsapi";
import { toast } from "react-toastify";
import { DEFAULT_RETURN } from "./LoginTypes";
import Axios from "axios";
import { initRequest, updateStore } from "./LoginAction";
import { transactionStatus, attachmentType } from "../components/Enumeration";
import { constructOptionList, showEsign } from "../components/CommonScript";
import { crudMaster } from './ServiceAction'
import { intl } from "../components/App";

export function getAttachmentCombo(inputParam) {
    return (dispatch) => {
        let valid = false;
        if (inputParam.masterList){
            if (Array.isArray(inputParam.masterList)){
                if (inputParam.masterList.length > 0){
                    valid = true;
                }
            }
            else{
                valid = true;
            }
        }
        
        //if (inputParam.masterList && inputParam.masterList.length > 0) {
        if (valid){
            dispatch(initRequest(true));
            let urlArray = [rsapi.post("/linkmaster/getLinkMaster", { userinfo: inputParam.userInfo })];
            if (inputParam.operation === "update") {
                urlArray.push(rsapi.post("/attachment/getEdit".concat(inputParam.methodUrl), { userinfo: inputParam.userInfo, selectedrecord: inputParam.selectedRecord }))
            }
            Axios.all(urlArray)
                .then(response => {
                    let linkmaster = response[0].data.LinkMaster;
                    let selectedRecord = {};
                    const defaultLink = linkmaster.filter(item => item.ndefaultlink === transactionStatus.YES);
                    const linkmasterMap  = constructOptionList(linkmaster || [], "nattachmenttypecode","slinkname" , undefined, undefined, true);
                    linkmaster = linkmasterMap.get("OptionList");
                    let disabled = false;
                    let editObject = {};
                    if (inputParam.operation === "update") {
                        editObject = response[1].data;
                        let nlinkcode = {};
                        let link = {};
                        if (editObject.nattachmenttypecode === attachmentType.LINK) {
                            nlinkcode = { "label": editObject.slinkname,
                             "value": editObject.nlinkcode }
                             link = {
                                slinkfilename:editObject.sfilename,
                                slinkdescription:editObject.sdescription,
                                sfilesize:'',
                                nfilesize:0,
                                sfilename:'',
                                sdescription:'',
                            }
                        } else {
                            nlinkcode = defaultLink.length > 0 ?
                             { "label": defaultLink[0].slinkname, 
                             "value": defaultLink[0].nlinkcode } : ""

                             link = {
                                slinkfilename:'',
                                slinkdescription:'',
                                sfilesize:editObject.sfilesize,
                                nfilesize:editObject.nfilesize,
                                sfilename:editObject.sfilename,
                                sdescription:editObject.sdescription,
                            }
                        }
                        selectedRecord = {
                        // ...editObject,
                        ...link,
                           dcreateddate:editObject.dcreateddate,
                           groupingField:editObject.groupingField,
                           nattachmenttypecode:editObject.nattachmenttypecode,
                           nformcode:editObject.nformcode,
                           npreregno:editObject.npreregno,
                           nregattachmentcode:editObject.nregattachmentcode,
                           nuserrolecode:editObject.nuserrolecode,
                           sarno:editObject.sarno,
                           screateddate:editObject.screateddate,
                           sdisplayname:editObject.sdisplayname,
                           ssystemfilename:editObject.ssystemfilename,
                           stypename:editObject.stypename,
                           susername:editObject.susername,
                           suserrolename:editObject.suserrolename,
                           nusercode:editObject.nusercode,
                           ntestattachmentcode:editObject.ntestattachmentcode,
                           ntransactionsamplecode:editObject.ntransactionsamplecode,
                           ntransactiontestcode:editObject.ntransactiontestcode,
                           nbatchfilecode:editObject.nbatchfilecode,
                           nreleasebatchcode:editObject.nreleasebatchcode,
                           nlinkcode,
                             // disabled: true
                        };
                    } else {
                        selectedRecord = {
                            nattachmenttypecode:response[0].data.AttachmentType.length>0?
                            response[0].data.AttachmentType[0].nattachmenttypecode:attachmentType.FTP,
                            nlinkcode: defaultLink.length > 0 ? { "label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode } : "",
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
                            selectedRecord, loading: false,
                            linkMaster: linkmaster,
                            modalType: 'attachment',
                            modalName: [inputParam.modalName],
                            editFiles: editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {}
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
            toast.warn(intl.formatMessage({ id: inputParam.masterAlertStatus }))
        }
    }
}

export function deleteAttachment(deleteParam) {
    return (dispatch) => {
        const methodUrl = deleteParam.methodUrl;
        const selected = deleteParam.selectedRecord;

         const data=deleteParam.data;
         let attachmentskip=deleteParam.skip;
         let attachmenttake=deleteParam.take;
         if(data.length===1){
              if(attachmentskip>attachmenttake){
                attachmentskip=attachmentskip-attachmenttake;
              }
             else if(attachmentskip>=attachmenttake){
                attachmentskip=0;
              }
         }

        const inputParam = {
            inputData: {
                [methodUrl.toLowerCase()]: selected,
                nreleasebatchcode:deleteParam.nreleasebatchcode,
                npreregno: deleteParam.npreregno,
                ntransactiontestcode: deleteParam.ntransactiontestcode,
                ntransactionsamplecode: deleteParam.ntransactionsamplecode,
                userinfo: deleteParam.userInfo,
                attachmentskip,
                attachmenttake,
    
            },
            classUrl: "attachment",
            operation: 'delete',
            methodUrl: methodUrl,
            screenName: deleteParam.screenName,
            attachmentskip,
            attachmenttake,

        }
        const masterData = deleteParam.masterData;
        if (showEsign(deleteParam.esignRights, deleteParam.userInfo.nformcode, deleteParam.ncontrolCode)) {
           
            // dispatch({
            //     type: DEFAULT_RETURN,
            //     payload: {
            //         loadEsign: true,
            //         screenData: { inputParam, masterData },
            //         openAttachmentModal: true,
            //         screenName: deleteParam.screenName,
            //         operation: 'delete',
            //         selectedRecord: {}
            //     }
            // });
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {   loadEsign: true,
                            screenData: { inputParam, masterData },
                            openAttachmentModal: true,
                            screenName: deleteParam.screenName,
                            operation: 'delete',
                            selectedRecord: {} }
            }
            dispatch(updateStore(updateInfo));
        } else {
            dispatch(crudMaster(inputParam, masterData, "openAttachmentModal", {}));
        }
    }
}