import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';

export function fetchChargeBandById(editParam){  
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi.post("chargeband/getActiveChargeBandById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
        .then(response=> {
            let selectedId=editParam.primaryKeyValue
            dispatch({
                type: DEFAULT_RETURN, payload:{
                    selectedRecord : response.data,
                    operation:"update",
                    openModal: true,
                    screenName:editParam.screenName,
                    inputparam:editParam.inputparam,
                    ncontrolcode:editParam.ncontrolCode,
                    loading:false,selectedId
                }
            }); 
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