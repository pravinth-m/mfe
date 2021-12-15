import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import {sortData, constructOptionList} from '../components/CommonScript';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { toast } from 'react-toastify';
import { transactionStatus } from '../components/Enumeration';

export function getManfacturerCombo(screenName, operation, primaryKeyName,  masterData, userInfo, ncontrolCode) {
 return function(dispatch){ 
    let urlArray = [];
    if (operation === "create") {
        const EDQMManufacturer = rsapi.post("/edqmmanufacturer/getEDQMManufacturer", { "userinfo": userInfo });
        urlArray = [EDQMManufacturer];
    }
    else {

        const EDQMManufacturer = rsapi.post("/edqmmanufacturer/getEDQMManufacturer", { "userinfo": userInfo });
        const ManufacturerByID = rsapi.post("/manufacturer/getManufacturerById", { [primaryKeyName] :masterData.selectedManufacturer[primaryKeyName], "userinfo": userInfo });
        urlArray = [EDQMManufacturer, ManufacturerByID];
    }

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {

            let edqmManufacturer = [];
            let selectedRecord = {};

            const edqmManufacturerMap = constructOptionList(response[0].data || [], "nofficialmanufcode",
            "sofficialmanufname", undefined, undefined, false);

            const edqmManufacturerList = edqmManufacturerMap.get("OptionList");

            if (operation === "update") {

                selectedRecord = response[1].data;
                selectedRecord["nofficialmanufcode"] = {
                    label: response[1].data["sofficialmanufname"],
                    value: response[1].data["nofficialmanufcode"]
                };
                // edqmManufacturer.push({
                //     label: response[1].data["sofficialmanufname"],
                //     value: response[1].data["nofficialmanufcode"]
                // });
            }
            dispatch({type: DEFAULT_RETURN, 
                payload:{  
                edqmManufacturerList, isOpen: true,  
                selectedRecord: operation === "update" ? selectedRecord : {"ntransactionstatus": 1}, 
                edqmManufacturer: edqmManufacturer ,
                operation: operation,
                     screenName: screenName,
                    openModal : true, ncontrolCode: ncontrolCode, loading:false
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

export function selectCheckBoxManufacturer(Manufacturer, userInfo, masterData){
    return function(dispatch){ 
    dispatch(initRequest(true));
    rsapi.post("/manufacturer/getManufacturerWithSiteAndContactDetails", { 'userinfo': userInfo, "nmanufcode": Manufacturer.nmanufcode })
        
    .then(response=>{      
        masterData = {...masterData, ...response.data};        
        sortData(masterData);
        // console.log(" Select Checked : ", masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false,selectedId:null}});   
   })   
        .catch(error => {
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
        })
    }
}

export function getContactInfo(SiteDetails, masterData){
    return function(dispatch){ 
    let Map={};
 
    Map["nmanufcode"]=parseInt(SiteDetails.siteAddress.nmanufcode);
    Map["nmanufsitecode"]=parseInt(SiteDetails.siteAddress.nmanufsitecode);
    Map["userinfo"]=SiteDetails.userInfo
    dispatch(initRequest(true));
    rsapi.post("/manufacturer/getContactManufacturerBySite",Map)
    .then(response =>{
        // dispatch({type: DEFAULT_RETURN, payload:{
        //     ManufacturerContactInfo :response.data,
        //     SiteCode: SiteDetails.nmanufsitecode, loading:false
        // }});   
         
        masterData = {...SiteDetails.masterData, ManufacturerContactInfo: response.data,
            selectedSite:  SiteDetails.siteAddress,
             SiteCode: SiteDetails.siteAddress.nmanufsitecode};     
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false, dataState: undefined}}); 

    })
    .catch(error =>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
        // console.log(error);
    })
}
}

export function getSiteManufacturerLoadEdit(screenName, operation, manufCode, manufSiteCode, ncontrolCode, userInfo){
    return function(dispatch){ 
    let urlArray = [];
    let selectedRecord = {};

    if (operation === "create") {
        const Country = rsapi.post("/country/getCountry", { "userinfo": userInfo });
        urlArray = [Country];
    }
    else {

        const Country = rsapi.post("/country/getCountry", { "userinfo": userInfo });
        const ManufacturerSiteByID = rsapi.post("/manufacturer/getSiteManufacturerById", { "nmanufcode": manufCode, "nmanufsitecode": manufSiteCode ,"userinfo": userInfo});
        urlArray = [Country, ManufacturerSiteByID];
    }

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {

            let countryCode = [];

            const countryMap = constructOptionList(response[0].data || [], "ncountrycode",
            "scountryname", undefined, undefined, true);

            const countryList = countryMap.get("OptionList");


            if (operation === "update") {

                selectedRecord = response[1].data;
                selectedRecord["ncountrycode"] = {
                    label: response[1].data["scountryname"],
                    value: response[1].data["ncountrycode"]
                };
                // countryCode.push({
                //     label: response[1].data["scountryname"],
                //     value: response[1].data["ncountrycode"]
                // });
            }

            dispatch({type: DEFAULT_RETURN, payload:{
                Country: countryList, openChildModal:true, operation, 
                selectedRecord: operation === "update" ? selectedRecord : {"ntransactionstatus": transactionStatus.ACTIVE,"ndefaultstatus":transactionStatus.YES}, countryCode: countryCode, ncontrolCode,
                screenName: "IDS_SITEDETAILS", loading:false
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
export function getContactManufacturerLoadEdit(fetchRecord){
    return function(dispatch){ 
    let urlArray = [];
    let selectedId = null;
    const ManufacturerContactByID = rsapi.post("/manufacturer/getContactManufacturerById", { "nmanufcode": fetchRecord.editRow.nmanufcode, "nmanufsitecode": fetchRecord.editRow.nmanufsitecode, "nmanufcontactcode": fetchRecord.editRow.nmanufcontactcode,"userinfo": fetchRecord.userInfo });
    urlArray = [ManufacturerContactByID];
    selectedId = fetchRecord.editRow.nmanufcontactcode;

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {            
            dispatch({type: DEFAULT_RETURN, payload:{
                openChildModal:true, operation:fetchRecord.operation, 
                selectedRecord: fetchRecord.operation === "update" ? response[0].data : undefined,
          defaultSite: fetchRecord.editRow.nmanufsitecode, ncontrolCode:fetchRecord.ncontrolCode ,
          screenName: "IDS_CONTACTDETAILS", loading:false, selectedId
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


// export function filterColumnDataManufacturer(filterValue, masterData, userInfo) {
//     return function (dispatch) {  
      
//         let manuFCode = 0;   
//         let searchedData = undefined;
//         if (filterValue === ""){
//             manuFCode = masterData["Manufacturer"][0].nmanufcode;
//         }
//         else{
//             // if (filterValue.length > 2)
//             // {
//                 searchedData = searchData(filterValue, masterData["Manufacturer"]);
            
//                 if (searchedData.length > 0){
//                     manuFCode = searchedData[0].nmanufcode; 
//                 }
//             // }
//         }
     
//         if (manuFCode !== 0){
//             dispatch(initRequest(true));
//             return rsapi.post("manufacturer/getManufacturerWithSiteAndContactDetails", {userInfo, nmanufcode:manuFCode})
//             .then(response=>{         
//                         masterData["ManufacturerSiteAddress"] = response.data["ManufacturerSiteAddress"];
//                         masterData["ManufacturerContactInfo"] = response.data["ManufacturerContactInfo"];
//                         masterData["selectedManufacturer"] = response.data["selectedManufacturer"];
//                         masterData["SiteCode"] = response.data["SiteCode"];
//                         masterData["searchedData"] = searchedData;

//                         dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false}});       
//             })
//             .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//                 if (error.response.status === 500){
//                     toast.error(error.message);
//                 } 
//                 else{               
//                     toast.warn(error.response.data);
//                 }  
//             }) 
//         } 
//         else{        
//             masterData["ManufacturerSiteAddress"] = [];
//             masterData["ManufacturerContactInfo"] = undefined;
//             masterData["selectedManufacturer"] = [];
//             masterData["searchedData"] = [];
//             masterData["SiteCode"]  = 0;
//             dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false}}); 
//         }           
//     }   
// } 

