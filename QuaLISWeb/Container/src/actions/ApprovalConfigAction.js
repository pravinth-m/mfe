
import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import {constructOptionList, sortData} from '../components/CommonScript'
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { transactionStatus } from '../components/Enumeration';
import { intl } from "../components/App";


export function openModal(operation,napprovalconfigcode,napprovalsubtypecode, userInfo, ncontrolcode,ntreeversiontempcode){
    return function (dispatch) {  
        if(userInfo){
            const inputData={
                napprovalconfigcode:napprovalconfigcode,
                napprovalsubtypecode:napprovalsubtypecode,
                ntreeversiontempcode,
                userinfo:userInfo
            };
            dispatch(initRequest(true));
            rsapi.post("approvalconfig/getUserRoleApprovalConfig",inputData)
            .then(response=> { 
                const filterStatusOptionsMap = constructOptionList(response.data.availableFilterStatus || [], "ntranscode", "stransstatus", undefined, undefined, true);
                const validationStatusOptionsMap = constructOptionList(response.data.availableValidStatus || [], "ntranscode", "stransstatus", undefined, undefined, true);
                const approvalStatusOptionsMap = constructOptionList(response.data.approvalStatus || [], "ntranscode", "stransdisplaystatus", undefined, undefined, true);
                const decisionStatusOptionsMap = constructOptionList(response.data.availableDecisionStatus || [], "ntranscode", "stransstatus", undefined, undefined, true);
                const checklistOptionsMap = constructOptionList(response.data.checklist || [], "nchecklistcode", "schecklistname", undefined, undefined, true);
                const filterStatusOptions = filterStatusOptionsMap.get("OptionList");
                const validationStatusOptions = validationStatusOptionsMap.get("OptionList");
                const approvalStatusOptions = approvalStatusOptionsMap.get("OptionList");
                const decisionStatusOptions = decisionStatusOptionsMap.get("OptionList");
                const checklistOptions = checklistOptionsMap.get("OptionList");
                dispatch({type: DEFAULT_RETURN, payload:{
                    openModal:true,operation,userRoleTree:response.data.userroletree,
                                filterStatusOptions,
                                validationStatusOptions,
                                approvalStatusOptions,
                                decisionStatusOptions,
                                checklistOptions,
                                approvalStatusValue:response.data.AvailableDecisionStatus?response.data.AvailableDecisionStatus:[],
                                checklistValues:[],
                                checklistVersionValues:[],
                                actionStatus:response.data.actionStatus?response.data.actionStatus:[],
                                roleConfig:response.data.roleConfig?sortData(response.data.roleConfig,'ascending','nsorter'):[],
                                versionConfig:response.data.versionConfig?response.data.versionConfig:[],                                
                                ncontrolcode,loading:false
                                }});
                
            })
            .catch(error => {
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
    
}
export function getApprovalConfigVersion(version,napprovalsubtypecode,userInfo,masterData){
    return function (dispatch) {  
        const  inputData = {"napprovalconfigversioncode":version.napproveconfversioncode,
                            napprovalsubtypecode:napprovalsubtypecode,
                            userinfo:userInfo
                        }
        dispatch(initRequest(true));
        rsapi.post("approvalconfig/getApprovalConfigVersion",inputData)
        .then(response=> { 
            dispatch({type: DEFAULT_RETURN, payload:{
                masterData:{
                ...masterData,
                selectedVersion:response.data.selectedVersion,
                showAccordion:true,
                approvalconfigRoleNames:response.data.approvalconfigRoleNames,
                selectedRole:response.data.approvalconfigRoleNames?response.data.approvalconfigRoleNames.length>0?sortData(response.data.approvalconfigRoleNames,'ascending','nlevelno')[0]:{}:{},
                roleFilters:response.data.roleFilters,
                roleValidations:response.data.roleValidations,
                roleDecisions:response.data.roleDecisions,
                roleActions:response.data.roleActions,
                roleConfig:sortData(response.data.roleConfig,'ascending','nsorter'),
                versionConfig:response.data.versionConfig
                },loading:false  
            }}) 
        })
        .catch(error => {
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
export function getRoleDetails(inputData){
    return function (dispatch) {  
        let {role,masterData,napprovalsubtypecode,userinfo}=inputData
        let inputParamData={
            napprovalconfigrolecode:role.napprovalconfigrolecode,
            napprovalsubtypecode,
            userinfo
        }
        dispatch(initRequest(true));
        rsapi.post("approvalconfig/getApprovalConfigRoleDetails",inputParamData)
        .then(response=> { 
            dispatch({type: DEFAULT_RETURN, payload:{
                masterData:{
                    ...masterData,
                selectedRole:role,
                showAccordion:true,
                roleFilters:response.data.roleFilters,
                roleValidations:response.data.roleValidations,
                roleDecisions:response.data.roleDecisions,
                roleActions:response.data.roleActions,
                roleConfig:sortData(response.data.roleConfig,'ascending','nsorter'),
                versionConfig:response.data.versionConfig
                },loading:false  

                                    
            }}) 
        })
        .catch(error => {
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
export function getApprovalConfigEditData(napprovalconfigversioncode,napprovalsubtypecode,userInfo,masterData, ncontrolcode){
    return function (dispatch) { 
        if(masterData.selectedVersion["ntransactionstatus"]===transactionStatus.APPROVED || 
                 masterData.selectedVersion["ntransactionstatus"] === transactionStatus.RETIRED){
                    toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));
         }else{ 
           if(userInfo){
            const inputData={
                napprovalconfigversioncode:napprovalconfigversioncode,
                napprovalsubtypecode:napprovalsubtypecode,
                userinfo:userInfo
            }
            dispatch(initRequest(true));
            rsapi.post("approvalconfig/getApprovalConfigEditData",inputData)
            .then(response=> { 
                const filterStatusOptionsMap = constructOptionList(response.data.availableFilterStatus || [], "ntranscode", "stransstatus", undefined, undefined, true);
                const validationStatusOptionsMap = constructOptionList(response.data.availableValidStatus || [], "ntranscode", "stransstatus", undefined, undefined, true);
                const approvalStatusOptionsMap = constructOptionList(response.data.approvalStatus || [], "ntranscode", "stransdisplaystatus", undefined, undefined, true);
                const decisionStatusOptionsMap = constructOptionList(response.data.availableDecisionStatus || [], "ntranscode", "stransstatus", undefined, undefined, true);
                const checklistOptionsMap = constructOptionList(response.data.checklist || [], "nchecklistcode", "schecklistname", undefined, undefined, true);
                const filterStatusOptions = filterStatusOptionsMap.get("OptionList");
                const validationStatusOptions = validationStatusOptionsMap.get("OptionList");
                const approvalStatusOptions = approvalStatusOptionsMap.get("OptionList");
                const decisionStatusOptions = decisionStatusOptionsMap.get("OptionList");
                const checklistOptions = checklistOptionsMap.get("OptionList");
                let selectedRecord={}
                response.data.userroletree.map( role=>{
                    let filterStatus=[];
                    let validationStatus=[];
                    let decisionStatus=[];
                    let actionArray=[];
                    let filterStatusValues=[];
                    
                    response.data[`filterstatus_${role.nuserrolecode}`].map(data=>
                        {
                        filterStatusValues.push({value:data.ntranscode,label:data.stransstatus,item:data})
                        filterStatus.push(data.ntranscode)
                        return null;
                        }
                    )
                    let validationStatusValues=[];
                    response.data[`validationstatus_${role.nuserrolecode}`].map(data=>{
                        validationStatusValues.push({value:data.ntranscode,label:data.stransstatus,item:data})
                        validationStatus.push(data.ntranscode)
                        return null;
                    }
                        
                    )
                    let decisionStatusValues=[];
                    response.data[`decisionstatus_${role.nuserrolecode}`].map(data=>
                        {
                        decisionStatusValues.push({value:data.ntranscode,label:data.stransstatus,item:data});
                        decisionStatus.push(data.ntranscode);
                        return null;
                        }
                    )
                    let checklistValues=[];
                    response.data[`checklist_${role.nuserrolecode}`].map(data=>
                        checklistValues.push({value:data.nchecklistcode,label:data.schecklistname,item:data})
                        
                    )
                    let checklistVersionValues=[];
                    response.data[`checklist_${role.nuserrolecode}`].map(data=>
                        checklistVersionValues.push({value:data.nchecklistversioncode,label:data.schecklistversionname,item:data})
                        
                    )
                    let nrecomretestneed=response.data[`roledetails_${role.nuserrolecode}`][0].nrecomretestneed
                    let nrecomrecalcneed=response.data[`roledetails_${role.nuserrolecode}`][0].nrecomrecalcneed
                    let nretestneed=response.data[`roledetails_${role.nuserrolecode}`][0].nretestneed
                    let nrecalcneed=response.data[`roledetails_${role.nuserrolecode}`][0].nrecalcneed
                    let ncorrectionneed=response.data[`roledetails_${role.nuserrolecode}`][0].ncorrectionneed

                    nrecomretestneed===transactionStatus.YES?actionArray.push(transactionStatus.RECOMMENDRETEST):actionArray.push()
                    nrecomrecalcneed===transactionStatus.YES?actionArray.push(transactionStatus.RECOMMENDRECALC):actionArray.push()
                    nretestneed===transactionStatus.YES?actionArray.push(transactionStatus.RETEST):actionArray.push()
                    nrecalcneed===transactionStatus.YES?actionArray.push(transactionStatus.RECALC):actionArray.push()
                    ncorrectionneed===transactionStatus.YES?actionArray.push(transactionStatus.CORRECTION):actionArray.push()

                    selectedRecord[role.nuserrolecode]={
                        'IDS_PARTIALAPPROVAL':response.data[`roledetails_${role.nuserrolecode}`][0].npartialapprovalneed,
                        'IDS_SECTIONWISEAPPROVE':response.data[`roledetails_${role.nuserrolecode}`][0].nsectionwiseapprovalneed,
                        'IDS_RECOMMENDRETEST':response.data[`roledetails_${role.nuserrolecode}`][0].nrecomretestneed,
                        'IDS_RECOMMENDRECALC':response.data[`roledetails_${role.nuserrolecode}`][0].nrecomrecalcneed,
                        'IDS_RETEST':response.data[`roledetails_${role.nuserrolecode}`][0].nretestneed,
                        'IDS_RECALC':response.data[`roledetails_${role.nuserrolecode}`][0].nrecalcneed,
                        'IDS_AUTOAPPROVAL':response.data[`roledetails_${role.nuserrolecode}`][0].nautoapproval,
                        'IDS_CORRECTION':response.data[`roledetails_${role.nuserrolecode}`][0].ncorrectionneed,
                        'IDS_ESIGN':response.data[`roledetails_${role.nuserrolecode}`][0].nesignneed,
                        'filterstatus':filterStatus,
                        'decisionstatus':decisionStatus,
                        'validationstatus':validationStatus,
                        'approvalstatus':response.data[`roledetails_${role.nuserrolecode}`][0].napprovalstatuscode,
                        'checklist':response.data[`checklist_${role.nuserrolecode}`][0].nchecklistversioncode
                    }
                    selectedRecord['sversionname']=response.data.versiondetails.sversionname
                    selectedRecord['IDS_AUTOCOMPLETE']=response.data.versiondetails.nneedautocomplete
                    selectedRecord['IDS_AUTOAPPROVAL']=response.data.versiondetails.nneedautoapproval
                    selectedRecord['IDS_JOBALLOCATION']=response.data.versiondetails.nneedjoballocation
                    selectedRecord['IDS_AUTOALLOT']=response.data.versiondetails.nautoallot
                    selectedRecord[`approvalstatus_${role.nuserrolecode}`]=[{value:response.data[`roledetails_${role.nuserrolecode}`][0].napprovalstatuscode,label:response.data[`roledetails_${role.nuserrolecode}`][0].sapprovalstatus}]
                    selectedRecord[`filterstatus_${role.nuserrolecode}`]=filterStatusValues
                    selectedRecord[`validationstatus_${role.nuserrolecode}`]=validationStatusValues
                    selectedRecord[`decisionstatus_${role.nuserrolecode}`]=decisionStatusValues
                    selectedRecord[`checklist_${role.nuserrolecode}`]=checklistValues
                    selectedRecord[`checklistVersion_${role.nuserrolecode}`]=checklistVersionValues
                    selectedRecord[`actionStatus_${role.nuserrolecode}`]=actionArray
                    //selectedRecord[role.nuserrolecode]=response.data[`roledetails_${role.nuserrolecode}`][0]

                    return null;
                });
                dispatch({type: DEFAULT_RETURN, payload:{
                    openModal:true,operation:"update",
                    userRoleTree:sortData(response.data.userroletree,'ascending','nlevelno'),
                    filterStatusOptions,
                    validationStatusOptions,
                    approvalStatusOptions,
                    decisionStatusOptions,
                    checklistOptions,
                    actionStatus:response.data.actionStatus?response.data.actionStatus:[],
                    roleConfig:sortData(response.data.roleConfig,'ascending','nsorter'),
                    versionConfig:response.data.versionConfig,
                    selectedRecord,masterData,ncontrolcode,loading:false  

                }})
            })
            .catch(error => {
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
    }
}
export function getFilterChange(inputParamData,oldState){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi.post("approvalconfig/getApprovalConfigFilter",inputParamData.inputData)
            .then(response =>{
                
                const RegistrationTypeListMap = constructOptionList( response.data.registrationtype || [], "nregtypecode", "sregtypename", 'ascending', 'nsorter', false);
                const RegistrationSubTypeListMap = constructOptionList( response.data.registrationsubtype || [], "nregsubtypecode", "sregsubtypename", 'ascending', 'nsorter', false);
                let RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
                let RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
                dispatch({type: DEFAULT_RETURN, payload:{
                    masterData:{
                        ...inputParamData.masterData,
                        approvalsubtype:oldState.approvalsubtype,
                        approvalSubTypeValue:oldState.approvalSubTypeValue,
                        RegistrationTypeList:response.data.registrationtype?RegistrationTypeList:oldState.RegistrationTypeList,
                        RegistrationSubTypeList:response.data.registrationsubtype?RegistrationSubTypeList:oldState.RegistrationSubTypeList,
                        registrationType:response.data.registrationtype&&response.data.registrationtype.length>0?sortData(response.data.registrationtype,"ascending","nregtypecode"):oldState.registrationtype,
                        registrationTypeValue:response.data.registrationtype?response.data.registrationtype.length>0?{value:response.data.registrationtype[0].nregtypecode,label:response.data.registrationtype[0].sregtypename}:oldState.registrationTypeValue:oldState.registrationTypeValue,
                        registrationSubType:response.data.registrationsubtype&&response.data.registrationsubtype.length>0?sortData(response.data.registrationsubtype,"ascending","nsorter"):oldState.registrationsubtype,
                        registrationSubTypeValue:response.data.registrationsubtype?response.data.registrationsubtype.length>0?{value:response.data.registrationsubtype[0].nregsubtypecode,label:response.data.registrationsubtype[0].sregsubtypename}:oldState.registrationSubTypeValue:oldState.registrationSubTypeValue,
                        approvalConfigCode:response.data.approvalConfigCode,
                        treeVersionTemplate:response.data.treeVersionTemplate,
                        userroleTemplateValue: response.data.userroleTemplateValue,

                        // versionData:sortData(response.data.versionData),
                        // selectedVersion:response.data.selectedVersion,
                        // approvalconfigRoleNames:response.data.approvalconfigRoleNames,
                        // showAccordion:true,
                        // roleFilters:response.data.roleFilters,
                        // roleValidations:response.data.roleValidations,
                        // roleDecisions:response.data.roleDecisions,
                        // roleActions:response.data.roleActions,
                        // roleConfig:response.data.roleConfig&&response.data.roleConfig.length>0&&sortData(response.data.roleConfig,'ascending','nsorter'),
                        // versionConfig:response.data.versionConfig,
                        // searchedData:undefined
                    },loading:false
                    

                }})
            })
            .catch(error=>{
                dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getApprovalConfigurationVersion(inputParamData){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi.post("approvalconfig/getApprovalConfigVersion",inputParamData.inputData)
            .then(response =>{
                dispatch({type: DEFAULT_RETURN, payload:{
                    masterData:{
                        ...inputParamData.masterData,
                        versionData:sortData(response.data.versionData),
                        selectedVersion:response.data.selectedVersion,
                        approvalconfigRoleNames:response.data.approvalconfigRoleNames,
                        selectedRole:response.data.approvalconfigRoleNames?response.data.approvalconfigRoleNames.length>0?sortData(response.data.approvalconfigRoleNames,'ascending','nlevelno')[0]:{}:{},
                        showAccordion:true,
                        roleFilters:response.data.roleFilters,
                        roleValidations:response.data.roleValidations,
                        roleDecisions:response.data.roleDecisions,
                        roleActions:response.data.roleActions,
                        roleConfig:response.data.roleConfig&&response.data.roleConfig.length>0&&sortData(response.data.roleConfig,'ascending','nsorter'),
                        versionConfig:response.data.versionConfig,
                        searchedData:undefined
                    },loading:false
                    

                }})
            })
            .catch(error=>{
                dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function copyVersion(napprovalsubtypecode,userInfo,masterData,ncontrolcode){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi.post('approvalconfig/getCopyRegType',{napprovalsubtypecode:napprovalsubtypecode,userinfo:userInfo})
                .then(response =>{
                    let selectedRecord={};
                    const RegistrationTypeListMap = constructOptionList(response.data.CopyRegType || [], "nregtypecode", "sregtypename", 'ascending', 'nsorter', false);
                    const RegistrationSubTypeListMap = constructOptionList(response.data.CopyRegSubType || [], "nregsubtypecode", "sregsubtypename", 'ascending', 'nsorter', false);
                    let optCopyRegType = RegistrationTypeListMap.get("OptionList");
                    let optCopyRegSubType = RegistrationSubTypeListMap.get("OptionList");
                    selectedRecord['regtype']=response.data.CopyRegType.length>0?{value:response.data.CopyRegType[0].nregtypecode,label:response.data.CopyRegType[0].sregtypename}:[]
                    selectedRecord['regsubtype']=response.data.CopyRegSubType?response.data.CopyRegSubType.length>0?{value:response.data.CopyRegSubType[0].nregsubtypecode,label:response.data.CopyRegSubType[0].sregsubtypename}:[]:[]
                    dispatch({type: DEFAULT_RETURN, payload:{
                        operation:"copy",openModal:true,
                        optCopyRegSubType,
                        optCopyRegType,
                        selectedRecord,
                        masterData,ncontrolcode,loading:false  
                    }})
                })
                .catch(error=>{
                    dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
    }

}
export function getCopySubType(comboData,selectedRecord,userInfo,masterData,optCopyRegType){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi.post('approvalconfig/getCopyRegSubType',{nregtypecode:comboData.value,userinfo:userInfo})
        .then(response =>{
            const RegistrationSubTypeListMap = constructOptionList(response.data.CopyRegSubType || [], "nregsubtypecode", "sregsubtypename", 'ascending', 'nsorter', false);
            let optCopyRegSubType = RegistrationSubTypeListMap.get("OptionList");
            selectedRecord['regsubtype']=response.data.CopyRegSubType.length>0?{value:response.data.CopyRegSubType[0].nregsubtypecode,label:response.data.CopyRegSubType[0].sregsubtypename}:[]
            dispatch({type: DEFAULT_RETURN, payload:{
                operation:"copy",openModal:true,loading:false  ,
                optCopyRegType,
                optCopyRegSubType,
                selectedRecord,
                masterData
            }})
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 500) {
                toast.error(error.message);
            }
            else {
                toast.warn(error.response.data);
            }
        })
    }
}
export function setDefault(inputObj,event){
    let {flag,napprovalconfigrolecode,napprovalsubtypecode,userInfo,masterData}=inputObj;
    let rowData=inputObj.selectedRecord
    return function(dispatch){
        if(event.target.checked){
            let inputData={}
            let url='';
            if(flag===1){
                inputData={
                    napprovalconfigrolecode:napprovalconfigrolecode,
                    napprovalfiltercode:rowData.napprovalfiltercode,
                    napprovalsubtypecode:napprovalsubtypecode,
                    ntransactionstatus:rowData.ntransactionstatus,
                    napprovalconfigversioncode:masterData.selectedVersion.napprovalconfigversioncode,
                    userinfo:userInfo
                }
                url='approvalconfig/setDefaultFilterStatus'
            }else{
                inputData={
                    napprovalconfigrolecode:napprovalconfigrolecode,
                    napprovaldecisioncode:rowData.napprovaldecisioncode,
                    napprovalsubtypecode:napprovalsubtypecode,
                    ntransactionstatus:rowData.ntransactionstatus,
                    napprovalconfigversioncode:masterData.selectedVersion.napprovalconfigversioncode,
                    userinfo:userInfo
                }
                url='approvalconfig/setDefaultDecisionStatus'
            }
            dispatch(initRequest(true));
            rsapi.post(url,inputData)
            .then(response =>{
                dispatch({type: DEFAULT_RETURN, payload:{
                
                    masterData:{
                        ...masterData,
                        showAccordion:true,
                        roleFilters:response.data.roleFilters,
                        roleValidations:response.data.roleValidations,
                        roleDecisions:response.data.roleDecisions,
                        roleActions:response.data.roleActions,
                        roleConfig:sortData(response.data.roleConfig,'ascending','nsorter'),
                        versionConfig:response.data.versionConfig
                    },loading:false  
                }})
            })
            .catch(error=>{
                dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
        }
    }
}
