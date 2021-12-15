import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import {getComboLabelValue,constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

//export function getMethodComboService (screenName, primaryKeyName, primaryKeyValue, operation, inputParam , userInfo, ncontrolCode) {            
    export function getBarcodeComboService (methodParam) {            
    return function (dispatch) {   
    const methodTypeService = rsapi.post("barcode/getSqlQuery", 
                                    {userInfo:methodParam.userInfo});
    let urlArray = [];
    let selectedId = null;
   // let barcodeData={};
    //let editField={};
    //let selectedRecord =  {};
    // let selectedRecord =  {};
    if (methodParam.operation === "create"){
        urlArray = [methodTypeService];
        // selectedRecord = { 
        //     nattachmenttypecode: attachmentType.FTP,
        //     nlinkcode: defaultLink.length>0?{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:"",
        //     disabled
        // };
    }
    else{           
        const url = methodParam.inputParam.classUrl+ "/getActive" + methodParam.inputParam.methodUrl + "ById";   //"method/getActiveMethodById"      
        const methodById =  rsapi.post(url, { [methodParam.primaryKeyField] :methodParam.primaryKeyValue, "userinfo": methodParam.userInfo} );
        urlArray = [methodTypeService, methodById];
        selectedId = methodParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
           
            let selectedRecord =  {};
            const controlMap = constructOptionList(response[0].data.ControlType || [], "ncontrolcode",
                                  "scontrolids", undefined, undefined, false);
            const queryMap = constructOptionList(response[0].data.SQLQuey|| [], "nsqlquerycode",
                                  "ssqlqueryname", undefined, undefined, false);
            const  controlMapList = controlMap.get("OptionList");
            const  queryMapList = queryMap.get("OptionList");


            if (methodParam.operation === "update"){
                selectedRecord = response[1].data;
                selectedRecord["nsqlquerycode"] = getComboLabelValue(selectedRecord, response[0].data.SQLQuey, 
                    "nsqlquerycode", "ssqlqueryname"); 
                selectedRecord["ncontrolcode"] = getComboLabelValue(selectedRecord, response[0].data.ControlType, 
                        "ncontrolcode", "scontrolids");    
                              
            };               
           //selectedRecord["nattachmenttypecode"]= attachmentType.PRN
            dispatch({type: DEFAULT_RETURN, payload:{barcodeData:response[0].data || [],   
                queryMapList,   
                controlMapList,                    
                operation:methodParam.operation, screenName:methodParam.screenName, selectedRecord, 
                openModal : true,
                ncontrolCode:methodParam.ncontrolCode,
                loading:false,selectedId
            }});
      
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
    }
}