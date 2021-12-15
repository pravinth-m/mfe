import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import {sortData,constructOptionList, rearrangeDateFormat} from '../components/CommonScript';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { toast } from 'react-toastify';

export function getInstrumentCombo(screenName, operation, primaryKeyName,  masterData, userInfo, ncontrolCode) {
 return function(dispatch){ 
    let urlArray = [];    
        const InstrumentCategory = rsapi.post("/instrumentcategory/fetchinstrumentcategory", { "userinfo": userInfo });
        const Supplier = rsapi.post("/instrument/getSupplier", { "userinfo": userInfo });
        const Manufacturer = rsapi.post("/instrument/getManufacturer", { "userinfo": userInfo });
        const InstrumentStatus = rsapi.post("/instrument/getInstrumentStatus", { "userinfo": userInfo });
        const Lab = rsapi.post("/section/getSection", { "userinfo": userInfo });
        const Period = rsapi.post("/instrument/getPeriod", { "ncontrolcode":ncontrolCode,"userinfo": userInfo });
        const timeZoneService = rsapi.post("timezone/getTimeZone");
        const Instrumentdate = rsapi.post("/instrument/addInstrumentDate",{ "ncontrolcode":ncontrolCode,"userinfo": userInfo });
        const UTCtimeZoneService = rsapi.post("timezone/getLocalTimeByZone", { userinfo: userInfo });
        if (operation === "create") {
            urlArray = [InstrumentCategory,Supplier,Manufacturer,InstrumentStatus,Lab,Period,timeZoneService,Instrumentdate,UTCtimeZoneService];  
        
         }else{
        const InstrumentId = rsapi.post("/instrument/getActiveInstrumentById",{ [primaryKeyName] :masterData.selectedInstrument[primaryKeyName],  "userinfo": userInfo });
        //const ManufacturerByID = rsapi.post("/manufacturer/getManufacturerById", { [primaryKeyName] :masterData.selectedManufacturer[primaryKeyName], "userinfo": userInfo });
        urlArray = [InstrumentCategory,Supplier,Manufacturer,InstrumentStatus,Lab,Period,timeZoneService,InstrumentId,Instrumentdate,UTCtimeZoneService];
        }

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {
            console.log(" response:", response); 

            let expiryDate = undefined;
            let  currentTime = undefined;
            const instcatMap = constructOptionList(response[0].data || [], "ninstrumentcatcode",
             "sinstrumentcatname", undefined, undefined, false);

            const supplierMap = constructOptionList(response[1].data.Supplier || [], "nsuppliercode",
             "ssuppliername", undefined, undefined, false);

            const manufMap = constructOptionList(response[2].data.Manufacturer|| [], "nmanufcode",
             "smanufname", undefined, undefined, false);

            const inststatusMap = constructOptionList(response[3].data || [], "ntranscode",
             "stransstatus", undefined, undefined, false);

            const sectionMap = constructOptionList(response[4].data || [], "nsectioncode",
             "ssectionname", undefined, undefined, false);

           const periodMap = constructOptionList(response[5].data || [], "nperiodcode",
             "speriodname", undefined, undefined, false);

           const timezoneMap = constructOptionList(response[6].data || [], "ntimezonecode",
              "stimezoneid", undefined, undefined, false);
            

             const  InstrumentCategory = instcatMap.get("OptionList");
             const  Supplier = supplierMap.get("OptionList");
             const  Manufacturer = manufMap.get("OptionList");
             const  InstrumentStatus = inststatusMap.get("OptionList");
             const  Lab = sectionMap.get("OptionList");
             const  Period = periodMap.get("OptionList");
             const  TimeZoneList = timezoneMap.get("OptionList");


            let selectedRecord =  {
            "ntzmanufdate":{"value": userInfo.ntimezonecode, 
                             "label":userInfo.stimezoneid},
            //"stzmanufdate":userInfo.stimezoneid

            "ntzpodate":{"value": userInfo.ntimezonecode, 
                          "label":userInfo.stimezoneid},
            "stzpodate":userInfo.stimezoneid,

                
            "ntzreceivedate":{"value": userInfo.ntimezonecode, 
                             "label":userInfo.stimezoneid},
            "stzreceivedate":userInfo.stimezoneid,


            "ntzinstallationdate":{"value": userInfo.ntimezonecode, 
                                   "label":userInfo.stimezoneid},
            "stzinstallationdate":userInfo.stimezoneid,

            
            "ntzexpirydate":{"value": userInfo.ntimezonecode, 
                                   "label":userInfo.stimezoneid},
            "stzexpirydate":userInfo.stimezoneid
        };  
            let instrumentCategory = [];
            let supplier =[];
            let manufacturer=[];
            let instrumentstatus=[];
            let nwindowsperiodminusunit=[];
            let nwindowsperiodplusunit=[];;
            let lab=[];
            let ntzmanufdate=[];
            let ntzpodate=[];
            let ntzreceivedate=[];
            let ntzinstallationdate=[];
            let ntzexpirydate=[];
            let susername=[];
            let service=[];
            if(operation === "create"){
               let date =  rearrangeDateFormat(userInfo,response[8].data);
                selectedRecord["dmanufacdate"] = date;//new Date(response[8].data);
                selectedRecord["dpodate"] = date;
                selectedRecord["dreceiveddate"] = date;
                selectedRecord["dinstallationdate"] = date;
                currentTime =date;
                if(response[7].data["ExpiryDate"] !==""){
                   expiryDate = rearrangeDateFormat(userInfo,response[7].data["ExpiryDate"]);//new Date(response[7].data["ExpiryDate"]);
                    selectedRecord["dexpirydate"] = expiryDate;
                }
            }
            if (operation === "update") {
                selectedRecord = response[7].data;
                instrumentCategory.push({"value": response[7].data["ninstrumentcatcode"],"label": response[7].data["sinstrumentcatname"]});
                supplier.push({"value" : response[7].data["nsuppliercode"], "label" : response[7].data["ssuppliername"]});
                service.push({"value" : response[7].data["nservicecode"], "label" : response[7].data["sserviceby"]});
                manufacturer.push({"value": response[7].data["nmanufcode"], "label": response[7].data["smanufname"]});
                instrumentstatus.push({"value": response[7].data["ntranscode"], "label": response[7].data["sactivestatus"]});
                nwindowsperiodminusunit.push({"value": response[7].data["nwindowsperiodminusunit"], "label": response[7].data["swindowsperiodminusunit"]});
                nwindowsperiodplusunit.push({"value": response[7].data["nwindowsperiodplusunit"], "label": response[7].data["swindowsperiodplusunit"]});
                lab.push({"value": response[7].data["nsectioncode"], "label": response[7].data["ssectionname"]})
                ntzmanufdate.push({"value": response[7].data["ntzmanufdate"], "label": response[7].data["stzmanufdate"]})
                ntzpodate.push({"value": response[7].data["ntzpodate"], "label": response[7].data["stzpodate"]})
                ntzreceivedate.push({"value": response[7].data["ntzreceivedate"], "label": response[7].data["stzreceivedate"]})
                ntzinstallationdate.push({"value": response[7].data["ntzinstallationdate"], "label": response[7].data["stzinstallationdate"]})
                ntzexpirydate.push({"value": response[7].data["ntzexpirydate"], "label": response[7].data["stzexpirydate"]})
                susername.push({"value":response[7].data["nusercode1"],"label":response[7].data["susername"]})
             
                if(response[7].data["smanufacdate"] !==""){

                    selectedRecord["dmanufacdate"] = rearrangeDateFormat(userInfo,response[7].data["smanufacdate"]);//new Date(response[7].data["smanufacdate"]);
                }
                
                if(response[7].data["spodate"] !==""){
                    selectedRecord["dpodate"] = rearrangeDateFormat(userInfo,response[7].data["spodate"]);//new Date(response[7].data["spodate"]);
                }
                // else{
                //     selectedRecord["dpodate"] = " ";
                // }

                if(response[7].data["sreceiveddate"] !==""){
                    selectedRecord["dreceiveddate"] = rearrangeDateFormat(userInfo,response[7].data["sreceiveddate"]);//new Date(response[7].data["sreceiveddate"]);
                }
                if(response[7].data["sinstallationdate"] !==""){
                    selectedRecord["dinstallationdate"] = rearrangeDateFormat(userInfo,response[7].data["sinstallationdate"]);//new Date(response[7].data["sinstallationdate"]);
                }

                if(response[7].data["sexpirydate"] !==""){
                    selectedRecord["dexpirydate"] = rearrangeDateFormat(userInfo,response[7].data["sexpirydate"]);//new Date(response[7].data["sexpirydate"]);
                }
               
                
                selectedRecord["ninstrumentcatcode"]= instrumentCategory[0];
                selectedRecord["nsuppliercode"] = supplier[0];
                selectedRecord["nservicecode"] = service[0];
                if(manufacturer[0].value!==-1)
                selectedRecord["nmanufcode"] = manufacturer[0];
                if(instrumentstatus[0].value!==-1)
                selectedRecord["ntranscode"] = instrumentstatus[0];
                if(nwindowsperiodminusunit[0].value!==-1)
                selectedRecord["nwindowsperiodminusunit"] = nwindowsperiodminusunit[0];
                if(nwindowsperiodplusunit[0].value!==-1)
                selectedRecord["nwindowsperiodplusunit"] = nwindowsperiodplusunit[0];
                selectedRecord["nsectioncode"] =lab[0];
                selectedRecord["ntzmanufdate"] =ntzmanufdate[0];
                selectedRecord["stzmanufdate"] =ntzmanufdate[0].label;
                selectedRecord["ntzpodate"] =ntzpodate[0];
                selectedRecord["stzpodate"] =ntzpodate[0].label;
                selectedRecord["ntzreceivedate"] =ntzreceivedate[0];
                selectedRecord["stzreceivedate"] =ntzreceivedate[0].label;
                selectedRecord["ntzinstallationdate"] =ntzinstallationdate[0];
                selectedRecord["stzinstallationdate"] =ntzinstallationdate[0].label;
                selectedRecord["ntzexpirydate"] =ntzexpirydate[0];
                selectedRecord["stzexpirydate"] =ntzexpirydate[0].label;
                selectedRecord["susername"] =susername[0];
            }
                
          
            dispatch({type: DEFAULT_RETURN, 
                payload:{  
                InstrumentCategory,
                Supplier,
                Manufacturer,
                InstrumentStatus,
                instrumentCategory:instrumentCategory,
                supplier:supplier,
                manufacturer:manufacturer,
                Lab,
                Period,
                TimeZoneList,
                isOpen: true,  
                selectedRecord:  selectedRecord, 
                operation: operation,
                screenName: screenName,
                openModal : true, 
                ncontrolCode: ncontrolCode,
                loading:false,
                currentTime,
                expiryDate
            }});
        })
        .catch(error => {
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 500) {
                toast.error(intl.formatMessage({ id: error.message }));
            }
            else {
                toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
}


export function getSectionUsers (nsectioncode, userInfo,selectedRecord,screenName) {
    return function (dispatch) {  
        dispatch(initRequest(true));
        return rsapi.post("instrument/getSectionBasedUser", {"nsectioncode":nsectioncode}, {userinfo:userInfo}) 
        .then(response=>{  
            //console.log(" response:", response); 
            let  Users =[];
            if(screenName==="IDS_SECTION"){
            //let sectionusers=[];
            const userName = constructOptionList(response.data || [], "nusercode",
            "susername", undefined, undefined, false);
            Users  = userName.get("OptionList");
            //selectedRecord["nusercode"]="";
            selectedRecord["nusercode"] = undefined;//{label:SectionUsers[0].label,value:SectionUsers[0].value,item:SectionUsers[0]};
            }else{
                Users  = response.data;
            }
        
            dispatch({type: DEFAULT_RETURN, 
                payload:{ 
                    Users,
                    selectedRecord,
                    loading:false

                }});      
            
       }).catch(error=>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
       if (error.response.status === 500){
           toast.error(error.message);
       } 
       else{               
           toast.warn(error.response.data);
       }  
  
   })
       
   // const sectionUsers = rsapi.post("instrument/getSectionBasedUser",{"nsectioncode":nsectioncode},{ "userinfo": userInfo });\
   // urlArray = [sectionUsers]; 
}
}





export function getInstrumentDetail (Instrument, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("instrument/getInstrument", {ninstrumentcode:Instrument.ninstrumentcode, userinfo:userInfo})
   .then(response=>{      
        masterData = {...masterData, ...response.data};        
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false,dataState:undefined}});   
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


export const getAvailableInstData = (instItem, url, key, screenName, userInfo, ncontrolCode,selectedRecord) => {
    return function (dispatch) { 
        dispatch(initRequest(true));
      //  Axios.all(urlArray)
            return rsapi.post("/instrument/getUsers", { "userinfo": userInfo })
            .then(response=>{   

                const secMap = constructOptionList(response.data.Section || [], "nsectioncode",
                             "ssectionname", undefined, undefined, false);
                const userMap = constructOptionList(response.data.Users || [], "nusercode",
                                "susername", undefined, undefined, false);
                const  Lab = secMap.get("OptionList");
                const LabDefault=secMap.get("DefaultValue");
                if(LabDefault!==undefined){
                selectedRecord={ "nsectioncode":{"value": LabDefault.value, 
                "label":LabDefault.label},}
            }
                const  Users = userMap.get("OptionList");
                        dispatch({
                        type: DEFAULT_RETURN, 
                        payload:{ 
                        Lab,
                        Users,
                        isOpen: true,  
                        selectedRecord,
                        //selectedRecord: operation === "update" ? response[7].data : {"ntransactionstatus": 1}, 
                        operation: "create",
                        screenName: screenName,
                        openModal : true, 
                        ncontrolCode: ncontrolCode, 
                        instItem:instItem,
                        loading:false
                    }
             });
        })
        .catch(error => {
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}});
            if(error.response.status === 417) {
                toast.info(error.response.data)
            } else {
                toast.error(error.message)
            }
        });
    }
}



export const changeInstrumentCategoryFilter = (inputParam, filterInstrumentCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/instrument/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState:undefined,
                        masterData: {
                            ...masterData,
                            filterInstrumentCategory,
                            nfilterInstrumentCategory: inputParam.inputData.nfilterInstrumentCategory
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

