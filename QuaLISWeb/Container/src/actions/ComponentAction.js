import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import Axios from 'axios';
import {constructOptionList} from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';

//export function fetchRecordComponent(screenName, primaryKeyName, primaryKeyValue, operation, inputParam, userInfo, ncontrolCode){ 
export function fetchRecordComponent(fetchRecordParam) {
    return function (dispatch) {
        const bulkType = rsapi.post("edqmbulktype/getAllEDQMBulkType", { "userinfo": fetchRecordParam.userInfo });
        const productDescription = rsapi.post("edqmproductdescription/getEDQMProductDescription", { "userinfo": fetchRecordParam.userInfo });
        const productType = rsapi.post("edqmproducttype/getAllEDQMProductType", { "userinfo": fetchRecordParam.userInfo });
        const storageCondition = rsapi.post("storagecondition/getStorageCondition", { "userinfo": fetchRecordParam.userInfo });
        let urlArray = [];

        let selectedId = null;
        if (fetchRecordParam.operation === "update") {
            const component = rsapi.post(fetchRecordParam.inputParam.classUrl + "/getActive" + fetchRecordParam.inputParam.methodUrl + "ById", { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo });

            urlArray = [bulkType, productDescription, productType, storageCondition, component];
            selectedId = fetchRecordParam.primaryKeyValue;
        }
        else {
            urlArray = [bulkType, productDescription, productType, storageCondition];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                let nbulktypecode = [];
                let nproductdesccode = [];
                let nproducttypecode = [];
                let nstorageconditioncode = [];
                let selectedRecord = {};

                const bulkTypeMap = constructOptionList(response[0].data || [], "nbulktypecode",
                    "sbulktype", undefined, undefined, true);
                const bulkTypeList = bulkTypeMap.get("OptionList");

                const productDescriptionMap = constructOptionList(response[1].data || [], "nproductdesccode",
                    "sproductclass", undefined, undefined, true);
                const productDescriptionList = productDescriptionMap.get("OptionList");

                const productTypeMap = constructOptionList(response[2].data || [], "nproducttypecode",
                    "sproducttype", undefined, undefined, true);
                const productTypeList = productTypeMap.get("OptionList");

                const storageConditionMap = constructOptionList(response[3].data || [], "nstorageconditioncode",
                    "sstorageconditionname", undefined, undefined, true);
                const storageConditionList = storageConditionMap.get("OptionList");


                if (fetchRecordParam.operation === "update") {
                    // nbulktypecode.push({
                    //     label: response[4].data["sbulktype"],
                    //     value: response[4].data["nbulktypecode"]
                    // });

                    // nproductdesccode.push({
                    //     label: response[4].data["sfinalproduct"],
                    //     value: response[4].data["nproductdesccode"]
                    // });

                    // nproducttypecode.push({
                    //     label: response[4].data["nproducttypecode"] === -1 ? "" : response[4].data["supstreamproduct"],
                    //     value: response[4].data["nproducttypecode"] === -1 ? "" : response[4].data["nproducttypecode"]
                    // });

                    // nstorageconditioncode.push({
                    //     label: response[4].data["sstorageconditionname"],
                    //     value: response[4].data["nstorageconditioncode"]
                    // });

                    selectedRecord = response[4].data;

                    //  selectedRecord["nproducttypecode"] = response[4].data["nproducttypecode"] === -1 ? "" : response[4].data["nproducttypecode"]
                    selectedRecord["nbulktypecode"] = {
                        label: response[4].data["sbulktype"],
                        value: response[4].data["nbulktypecode"]
                    };
                    selectedRecord["nproductdesccode"] = {
                        label: response[4].data["sfinalproduct"],
                        value: response[4].data["nproductdesccode"]
                    };

                    if (response[4].data["nproducttypecode"] && response[4].data["nproducttypecode"] <= 0) {
                        selectedRecord["nproducttypecode"] = undefined;
                    }
                    else {
                        selectedRecord["nproducttypecode"] = {
                            label: response[4].data["supstreamproduct"],
                            value: response[4].data["nproducttypecode"]
                        };
                    }

                    selectedRecord["nstorageconditioncode"] = {
                        label: response[4].data["sstorageconditionname"],
                        value: response[4].data["nstorageconditioncode"]
                    };
                }

                if (fetchRecordParam.operation !== "update") {
                    selectedRecord["ntransactionstatus"] = 1;
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        bulkType: bulkTypeList, productDescription: productDescriptionList,
                        productType: productTypeList, storageCondition: storageConditionList,
                        nbulktypecode: nbulktypecode, nproductdesccode: nproductdesccode, nproducttypecode: nproducttypecode, nstorageconditioncode: nstorageconditioncode,

                        selectedRecord: fetchRecordParam.operation === "update" ? selectedRecord : selectedRecord,
                        requiredSymbol: fetchRecordParam.operation === "update" && response[4].data.nproducttypemand === 3 ? 1 : 0,
                        operation: fetchRecordParam.operation,
                        screenName: "IDS_COMPONENT",
                        openModal: true, ncontrolCode: fetchRecordParam.ncontrolCode,
                        loading: false, selectedId
                    }
                });
            }))

            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                console.log("Error In Component : ", error);
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })

    }
}