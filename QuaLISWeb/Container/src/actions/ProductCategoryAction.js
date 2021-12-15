import { toast } from "react-toastify";
import { intl } from "../components/App";
import rsapi from "../rsapi";
import { initRequest } from "./LoginAction";
import { DEFAULT_RETURN } from "./LoginTypes";

// export const openProductCategoryModal = (screenName, ncontrolCode) => {
//     return (dispatch) => {
//         dispatch({type: DEFAULT_RETURN, payload:{selectedRecord : {}, screenName: screenName,
//             operation: "create", openModal: true, ncontrolCode}});
//     }
// }


export const openProductCategoryModal=(screenName, ncontrolCode) =>{
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.get("/productcategory/addproductcategory")
            .then(response => {
              //  const masterData = { ...data, ...response.data ,searchedData: undefined}
                //sortData(masterData);
                dispatch({type: DEFAULT_RETURN, 
                    payload:{
                        selectedRecord : {}, 
                        layout:response.data,
                    screenName: screenName,
                    operation: "create",loading:false, 
                    openModal: true, ncontrolCode}});
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                toast.error(intl.formatMessage({ id: error.message }));
            });
    }
}
