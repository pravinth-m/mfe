import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
     sortData
} from '../components/CommonScript'
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';


export function getEmailConfigDetail (emailconfig, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("emailconfig/getEmailConfig", {nemailconfigcode:emailconfig.nemailconfigcode, userinfo:userInfo})
   .then(response=>{     
        masterData = {...masterData, ...response.data};       
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false}});   
   })
   .catch(error=>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
       if (error.response.status === 500){
           toast.error(error.message);
       } 
       else{               
           toast.warn(error.response.data);
       }  
  
   })
}}


export function openEmailConfigModal(screenName, operation,userinfo, ncontrolcode) {
    return function (dispatch) {
        if (operation === "create" || operation === "update") {
            const emailConfig = rsapi.post("/emailconfig/getEmailConfigDetails", {
                "userinfo": userinfo
            });
            let urlArray = [];
            if (operation === "create") {

                urlArray = [emailConfig];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    selectedRecord["nemailconfigcode"] = 0;
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            EmailHost: response[0].data.EmailHost || [],
                            EmailTemplate: response[0].data.EmailTemplate|| [],
                            EmailScreen: response[0].data.EmailScreen|| [],
                            //ActionType: response[0].data.ActionType|| [],
                            users: response[0].data.users|| [],
                            FormName:response[0].data.FormName|| [],
                            FormControls:response[0].data.FormControls|| [],
                           // dataSource:response[0].data.dataSource||[],
                            operation,
                            screenName,
                            selectedRecord,
                            openModal: true,
                            ncontrolcode, loading: false
                        }
                    })
                })
                .catch(error => {
                    dispatch(initRequest(false));
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })
        }
    }
}

export function fetchEmailConfigById(editParam) {
    return function (dispatch) {
        const URL1 = rsapi.post('emailconfig/getActiveEmailConfigById', { [editParam.primaryKeyField]: editParam.SelectedEmailConfig.nemailconfigcode, 
            "userinfo": editParam.userInfo })
        dispatch(initRequest(true));
        Axios.all([URL1])
            .then(response => {
                let selectedRecord = {}
                let selectedId = editParam.primaryKeyValue;
                selectedRecord = response[0].data.EmailConfig
                selectedRecord['nemailtemplatecode']={value:response[0].data.EmailConfig.nemailtemplatecode,
                                                     label:response[0].data.EmailConfig.stemplatename}
                selectedRecord['nemailscreencode']={value:response[0].data.EmailConfig.nemailscreencode,
                                                    label:response[0].data.EmailConfig.sscreenname, 
                                                    item:{nemailscreencode:response[0].data.EmailConfig.nemailscreencode,
                                                          sscreenname:response[0].data.EmailConfig.sscreenname,
                                                          nformcode:response[0].data.EmailConfig.nformcode,
                                                          sformname:response[0].data.EmailConfig.sformname}
                                                }
                //selectedRecord['nactiontype']={value:response[0].data.EmailConfig.nactiontype,label:response[0].data.EmailConfig.stransdisplaystatus}
                selectedRecord['nemailhostcode']={value:response[0].data.EmailConfig.nemailhostcode,label:response[0].data.EmailConfig.shostname}
               // selectedRecord['nuserrolecode']={value:response[0].data.EmailConfig.nuserrole,label:response[0].data.EmailConfig.suserrolename}
                selectedRecord['nenableemail']=response[0].data.EmailConfig.nenableemail
                selectedRecord['nformcode']={value:response[0].data.EmailConfig.nformcode,label:response[0].data.EmailConfig.sformname}
                selectedRecord['ncontrolcode']={value:response[0].data.EmailConfig.ncontrolcode,label:response[0].data.EmailConfig.scontrolids}
                if (response[0].data.EmailConfig.nemailuserquerycode !== -1){
                    selectedRecord['nemailuserquerycode']={value:response[0].data.EmailConfig.nemailuserquerycode,label:response[0].data.EmailConfig.sdisplayname}
                }
               
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        EmailHost: response[0].data.EmailHost || [],
                        EmailTemplate: response[0].data.EmailTemplate|| [],
                        EmailScreen: response[0].data.EmailScreen|| [],
                        ActionType: response[0].data.ActionType|| [],
                        FormName:response[0].data.FormName|| [],
                        FormControls:response[0].data.FormControls|| [],
                        EmailUserQuery:response[0].data.EmailUserQuery|| [],
                        selectedRecord,
                        operation: editParam.operation,
                        openModal: true,
                        screenName: editParam.screenName,
                        ncontrolcode: editParam.ncontrolCode,
                        loading: false, selectedId
                    }
                });

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


export function getUserEmailConfig (screenName, operation, primaryKey, SelectedEmailConfig,masterData, userinfo, ncontrolcode) {            
    return function (dispatch) {  
    dispatch(initRequest(true));
    return rsapi.post("emailconfig/getUserEmailConfig", 
                                    {nemailconfigcode:SelectedEmailConfig.nemailconfigcode,
                                    userinfo:userinfo})
    .then(response=>{ 
        let selectedRecord = {};
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            users: response.data.users|| [],
                           // dataSource:response[0].data.dataSource||[],
                            operation,
                            screenName,
                            selectedRecord,
                            openModal: true,
                            ncontrolcode, loading: false
                    }});
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 500){
                toast.error(error.message);
            } 
            else{               
                toast.warn(error.response.data);
            }  
        })        
    }
}
export function getFormControls (selectedRecord,userInfo) {            
    return function (dispatch) {  
    dispatch(initRequest(true));
    return rsapi.post("emailconfig/getEmailConfigControl",
    {nformcode:selectedRecord.nemailscreencode.item.nformcode,userinfo:userInfo})
    .then(response=>{
        selectedRecord['ncontrolcode'] = undefined;
        selectedRecord['nemailuserquerycode'] = undefined;
        dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        FormControls: response.data.FormControls|| [],
                        EmailUserQuery: response.data.EmailUserQuery|| [],
                        // dataSource:response[0].data.dataSource||[],
                        //operation,
                        //screenName,
                        selectedRecord,
                        //openModal: true,
                        //ncontrolcode, 
                        loading: false
                }});
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 500){
                toast.error(error.message);
            } 
            else{               
                toast.warn(error.response.data);
            }  
        })        
    }
}