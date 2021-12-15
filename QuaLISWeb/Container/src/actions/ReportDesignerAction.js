import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import {sortData, getComboLabelValue, constructOptionList} from '../components/CommonScript';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import {transactionStatus, reportTypeEnum} from '../components/Enumeration';

export function getReportMasterComboService(inputParam){ 
    return function (dispatch) {    
        // if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.detailtoedit.ntransactionstatus !== transactionStatus.APPROVED))
        // {      
            dispatch(initRequest(true));
            let nreportcode = null;
            if (inputParam.operation === "update"){
                nreportcode = inputParam.mastertoedit[inputParam.primaryKeyName];
            }
            return  rsapi.post("reportconfig/getReportMasterComboData",{nreportcode, 
                                                                        userinfo:inputParam.userInfo,
                                                                        filterreporttype : inputParam.filterReportType})
            .then(response=>{ 

                const reportTypeMap = constructOptionList(response.data["ReportType"] || [], "nreporttypecode",
                                    "sdisplayname", undefined, undefined, true);
                const reportModuleMap  = constructOptionList(response.data["ReportModule"] ||[], "nreportmodulecode",
                                    "sdisplayname" , undefined, undefined, true);
                const reportSubTypeMap  = constructOptionList(response.data["COAReportType"] ||[], "ncoareporttypecode",
                                    "scoareporttypename" , undefined, undefined, true);               
                const regTypeMap  = constructOptionList(response.data["RegistrationType"] ||[], "nregtypecode",
                                    "sregtypename" , undefined, undefined, true);
                const regSubTypeMap  = constructOptionList(response.data["RegistrationSubType"] ||[], "nregsubtypecode",
                                    "sregsubtypename" , undefined, undefined, true);
                const sectionMap  = constructOptionList(response.data["SectionList"] ||[], "nsectioncode",
                                    "ssectionname", undefined, undefined, true);
                const decisionTypeMap  = constructOptionList(response.data["ReportDecisionType"] ||[], "nreportdecisiontypecode",
                                    "sdecisiontypename" , undefined, undefined, true);                             
                const certificateTypeMap  = constructOptionList(response.data["CertificateType"] ||[], "ncertificatetypecode",
                                    "scertificatetype" , undefined, undefined, true);
                const controlScreenTypeMap  = constructOptionList(response.data["ControlScreen"] ||[], "nformcode",
                                    "sdisplaynames" , undefined, undefined, true);

                const  reportTypeList  = reportTypeMap.get("OptionList");
                const  reportModuleList = reportModuleMap.get("OptionList");
                const  reportSubTypeList = reportSubTypeMap.get("OptionList");
                const  regTypeList = regTypeMap.get("OptionList");                                                       
                const  regSubTypeList = regSubTypeMap.get("OptionList");
                const  sectionList = sectionMap.get("OptionList"); 
                const  decisionTypeList = decisionTypeMap.get("OptionList"); 
                const  certificateTypeList = certificateTypeMap.get("OptionList");     
                const  controlScreenTypeList = controlScreenTypeMap.get("OptionList");                              
                             
                let selectedRecord =  {ntransactionstatus:transactionStatus.ACTIVE};
                let respObject = {"reportVersionStatus" :transactionStatus.DRAFT};
                    
                if (inputParam.operation === "update"){
                    if (response.status === 202){
                        respObject["reportVersionStatus"] = transactionStatus.APPROVED;
                        respObject["ApprovedReportMaster"] = response.data["SelectedReportDesigner"];
                    }     
                    selectedRecord = JSON.parse(JSON.stringify(response.data["SelectedReportDesigner"]));
                    if (selectedRecord.nreporttypecode === reportTypeEnum.SAMPLE
                         || selectedRecord.nreporttypecode === reportTypeEnum.COA) 
                    {
                        selectedRecord["nregtypecode"] ={value:response.data["SelectedReportDesigner"].nregtypecode,
                                                            label:response.data["SelectedReportDesigner"].sregtypename};
                        if (response.data["SelectedReportDesigner"].nregsubtypecode !== -1)
                        {
                            selectedRecord["nregsubtypecode"] = {value : response.data["SelectedReportDesigner"].nregsubtypecode,
                                                                label: response.data["SelectedReportDesigner"].sregsubtypename}; 
                        }
                        else{
                            selectedRecord["nregsubtypecode"] = undefined;
                        }

                        if (response.data["SelectedReportDesigner"].nsectioncode !== -1)
                        {
                            selectedRecord["nsectioncode"] = {value : response.data["SelectedReportDesigner"].nsectioncode,
                                                                label: response.data["SelectedReportDesigner"].ssectionname}; 
                        }
                        else{
                            selectedRecord["nsectioncode"] = undefined;
                         }

                        if (response.data["SelectedReportDesigner"].ncoareporttypecode !== -1)
                        {
                             selectedRecord["ncoareporttypecode"] = {value : response.data["SelectedReportDesigner"].ncoareporttypecode,
                                                                 label: response.data["SelectedReportDesigner"].scoareporttypename}; 
                        }
                        else{
                             selectedRecord["ncoareporttypecode"] = undefined;
                        }

                        if (selectedRecord.nreporttypecode === reportTypeEnum.SAMPLE){
                            selectedRecord["nreportdecisiontypecode"] = {value : response.data["SelectedReportDesigner"].nreportdecisiontypecode,
                                                                        label: response.data["SelectedReportDesigner"].sdecisiontypename};  
                        }
                      
                    }   
                    else  if (selectedRecord.nreporttypecode === reportTypeEnum.MIS) 
                    {
                        selectedRecord["nreportmodulecode"] = {value : response.data["SelectedReportDesigner"].nreportmodulecode,
                                                               label: response.data["SelectedReportDesigner"].smoduledisplayname,
                                                           
                                                            } ;

                        selectedRecord["nreportmodule"] = {value : response.data["SelectedReportDesigner"].smoduledisplayname,
                                                            label: response.data["SelectedReportDesigner"].smoduledisplayname}
                     
                    } 
                       
                    else  if (selectedRecord.nreporttypecode === reportTypeEnum.SCREENWISE) 
                    {
                        selectedRecord["ncontrolcode"] = {value : response.data["SelectedReportDesigner"].ncontrolcode,
                                                                  label: response.data["SelectedReportDesigner"].scontrolids};  

                        selectedRecord["nformcode"] = {value : response.data["SelectedReportDesigner"].nformcode,
                                                                  label: response.data["SelectedReportDesigner"].sdisplayname};  
                    }

                   if (selectedRecord.nreporttypecode === reportTypeEnum.SAMPLE
                        || selectedRecord.nreporttypecode === reportTypeEnum.BATCH) 
                    {
                        if (response.data["SelectedReportDesigner"].ncoareporttypecode !== -1)
                        {
                             selectedRecord["ncoareporttypecode"] = {value : response.data["SelectedReportDesigner"].ncoareporttypecode,
                                                                 label: response.data["SelectedReportDesigner"].scoareporttypename}; 
                        }
                        else{
                             selectedRecord["ncoareporttypecode"] = undefined;
                        }
                        selectedRecord["ncertificatetypecode"] = {value : response.data["SelectedReportDesigner"].ncertificatetypecode,
                                                                    label: response.data["SelectedReportDesigner"].scertificatetype};  

                        selectedRecord["sbatchtypename"] = response.data["SelectedReportDesigner"].sbatchtypename
                    }

                    selectedRecord["ntransactionstatus"] = response.data["SelectedReportDesigner"].ntransactionstatus;

                    selectedRecord["nreporttypecode"] ={item:response.data["SelectedReportDesigner"],
                                                        value:response.data["SelectedReportDesigner"].nreporttypecode,
                                                        label:response.data["SelectedReportDesigner"].sreportdisplayname};
                             
                }
                                   
                respObject = { ...respObject, reportSubTypeList,//:response.data["COAReportType"]  || [], 
                                    regTypeList,//:response.data["RegistrationType"]  || [],                                                               
                                    regSubTypeList,//:response.data["RegistrationSubType"]  || [],  
                                    sectionList,//:response.data["SectionList"] || [],   
                                    certificateTypeList,  
                                    reportDecisionTypeList:decisionTypeList,
                                    controlScreen:controlScreenTypeList  ,
                                    //masterData:{...inputParam.masterData, SelectedFilterReportType:response.data["SelectedReportType"] }                                                             
                                };                  

                if (inputParam.operation === "create")
                {
                    selectedRecord["nreporttypecode"] = {item:response.data["SelectedReportType"],label:response.data["SelectedReportType"].sdisplayname,
                                                         value: response.data["SelectedReportType"].nreporttypecode}
                   
                    if (selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE
                        &&  selectedRecord["nreporttypecode"]['item'].isneedregtype === transactionStatus.YES){
                        selectedRecord["nregtypecode"] =  getComboLabelValue (response.data["SelectedRegType"], 
                                                                response.data["RegistrationType"], "nregtypecode", "sregtypename")                 
                        
                        if (selectedRecord["nreporttypecode"]['item'].isneedsection === transactionStatus.YES){
                            selectedRecord["nsectioncode"] = sectionMap.get("DefaultValue");
                        }
                    }
                }
                dispatch({type: DEFAULT_RETURN, payload:{reportTypeList,//:response.data["ReportType"] || [], 
                                                        reportModuleList,//:response.data["ReportModule"] || [] ,
                                                        ...respObject,
                                                        operation:inputParam.operation, 
                                                        screenName:inputParam.screenName,   
                                                        selectedRecord, 
                                                        openModal : true,
                                                        ncontrolCode:inputParam.ncontrolcode,
                                                        loading:false
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
            // }
            // else{       
            //     toast.warn(intl.formatMessage({id: "IDS_CANNOTUPDATEAPPROVEDREPORT"}));
            // }
   
}}

export function getReportDetailComboService(inputParam){ 
    return function (dispatch) {    
    if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.detailtoedit.ntransactionstatus === transactionStatus.DRAFT))
    {       
        if (inputParam.masterData.SelectedReportMaster !== null){  
                dispatch(initRequest(true));
                let nreportdetailcode = null;
                if (inputParam.operation === "update"){
                    nreportdetailcode = inputParam.detailtoedit[inputParam.primaryKeyName];
                }
                return  rsapi.post("reportconfig/getReportDetailComboData",{nreportdetailcode, 
                                                        reportmaster:inputParam.masterData.SelectedReportMaster, 
                                                        userinfo:inputParam.userInfo})
                .then(response=>{                                  
                    
                    // const reportType = response.data["SelectedReportType"];
                    // const reportSubTypeMap  = constructOptionList(response.data["COAReportType"] ||[], "ncoareporttypecode",
                    //                             "scoareporttypename" , undefined, undefined, true);    
                    // const sectionMap  = constructOptionList(response.data["SectionList"] ||[], "nsectioncode",
                    //                             "ssectionname", undefined, undefined, true);

                    // const decisionTypeMap  = constructOptionList(response.data["ReportDecisionType"] ||[], "nreportdecisiontypecode",
                    //                             "sdecisiontypename" , undefined, undefined, true);   
                                                
                    // const certificateTypeMap  = constructOptionList(response.data["CertificateType"] ||[], "ncertificatetypecode",
                    //                             "scertificatetype" , undefined, undefined, true);
                    
                    // const  reportSubTypeList = reportSubTypeMap.get("OptionList");
                    // const  sectionList = sectionMap.get("OptionList"); 
                    // const  decisionTypeList = decisionTypeMap.get("OptionList");
                    // const  certificateTypeList = certificateTypeMap.get("OptionList");  
                        
                    let selectedRecord =  {};
                    let respObject = {};
                    if (inputParam.operation === "update"){
                        selectedRecord = response.data["SelectedReportDetail"];
                
                    }                        
                    selectedRecord["ntransactionstatus"]  = transactionStatus.DRAFT; 
                        
                    //    console.log("selected in action:", selectedRecord);
                    dispatch({type: DEFAULT_RETURN, payload:{...respObject,
                                                                operation:inputParam.operation, 
                                                                screenName:inputParam.screenName,   
                                                                selectedRecord, 
                                                                openModal : true,
                                                                ncontrolCode:inputParam.ncontrolcode,
                                                                loading:false
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
            else{
                toast.warn(intl.formatMessage({id: "IDS_REPORTNOTFOUND"}));
            }
    }
    else{       
        toast.warn(intl.formatMessage({id: "IDS_CANNOTEDITAPPROVEDREPORT"}));
    }
}}

export function getSelectedReportMasterDetail (inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportconfig/getReportDesigner", {nreportcode:parseInt(inputParam.nreportcode), 
            userinfo:inputParam.userInfo})
   .then(response=>{      

        const masterData = {...inputParam.masterData, ...response.data}; 
     
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

export function getSelectedReportDetail (inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportconfig/getReportDetail", {nreportdetailcode:parseInt(inputParam.nreportdetailcode), 
            userinfo:inputParam.userInfo})
   .then(response=>{      

        const masterData = {...inputParam.masterData, ...response.data}; 
     
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

export function getConfigReportComboService (inputParam) {
    return function (dispatch) {   
        
    if (inputParam.reportMaster.nreporttypecode ===  reportTypeEnum.MIS)
    {
        if (inputParam.reportDetail.ntransactionstatus === transactionStatus.DRAFT){
                dispatch(initRequest(true));
                return rsapi.post("reportconfig/getReportAddDesignComboData", {nreportdetailcode:parseInt(inputParam.reportDetail.nreportdetailcode),
                                            userinfo:inputParam.userInfo})
                .then(response=>{     
                    
                    const parameterMap  = constructOptionList(response.data["ReportParameter"] ||[], "nreportparametercode",
                                        "sreportparametername", undefined, undefined, true);     

                    const  reportParameterList  = parameterMap.get("OptionList");

                    const designComponentMap  = constructOptionList(response.data["DesignComponents"] ||[], "ndesigncomponentcode",
                                        "sdesigncomponentname", undefined, undefined, true);     

                    const  designComponentList  = designComponentMap.get("OptionList");

                    const sqlQueryMap  = constructOptionList(response.data["SQLQuery"] ||[], "nsqlquerycode",
                                        "ssqlqueryname", undefined, undefined, true);     

                    const  sqlQueryList  = sqlQueryMap.get("OptionList");

                    dispatch({type: DEFAULT_RETURN, payload:{reportParameterList,//:response.data["ReportParameter"] || [], 
                                                            designComponentList,//:response.data["DesignComponents"] || [],
                                                            sqlQueryList,//:response.data["SQLQuery"] || [], 
                                                            operation:inputParam.operation, 
                                                            screenName:inputParam.screenName,   
                                                            //selectedRecord:{nmandatory:transactionStatus.YES}, 
                                                            selectedRecord:{},
                                                            openModal : true,
                                                            ncontrolCode:inputParam.ncontrolCode,
                                                            loading:false
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
        else{
            toast.warn(intl.formatMessage({id:"IDS_CANNOTCONFIGUREAPPROVEDREPORT"}))
        }
    }
    else{
        toast.warn(intl.formatMessage({id:"IDS_CANCONFIGUREMISREPORT"}))
    }
}}

export function getParameterMappingComboService (inputParam) {
    return function (dispatch) {   
        
        if (inputParam.reportMaster.nreporttypecode ===  reportTypeEnum.MIS)
        {
            if (inputParam.reportDetail.ntransactionstatus === transactionStatus.DRAFT){
                    dispatch(initRequest(true));
                    return rsapi.post("reportconfig/getReportParameterMappingComboData", {nreportdetailcode:parseInt(inputParam.reportDetail.nreportdetailcode),
                                                userinfo:inputParam.userInfo})
                .then(response=>{  
                    if (response.data["ChildComponentList"].length > 0){    

                            const parentComponentMap  = constructOptionList(response.data["ParentComponentList"] ||[], "nreportdesigncode",
                                                "sdisplayname", undefined, undefined, true);    
                            const parentComponentList  = parentComponentMap.get("OptionList");

                            const childComponentMap  = constructOptionList(response.data["ChildComponentList"] ||[], "nreportdesigncode",
                                                        "sdisplayname", undefined, undefined, true);    
                            const childComponentList  = childComponentMap.get("OptionList");

                            dispatch({type: DEFAULT_RETURN, payload:{parentComponentList,//:response.data["ParentComponenList"] || [],
                                                                    childComponentList,//:response.data["ChildComponentList"] || [], 
                                                                    operation:inputParam.operation, 
                                                                    screenName:inputParam.screenName,   
                                                                    selectedRecord:{}, 
                                                                    openModal : true,
                                                                    ncontrolCode:inputParam.ncontrolCode,
                                                                    loading:false
                                                                    }}); 
                    }
                    else{
                        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
                        toast.warn(intl.formatMessage({id:"IDS_NOPARAMETERSTOMAP"}))
                    }
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
            else{
                toast.warn(intl.formatMessage({id:"IDS_CANNOTMAPAPPROVEDREPORT"}))
            }
        }
        else{
            toast.warn(intl.formatMessage({id:"IDS_CANMAPMISREPORT"}))
        }
}}

export function viewReportDetail(reportmaster, userInfo, masterData) {
    return function (dispatch) {   
        if (reportmaster !== undefined)
        {
            dispatch(initRequest(true));
            return rsapi.post("reportview/viewReport", {reportmaster, userinfo:userInfo})
            .then(response=>{ 
               // console.log("report action:", response);
                masterData = {...masterData, ...response.data};

                if (response.data["ViewReportDesignConfig"] !== undefined ){
                    masterData["ReportPDFFile"] = undefined;
                }
                else{
                    document.getElementById("download_data").setAttribute("href", masterData["ReportPDFFile"]);
                    document.getElementById("download_data").click();
                }
            
                dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false}});   
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
        else{
            toast.warn(intl.formatMessage({id:"IDS_REPORTNOTFOUND"}))
        }
}}

// export function getActionMappingComboService(inputParam) {
//     return function (dispatch) {   
        
//     if (inputParam.reportDetail.ntransactionstatus === transactionStatus.DRAFT){
//             dispatch(initRequest(true));
//             return rsapi.post("reportconfig/getActionMappingComboData", {nreportdetailcode:parseInt(inputParam.reportDetail.nreportdetailcode),
//                                         userinfo:inputParam.userInfo})
//         .then(response=>{ 
//             if (response.data["ActionMappingChild"].length > 0)
//             {     
//                     dispatch({type: DEFAULT_RETURN, payload:{actionMappingParentList:response.data["ActionMappingParent"] || [],
//                                                             actionMappingChildList:response.data["ActionMappingChild"] || [], 
//                                                             operation:inputParam.operation, 
//                                                             screenName:inputParam.screenName,   
//                                                             selectedRecord:{}, 
//                                                             openModal : true,
//                                                             ncontrolCode:inputParam.ncontrolCode,
//                                                             loading:false
//                                                             }}); 
//             }
//             else{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//                 toast.warn(intl.formatMessage({id:"IDS_NOACTIONSTOMAP"}))
//             }
//         })
//         .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//             if (error.response.status === 500){
//                 toast.error(error.message);
//             } 
//             else{               
//                 toast.warn(error.response.data);
//             }  
        
//         })
//     }
//     else{
//         toast.warn(intl.formatMessage({id:"IDS_CANNOTACTIONMAPAPPROVEDREPORT"}))
//     }
// }}

export function getReportViewChildDataList(inputParam) {
    return function (dispatch) {   
       // dispatch(initRequest(true));
        return rsapi.post("reportview/getChildDataList", {...inputParam["inputData"]})
       .then(response=>{     
            const controlList = inputParam.viewReportDesignConfigList;

            const selectedRecord = inputParam.selectedRecord;
          
            Object.keys(response.data).map(displayName=>{
                const index = controlList.findIndex(item=> displayName === item.sdisplayname);   
           
                    const comboMap = constructOptionList(response.data[displayName] || [], controlList[index].svaluemember,
                                    controlList[index].sdisplaymember, undefined, undefined, true);

                    const comboList = comboMap.get("OptionList");
                    selectedRecord[controlList[index].svaluemember] = undefined;
                        
                return controlList[index]["dataList"] = comboList;//response.data[displayName]
            })
            dispatch({type: DEFAULT_RETURN, payload:{viewReportDesignConfigList:controlList, 
                                                     loading:false,
                                                     inputFieldData : inputParam.inputData.inputfielddata, 
                                                     selectedRecord}});   
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

export function viewReportDetailWithParameters(viewReportParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportview/viewReportWithParameters", {...viewReportParam})
   .then(response=>{     
        const masterData = {...viewReportParam.masterData,  
                            ReportPDFFile:response.data["ReportPDFFile"],
                            SelectedReportDetails:response.data["SelectedReportDetails"],
                            ReportPDFPath:response.data["ReportPDFPath"],
                            ViewReportDesignConfig :undefined} ;
              
        dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false, //openModal:false
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
}}

export function getReportsByModule(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportview/getReportView", {nreportmodulecode:inputParam.nreportmodulecode, 
            userinfo:inputParam.userInfo})
   .then(response=>{      

        const masterData = {...inputParam.masterData, ...response.data}; 

        // const  reportModuleMap  = constructOptionList(masterData.ViewReportModuleList ||[], "nreportmodulecode",
        //                          "smoduledisplayname" , undefined, undefined, true);
        // const  reportModuleList  = reportModuleMap.get("OptionList");
     
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, //viewReportModuleList:reportModuleList,
                                                operation:null, modalName:undefined, 
                                                loading:false, selectedRecord: inputParam.selectedRecord}});   
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


export function getControlButton(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportconfig/getControlButton", {nformcode:inputParam.ControlScreen.nformcode, 
            userinfo:inputParam.userInfo})
   .then(response=>{     
       
        const controlButtonMap  = constructOptionList(response.data ||[], "ncontrolcode",
                                "scontrolids" , undefined, undefined, true);
        const  controlButtonList = controlButtonMap.get("OptionList");
        dispatch({type: DEFAULT_RETURN, payload:{controlButton:controlButtonList,//: response.data,                                            
                                                loading:false, 
                                                selectedRecord: {...inputParam.selectedRecord, 
                                                                 nregsubtypecode :undefined
                                                                    //nregsubtypecode:{label:"Please Select...", value:-4}
                                                                }
                                                }
                                            });   
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

export function getReportRegSubType(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportconfig/getReportRegistrationSubType", {nregtypecode:inputParam.registrationType.nregtypecode, 
            userinfo:inputParam.userInfo})
   .then(response=>{     
       
        const regSubTypeMap  = constructOptionList(response.data ||[], "nregsubtypecode",
                                "sregsubtypename" , undefined, undefined, true);
        const  regSubTypeList = regSubTypeMap.get("OptionList");
        dispatch({type: DEFAULT_RETURN, payload:{regSubTypeList,//: response.data,                                            
                                                loading:false, 
                                                selectedRecord: {...inputParam.selectedRecord, 
                                                                 nregsubtypecode :undefined
                                                                    //nregsubtypecode:{label:"Please Select...", value:-4}
                                                                }
                                                }
                                            });   
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

export function getReportSubType(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportconfig/getReportSubType", {nreporttypecode:inputParam.reportType.nreporttypecode, 
            userinfo:inputParam.userInfo
        })
   .then(response=>{     
       
        const reportSubTypeMap  = constructOptionList(response.data.CoaReportType ||[], "ncoareporttypecode",
                                 "scoareporttypename" , undefined, undefined, true);   
        const  reportSubTypeList = reportSubTypeMap.get("OptionList");

        const certificateTypeMap  = constructOptionList(response.data.CertificateType ||[], "ncertificatetypecode",
        "scertificatetype" , undefined, undefined, true);   
        const  certificateTypeList = certificateTypeMap.get("OptionList");
        dispatch({type: DEFAULT_RETURN, payload:{reportSubTypeList,  
                                                 certificateTypeList,                                         
                                                loading:false, 
                                                selectedRecord: {...inputParam.selectedRecord, 
                                                    ncoareporttypecode:undefined,
                                                    ncertificatetypecode:""
                                                   // ncoareporttypecode:{label:"Please Select...", value:-4}
                                                                }
                                                }
                                            });   
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

export function getregtype(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("reportconfig/getRegistrationtypeForSample", {nregtypecode:inputParam.nregtypecode,nreporttypecode:inputParam.reportType.nreporttypecode,
            userinfo:inputParam.userInfo
        })
   .then(response=>{    
        
        // const reportRegTypeMap  = constructOptionList(response.data.Regtype ||[], "nregtypecode",
        //                          "sregtypename" , undefined, undefined, true);   
        // const  reportRegTypeList = reportRegTypeMap.get("OptionList");

        // // const reportRegSubTypeMap  = constructOptionList(response.data.RegSubtype ||[], "nregsubtypecode",
        // // "sregsubtypename" , undefined, undefined, true);   
        // //   const  reportRegSubTypeList = reportRegSubTypeMap.get("OptionList");

        const regTypeMap  = constructOptionList(response.data["RegistrationType"] ||[], "nregtypecode",
                             "sregtypename" , undefined, undefined, true);
        const  regTypeList = regTypeMap.get("OptionList");  

        const regSubTypeMap  = constructOptionList(response.data["RegistrationSubType"] ||[], "nregsubtypecode",
                                "sregsubtypename" , undefined, undefined, true);
        const  regSubTypeList = regSubTypeMap.get("OptionList");

        const coaReportTypeMap  = constructOptionList(response.data.COAReportType ||[], "ncoareporttypecode",
                                  "scoareporttypename" , undefined, undefined, true);   
        const  reportSubTypeList = coaReportTypeMap.get("OptionList");

        const certificateType  = constructOptionList(response.data.CertificateType ||[], "ncertificatetypecode",
                                    "scertificatetype" , undefined, undefined, true);   
        const  certificateTypeList = certificateType.get("OptionList");                   
        

        const nregtypecode =  getComboLabelValue (response.data["SelectedRegType"], 
                                            response.data["RegistrationType"], "nregtypecode", "sregtypename")                 


        dispatch({type: DEFAULT_RETURN, payload:{ 
                                                regTypeList,
                                                regSubTypeList,
                                                reportSubTypeList,
                                                loading:false, 
                                                certificateTypeList,
                                                selectedRecord: {...inputParam.selectedRecord, 
                                                                nregtypecode:nregtypecode, nregsubtypecode:undefined,
                                                                ncoareporttypecode:undefined,
                                                                ncertificatetypecode:""
                                                                }
                                                }
                                            });   
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