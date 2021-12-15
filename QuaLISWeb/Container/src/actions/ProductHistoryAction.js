import rsapi from '../rsapi';

import {
    toast
} from 'react-toastify';
import {
    sortData,
    searchData
} from '../components/CommonScript'
import {
    DEFAULT_RETURN
} from './LoginTypes';

export function selectProductHistoryDetail(ProductHistory, masterData, userInfo) {
    return function (dispatch) {
        rsapi.post("/producthistory/getProductManufByProductID", {
            "nproducthistorycode":
                parseInt(ProductHistory.nproducthistorycode),
            'userinfo': userInfo
        })
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData
                    }
                });
                console.log(response.data);
            })
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }

            })
    }
}

export function filterProductHistoryColumnData(filterValue, masterData, userInfo) {
    return function (dispatch) {

        let productHistoryCode = 0;
        let searchedData = undefined;
        if (filterValue === "") {
            productHistoryCode = masterData["ProductHistory"][0].nproducthistorycode;
        } else {
            searchedData = searchData(filterValue, masterData["ProductHistory"]);

            if (searchedData.length > 0) {
                productHistoryCode = searchedData[0].nproducthistorycode;
            }
        }

        if (productHistoryCode !== 0) {
            return rsapi.post("producthistory/getProductManufByProductID", {
                nproducthistorycode: parseInt(productHistoryCode),
                userinfo: userInfo
            })
                .then(response => {

                    masterData["searchedData"] = searchedData;
                    masterData["selectedProductHistory"] = response.data["selectedProductHistory"];
                    masterData["ProductManufacturerHistory"] = response.data["ProductManufacturerHistory"];
                    masterData["ProductMAholderHistory"] = response.data["ProductMAholderHistory"]

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData
                        }
                    });
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            masterData["searchedData"] = [];
            masterData["selectedProductHistory"] = [];
            masterData["ProductManufacturerHistory"] = [];
            masterData["ProductMAholderHistory"] = []
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData
                }
            });
        }
    }
}

export function getProductMaHolderHistory(inputParam) {
    return function (dispatch) {

        let ProductMaholderHistory = inputParam.objProductManufacturerHistory
        let Map = {};
        Map["nproductmanufhistorycode"] = parseInt(ProductMaholderHistory.nproductmanufhistorycode);
        Map["userinfo"] = inputParam.userInfo;

        rsapi.post("/producthistory/getproductMAholderHistoryByID", Map)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData:{
                            ...inputParam.masterData,
                            ProductMAholderHistory: response.data,
                            SelectedProductManufHistory:inputParam.objProductManufacturerHistory
                        }
                    }
                });
            })
            .catch(error => {
                console.log(error);
            })
    }
}
