import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import {getComboLabelValue, constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
//import { intl } from '../components/App';

//export function getMethodComboService (screenName, primaryKeyName, primaryKeyValue, operation, inputParam , userInfo, ncontrolCode) {            
export function getMethodComboService (methodParam) {            
    return function (dispatch) {   
    const methodCategoryService = rsapi.post("methodcategory/getMethodCategory", 
                                    {userinfo:methodParam.userInfo});
    let urlArray = [];
    let selectedId = null;
    if (methodParam.operation === "create"){
        urlArray = [methodCategoryService];
    }
    else{           
        const url = methodParam.inputParam.classUrl+ "/getActive" + methodParam.inputParam.methodUrl + "ById";   //"method/getActiveMethodById"      
        const methodById =  rsapi.post(url, { [methodParam.primaryKeyField] :methodParam.primaryKeyValue, "userinfo": methodParam.userInfo} );
        urlArray = [methodCategoryService, methodById];
        selectedId = methodParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
            
            let selectedRecord =  {};

            const methodCatMap = constructOptionList(response[0].data || [], "nmethodcatcode",
                                "smethodcatname", undefined, undefined, true);
            const methodCategoryList = methodCatMap.get("OptionList");
            
            if (methodParam.operation === "update"){
                selectedRecord = response[1].data;
                selectedRecord["nmethodcatcode"] = getComboLabelValue(selectedRecord, response[0].data, 
                    "nmethodcatcode", "smethodcatname");                   
            }
           
            dispatch({type: DEFAULT_RETURN, payload:{methodCategoryList,//:response[0].data || [],                               
                        operation:methodParam.operation, screenName:methodParam.screenName, selectedRecord, 
                        openModal : true,
                        ncontrolCode:methodParam.ncontrolCode,
                        loading:false,selectedId
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
