import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import {constructOptionList, getComboLabelValue} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

//export function getMethodComboService (screenName, primaryKeyName, primaryKeyValue, operation, inputParam , userInfo, ncontrolCode) {            
    export function getMaterialTypeComboService (methodParam) {            
    return function (dispatch) {   
    const methodTypeService = rsapi.post("materialcategory/getMaterialType", 
                                    {userinfo:methodParam.userInfo});
    let urlArray = [];
    let selectedId = null;
    if (methodParam.operation === "create"){
        urlArray = [methodTypeService];
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
          

            const materialCatgeoryList = constructOptionList(response[0].data  ||[], "nmaterialtypecode",
            "smaterialtypename" , undefined, undefined, undefined);
        const  materialCatgeoryList1  = materialCatgeoryList.get("OptionList");
        const  materialCatgeorydefault  = materialCatgeoryList.get("DefaultValue");

          
        if (methodParam.operation === "update"){
            selectedRecord = response[1].data;
            selectedRecord["nmaterialtypecode"] = getComboLabelValue(selectedRecord, response[0].data, 
                "nmaterialtypecode", "smaterialtypename"); 
                            
        }else{
            selectedRecord["nmaterialtypecode"] = materialCatgeorydefault; 
        }
           
            dispatch({type: DEFAULT_RETURN, payload:{materialCatgeoryList:materialCatgeoryList1|| [],                               
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