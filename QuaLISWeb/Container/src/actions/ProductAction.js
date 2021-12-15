import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    getComboLabelValue,
    constructOptionList
} from '../components/CommonScript'
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { initRequest } from './LoginAction';



export function getProductComboService (productParam) {            
    return function (dispatch) {   
    const productCategoryService = rsapi.post("/productcategory/getProductCategory", 
                                    {userinfo:productParam.userInfo});
    let urlArray = [];
    let selectedId = null;
    if (productParam.operation === "create"){
        urlArray = [productCategoryService];
    }
    else{           
        const url = productParam.inputParam.classUrl+ "/getActive" + productParam.inputParam.methodUrl + "ById";   //"product/getActiveproductById"      
        const productById =  rsapi.post(url, { [productParam.primaryKeyField] :productParam.primaryKeyValue, "userinfo": productParam.userInfo} );
        urlArray = [productCategoryService, productById];
        selectedId = productParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
            
            let selectedRecord =  {};

            const productCatMap = constructOptionList(response[0].data || [], "nproductcatcode",
                                "sproductcatname", undefined, undefined, true);
            const productCategoryList = productCatMap.get("OptionList");
            
            if (productParam.operation === "update"){
                selectedRecord = response[1].data;
                selectedRecord["nproductcatcode"] = getComboLabelValue(selectedRecord, response[0].data, 
                    "nproductcatcode", "sproductcatname");                   
            }
           
            dispatch({type: DEFAULT_RETURN, payload:{productCategoryList,//:response[0].data || [],                               
                        operation:productParam.operation, screenName:productParam.screenName, selectedRecord, 
                        openModal : true,
                        ncontrolCode:productParam.ncontrolCode,
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
