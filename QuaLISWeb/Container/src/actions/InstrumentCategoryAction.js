import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
// import {
//     getComboLabelValue
// } from '../components/CommonScript'
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from './../components/Enumeration';


    export function openInstrumentCategoryModal(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolcode) {
        return function (dispatch) {
            if (operation === "create" || operation === "update" ) {
                const Technique = rsapi.post("/technique/getTechnique", {
                    "userinfo": userInfo
                });
    
                const Interfacetype = rsapi.post("/instrumentcategory/getInterfacetype", {
                    "userinfo": userInfo
                });
               
    
                let urlArray = [];
                if (operation === "create") {
                   
                    urlArray = [Technique, Interfacetype];
                } 
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                          let selectedRecord = {};
                            selectedRecord["nstatus"] = 1;
                            selectedRecord["ninstrumentcatcode"] = 0;
                            selectedRecord["ncalibrationreq"] = transactionStatus.NO;
                            selectedRecord["ncategorybasedflow"] = transactionStatus.NO;
                            selectedRecord["ndefaultstatus"] = transactionStatus.NO;
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                Technique: response[0].data || [],
                                Interfacetype: response[1].data || [],
                                operation,
                                screenName,
                                selectedRecord,
                                openModal: true,
                                ncontrolcode, loading: false,parentPopUpSize:'xl'
                            }
                        })
                    })
                    .catch(error => {
                        dispatch(initRequest(false));
                        if (error.response.status === 500) {
                            toast.error(error.message);
                        } else {
                            toast.warn(intl.formatMessage({
                                id: error.response.data
                            }));
                        }
                    })
            }
        }
    }
    
    export function fetchInstrumentCategoryById (editParam){  
        return function(dispatch){
            const URL1= rsapi.post('technique/getTechnique',{"userinfo":editParam.userInfo})
            const URL2=rsapi.post("instrumentcategory/getActiveInstrumentCategoryById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
            const URL3= rsapi.post('instrumentcategory/getInterfacetype',{"userinfo":editParam.userInfo})
            dispatch(initRequest(true));
            Axios.all([URL1,URL2,URL3])
            .then(response=> { 
                let selectedRecord={}
                let selectedId = editParam.primaryKeyValue;
                selectedRecord=response[1].data
               // let Technique = response[0].data;
               // let Interfacetype = response[2].data;

                selectedRecord['ntechniquecode']={value:response[1].data.ntechniquecode,label:response[1].data.stechniquename}
                selectedRecord['ninterfacetypecode']={value:response[1].data.ninterfacetypecode,label:response[1].data.sinterfacetypename}

              // getComboLabelValue(selectedRecord, Technique, "ntechniquecode", "stechniquename");
              //  getComboLabelValue(selectedRecord, Interfacetype, "ninterfacetype", "sinterfacetypename");
                dispatch({
                    type: DEFAULT_RETURN, payload:{
                    selectedRecord ,
                    Technique: response[0].data || [],
                    Interfacetype: response[2].data || [],
                    operation:editParam.operation,
                    openModal: true,
                    screenName:editParam.screenName,
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
export const getSlidedranganddrop = (screenName) => {
    return (dispatch) => {
        dispatch({type: DEFAULT_RETURN, payload:{selectedRecord : {}, screenName: screenName,
            operation: "create", openModal: true,loaddrag:true,parentPopUpSize:'lg'}});
    }
}