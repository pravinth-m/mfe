import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { sortData } from '../components/CommonScript'//, getComboLabelValue, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getSupplierDetail(supplier, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("supplier/getSupplier", {
            nsuppliercode: supplier.nsuppliercode,
            "userinfo": userInfo
        })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {

                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
    }
}

export function getSupplierComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        if (operation === "create" || (operation === "update" && masterData.SelectedSupplier.ntransactionstatus !== transactionStatus.RETIRED)) {


            const countryService = rsapi.post("country/getCountry", { userinfo: userInfo });

            let urlArray = [];
            if (operation === "create") {

                urlArray = [countryService];
            }
            else {
                const supplierById = rsapi.post("supplier/getActiveSupplierById", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });//this.props.Login.userInfo

                urlArray = [countryService, supplierById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let country = [];

                    let selectedRecord = {};

                    if (operation === "update") {
                        selectedRecord = response[1].data;

                        country.push({ "value": response[1].data["ncountrycode"], "label": response[1].data["scountryname"] });


                        selectedRecord["ncountrycode"] = country[0];


                    }
                    else {
                        selectedRecord["ntransactionstatus"] = 1;


                    }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            countryList: response[0].data || [],

                            operation, screenName, selectedRecord, openModal: true,
                            ncontrolCode, loading: false
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            //toast.warn(this.props.formatMessage({ id: masterData.SelectedSupplier.stranstatus }));
            toast.warn(intl.formatMessage({ id: masterData.SelectedSupplier.stranstatus }));
        }
    }
}


export function getSupplierCategoryComboDataService(supplierparam) {
    return function (dispatch) {
        if (supplierparam.masterData.SelectedSupplier.ntransactionstatus !== transactionStatus.RETIRED) {

            const contactData = {
                "nsuppliercode": supplierparam.masterData.SelectedSupplier.nsuppliercode,
                "userinfo": supplierparam.userInfo

            };

            const contactService = rsapi.post("suppliercategory/getSupplierCategoryBySupplierCode", contactData);

            let urlArray = [];
            if (supplierparam.operation === "create") {

                urlArray = [contactService];
            }
            else {
                const contactById = rsapi.post("suppliercategory/getActiveSupplierCategoryById", { [supplierparam.primaryKeyField]: supplierparam.primaryKeyValue, "userinfo": supplierparam.userInfo });
                urlArray = [contactService, contactById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let selectedRecord = {};
                    //let selectedSupplierCategory = {};
                    if (supplierparam.operation === "update") {
                        selectedRecord = response[1].data;


                        selectedRecord["nsuppliercatcode"] = response[1].data["nsuppliercatcode"];
                    }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            supplierCategory: response[0].data || [],
                            selectedSupplierCategory: [],

                            selectedRecord,
                            openChildModal: true,

                            operation: supplierparam.operation, screenName: supplierparam.screenName,
                            ncontrolCode: supplierparam.ncontrolCode, loading: false
                        }
                    });

                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            //toast.warn(this.props.formatMessage({ id: supplierparam.masterData.SelectedSupplier.stranstatus }));
            toast.warn(intl.formatMessage({ id: supplierparam.masterData.SelectedSupplier.stranstatus }));
        }
    }
}


export function getMaterialCategoryComboDataService(materialparam) {
    return function (dispatch) {
        if (materialparam.masterData.SelectedSupplier.ntransactionstatus !== transactionStatus.RETIRED) {

            const materialData = {
                "nsuppliercode": materialparam.masterData.SelectedSupplier.nsuppliercode,
                "userinfo": materialparam.userInfo

            };

            const materialService = rsapi.post("materialcategory/getMaterialCategoryBYSupplierCode", materialData);

            let urlArray = [];
            if (materialparam.operation === "create") {

                urlArray = [materialService];
            }
            else {
                const contactById = rsapi.post("suppliercategory/getActiveSupplierCategoryById", { [materialparam.primaryKeyField]: materialparam.primaryKeyValue, "userinfo": materialparam.userInfo });
                urlArray = [materialService, contactById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let selectedRecord = undefined;
                    if (materialparam.operation === "update") {
                        selectedRecord = response[1].data;


                        selectedRecord["nsuppliercatcode"] = response[1].data["nsuppliercatcode"];
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            materialCategory: response[0].data || [],
                            selectedMaterialCategory: [],

                            selectedRecord,
                            openChildModal: true,

                            operation: materialparam.operation, screenName: materialparam.screenName,
                            ncontrolCode: materialparam.ncontrolCode, loading: false
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            //toast.warn(this.props.formatMessage({ id: materialparam.masterData.SelectedSupplier.stranstatus }));
            toast.warn(intl.formatMessage({ id: materialparam.masterData.SelectedSupplier.stranstatus }));
        }
    }
}

// export function filterColumnDataSupplier(filterValue, masterData, userInfo) {
//     return function (dispatch) {

//         let supplierCode = 0;
//         let searchedData = undefined;
//         if (filterValue === "") {
//             supplierCode = masterData["Supplier"][0].nsuppliercode;
//         }
//         else {

//             searchedData = searchData(filterValue, masterData["Supplier"], "ssuppliername");

//             if (searchedData.length > 0) {
//                 supplierCode = searchedData[0].nsuppliercode;
//             }
//             else {
//                 masterData["Supplier"] = [];
//                 masterData["SupplierCategory"] = [];
//                 masterData["MaterialCategory"] = [];
//                 masterData["SelectedSupplier"] = [];
//                 masterData["searchedData"] = [];
//                 dispatch({ type: DEFAULT_RETURN, payload: { masterData } });
//             }

//         }
//         dispatch(initRequest(true));
//         return rsapi.post("supplier/getSupplier", { nsuppliercode: supplierCode, userinfo: userInfo })
//             .then(response => {
//                 masterData["Supplier"] = response.data["Supplier"];
//                 masterData["SupplierCategory"] = response.data["SupplierCategory"];
//                 masterData["MaterialCategory"] = response.data["MaterialCategory"];
//                 masterData["SelectedSupplier"] = response.data["SelectedSupplier"];
//                 masterData["searchedData"] = searchedData;

//                 dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })



//     }
// }

