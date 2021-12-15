import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios'
import { initRequest } from './LoginAction';
import { transactionStatus } from '../components/Enumeration';

export function openFTPConfigModal  (userInfo,ncontrolcode)  {

    return function(dispatch){
    dispatch(initRequest(true));
    rsapi.post("site/getSiteForFTP",{"userinfo": userInfo})
    .then(response=> { 
        const selectedRecord={};
        selectedRecord['nsitecode']=response.data.length>0?
                                    response.data[0].ndefaultstatus===transactionStatus.YES?
                                    response.data[0].nsitecode
                                    :-1:-1
        selectedRecord['siteValue']=response.data.length>0? response.data[0].ndefaultstatus===transactionStatus.YES?  
                                    [{value:response.data[0].nsitecode,label:response.data[0].ssitename,item:response.data[0]}]
                                    :[]:[]
        dispatch({
            type: DEFAULT_RETURN, payload:{
                openModal:true,
                operation:"create",
                siteOptions:response.data,
                selectedRecord,ncontrolcode    
                ,loading:false           
                }
            }) 
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
};

export function fetchFTPConfigByID(editParam){

    return function(dispatch){
    const url1=rsapi.post("site/getSiteForFTP",{"userinfo": editParam.userInfo})
    const url2=rsapi.post("ftpconfig/getActiveFTPConfigById",
            { [editParam.primaryKeyField] :editParam.primaryKeyValue,"userinfo":editParam.userInfo} )
    dispatch(initRequest(true));
    Axios.all([url1,url2])
    .then(response=> { 
        let selectedId=editParam.primaryKeyValue
        let selectedRecord=response[1].data
        selectedRecord['siteValue']={value:response[1].data.nsitecode,label:response[1].data.ssitename}
        
        dispatch({
            type: DEFAULT_RETURN, payload:{
            openModal:true, 
            selectedRecord , 
            operation:editParam.operation,
            screenName:editParam.screenName,
            siteOptions:response[0].data,
            ncontrolcode:editParam.ncontrolCode,
            inputparam:editParam.inputparam,
            loading:false,selectedId
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