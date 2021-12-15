import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import { toast } from 'react-toastify';
//import Axios from 'axios';
import { initRequest } from './LoginAction';
import {sortData} from '../components/CommonScript';//, constructOptionList
import { intl } from '../components/App';



export function getAuditTrailDetail(inputData) {
    return function (dispatch) {  
        let inputParamData = {
            userinfo:inputData.userinfo,
            fromDate: inputData.fromDate,
            toDate: inputData.toDate,
            modulecode: inputData.moduleCode,
            formcode: inputData.formCode,
            usercode: inputData.userCode,
            userrole: inputData.userRole,
            viewtypecode: inputData.viewTypeCode,
            saudittraildate: inputData.saudittraildate
        } 
    dispatch(initRequest(true)); 
    return rsapi.post("audittrail/getAuditTrailDetail", inputParamData)
   .then(response=>{ 
      console.log(new Date());
        let masterData = {...inputData.masterData, ...response.data};        
      //  sortData(masterData);     
        dispatch({type: DEFAULT_RETURN, payload:{masterData,  
             loading:false,skip:inputData.skip,take:inputData.take}});   
   })
   .catch(error=>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
       if (error.response.status === 500){
           toast.error(intl.formatMessage({id: error.message}));
       } 
       else{               
           toast.warn(intl.formatMessage({id: error.response.data}));
       }  
  
   })
}}

export function getFilterAuditTrailRecords(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("audittrail/getFilterAuditTrailRecords", { ...inputData.inputData })
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data,
                    ViewType:inputData.masterData.breadCrumbViewType.item
                }
                // sortData(masterData);
                // dispatch({
                //     type: DEFAULT_RETURN, payload: {
                //         masterData,
                //         loading: false,
                //         showFilter: false
                //     }
                // })
                if(inputData.searchRef!==undefined && inputData.searchRef.current!==null){
                    inputData.searchRef.current.value = "";
                    masterData['searchedAudit']=undefined;
                }
                let resetDataGridPage = false;
                if(masterData.AuditDetails&&masterData.AuditDetails.length<inputData.detailSkip){
                    resetDataGridPage=true
                }else{
                    resetDataGridPage = false
                }
                let respObject = {
                    
                    masterData,
                    loading: false,
                    showFilter: false,
                    resetDataGridPage
                }
                // dispatch(postCRUDOrganiseTransSearch(inputData.inputData.postParamList, respObject))
                dispatch({ type: DEFAULT_RETURN, payload: { ...respObject ,skip:0,take:20} })

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

export function getFormNameByModule(inputData,selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("audittrail/getFormNameByModule", { ...inputData.inputData})
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        selectedRecord,
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

export function getExportExcel(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("audittrail/getexportdata", { ...inputData.inputData})
            .then(response => {
                
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        resultStatus: response.data["ExportExcel"] || '',
                        loading: false,
                        
                    }
                })
                if(response.data["ExportExcel"] === "Success")
                {
                    document.getElementById("download_data").setAttribute("href", response.data["ExportExcelPath"]);
                    document.getElementById("download_data").click();
                }
                else
                {
                    toast.warn(response.data["ExportExcel"]);
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