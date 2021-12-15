import { toast } from 'react-toastify';
import rsapi from '../rsapi';
import { initRequest, updateStore } from './LoginAction';
import { DEFAULT_RETURN, REQUEST_FAILURE } from './LoginTypes';
import { sortData, searchData, replaceUpdatedObject } from '../components/CommonScript';
import { intl } from '../components/App';
// import {selectedDashBoardView} from './DashBoardTypeAction';


export const callService = (inputParam) => {
  return (dispatch) => {
    dispatch(initRequest(true));
    return rsapi.post(inputParam.classUrl + "/get" + inputParam.methodUrl, inputParam.inputData)
      .then(response => {
        
        let data = response.data;
        sortData(data);
    
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { masterData: [], organisation: undefined, }
        }
        dispatch(updateStore(updateInfo))

        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            masterData: data,
            activeTestTab: data.activeTestTab,
            activeTestKey: data.activeTestKey,
            activeBCTab: data.activeBCTab,
            inputParam: inputParam,
            masterStatus: "",
            userInfo: inputParam.inputData.userinfo,
            loading: false, selectedId: null, selectedRecord: {},
            dataState: undefined,
            organisation: {
              selectedNode: data.SelectedNode, selectedNodeName: data.SelectedNodeName,
              primaryKeyValue: data.AddedChildPrimaryKey
            },
            displayName: inputParam.displayName,
            reportFilePath: undefined
          }
        })
        // }

      })
      .catch(error => {
        if (error.response === undefined && error === "Network Error") {
          dispatch({
            type: REQUEST_FAILURE,
            payload: {
              error: "Network Error",
              loading: false,
            }
          });
        } else if (error.response.status === 417) {
          toast.warning(error.response.data);
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } });
        } else {
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } })
        }
      })
  };
};

//Start- Add /Edit/Delete Master Data
export function crudMaster(inputParam, masterData, modalName, defaultInput) {
  return function (dispatch) {
    dispatch(initRequest(true));
    let requestUrl = '';
    if (inputParam.isFileupload) {
      const formData = inputParam.formData;
      formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
      requestUrl = rsapi.post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, formData);
    } else {
      requestUrl = rsapi.post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
    }
    return requestUrl
      .then(response => {
        if (response.status === 202) {
          //HttpStatus:Accepted
          //Use this block when u need to display any success message
    
          dispatch({
            type: DEFAULT_RETURN, payload: {
              loadEsign: false,
              [modalName]: false,
              loading: false
            }
          })
          toast.success(response.data);
        }
        else if (response.status === 208) {
          //HttpStatus:Accepted
          //208-Already Reported
          dispatch({
            type: DEFAULT_RETURN, payload: {
              loadEsign: false,
              [modalName]: false,
              loading: false
            }
          })
          toast.warn(response.data);
        }
        else {
          const retrievedData = sortData(response.data);
          if (masterData === undefined || Array.isArray(retrievedData)) {
            masterData = retrievedData;
          }
          else {
            masterData = {
              ...masterData,
              ...retrievedData
            };
            if (modalName === "openModal" && inputParam.operation !== "delete"
              && inputParam.operation !== "create" && inputParam.operation !== "copy") {

              if (inputParam.postParam) {
                if (masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]) {
                  const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                    x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                  );
                  masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject];
                } else {
                  const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                    x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][0][inputParam.postParam.primaryKeyField]
                  );
                  masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject][0];
                }
              }
            }
            else if (modalName === "openModal" && inputParam.operation === "create") {
              if (inputParam.postParam && inputParam.postParam.isSingleGet) {
                masterData[inputParam.postParam.inputListName].push(response.data[inputParam.postParam.selectedObject]);
                //masterData[inputParam.postParam.selectedObject] = response.data;
                sortData(masterData);
              }
            }
            else if (modalName === "openChildModal" && inputParam.operation === "create") {//searchedData
              if (inputParam.postParam && inputParam.postParam.isSingleGet) {
                const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                  x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                );
                masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject];
              
                if (masterData["searchedData"] !== undefined)
                {
                  const foundIndex = masterData["searchedData"].findIndex(
                    x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                  );
                  masterData["searchedData"][foundIndex] = masterData[inputParam.postParam.selectedObject];
                
                }
                sortData(masterData);
              }
            }
            else if (modalName === "openModal" && inputParam.operation === "copy") {
              if (inputParam.postParam && inputParam.postParam.isSingleGet) {
                masterData[inputParam.postParam.inputListName].push(response.data[inputParam.postParam.selectedObject]);
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
              }
            }
            else if (modalName === "openModal" && inputParam.operation === "delete") {
              if (inputParam.postParam && inputParam.postParam.isSingleGet) 
              {
                if (inputParam.postParam.task === "cancel"){
                  const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                    x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                  );
                  masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject];
                }
                else{
                    const list = masterData[inputParam.postParam.inputListName]
                      .filter(item => item[inputParam.postParam.primaryKeyField] !== inputParam.postParam.primaryKeyValue)
                    masterData[inputParam.postParam.inputListName] = list;

                    // const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                    //   x => x[inputParam.postParam.primaryKeyField] === inputParam.postParam.primaryKeyField
                    // );
                    // masterData[inputParam.postParam.inputListName].splice(foundIndex, 1)         
                  
                }
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
              }
            }
          }
          // (masterData);

          let openModal = false;
          let selectedRecord = {};
          let activeSampleTab = inputParam.activeSampleTab ? { activeSampleTab: inputParam.activeSampleTab } : ''
          let activeTestKey = inputParam.activeTestKey ? { activeTestKey: inputParam.activeTestKey } : ''
          let showSample = inputParam.showSample ? inputParam.showSample : ''
          let respObject = {
            masterData,
            inputParam,
            modalName,
            //modalName:undefined,
            [modalName]: openModal,
            operation: inputParam.operation,
            masterStatus: "",
            errorCode: undefined,
            loadEsign: false,
            showEsign: false,
            selectedRecord,
            loading: false,
            dataState: inputParam.dataState,
            selectedId: inputParam.selectedId,
            ...activeSampleTab,
            ...activeTestKey,
            showSample,
            design : [],
            //organisation: undefined
            organisation: inputParam.nextNode ? {
              selectedNode: inputParam.nextNode,
              selectedNodeName: masterData.SelectedNodeName,
              primaryKeyValue: masterData.AddedChildPrimaryKey,

            } : undefined,
            showConfirmAlert: inputParam.showConfirmAlert,
            loadPoolSource: inputParam.loadPoolSource,
            skip:inputParam.skip||undefined,
            take:inputParam.take||undefined
          }

          if (inputParam.operation === "create" || inputParam.operation === "copy") {
            if (inputParam.saveType === 2) {
              openModal = true;
              selectedRecord = defaultInput;

            }
            respObject = { ...respObject, [modalName]: openModal, selectedRecord };
          }
          if ((modalName === "openModal" || modalName === "openChildModal") && Object.keys(masterData).indexOf("searchedData") !== -1
            && masterData["searchedData"] !== undefined) {
            dispatch(postCRUDOrganiseSearch(inputParam.postParam, respObject))
          }
          else {
            dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, modalName: undefined } })
          }
        }
      })
      .catch(response => {
        if (response.response.status === 500) {
          dispatch({
            type: REQUEST_FAILURE,
            payload: {
              error: response.message,
              loading: false
            }
          });
        } else {
          if (inputParam.operation === "delete" || inputParam.operation === "receive" ||
            inputParam.operation === 'approve' || inputParam.operation === "correction"
            || inputParam.operation === "complete" || inputParam.operation === "dynamic"
            || inputParam.operation === "setDefault" || inputParam.operation === "reset"
            || inputParam.operation === "xml"||inputParam.operation === 'blackList') {
            dispatch({
              type: DEFAULT_RETURN,
              payload: {
                masterStatus: response.response.data,
                errorCode: response.response.status,
                loadEsign: false,
                [modalName]: false,
                loading: false
              }
            });
          } else {
            dispatch({
              type: DEFAULT_RETURN,
              payload: {
                masterStatus: response.response.data,
                errorCode: response.response.status,
                loadEsign: false, loading: false
              }
            });
          }

        }
      });
  }
}

export const validateEsignCredential = (inputParam, modalName) => {
  return (dispatch) => {
    dispatch(initRequest(true));
    return rsapi.post("login/validateEsignCredential", inputParam.inputData)
      .then(response => {
        if (response.data === "Success") {

          const methodUrl = inputParam["screenData"]["inputParam"]["methodUrl"];
          inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

          if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
            inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
          }
          dispatch(crudMaster(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName))
        }
      })
      .catch(error => {
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response.status === 500) {
          toast.error(intl.formatMessage({ id: error.message }));
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
      })
  };
};

export const fetchRecord = (fetchRecordParam) => {
  return (dispatch) => {
console.log('child Action called')
    dispatch(initRequest(true));
    const url = fetchRecordParam.inputParam.classUrl + "/getActive" + fetchRecordParam.inputParam.methodUrl + "ById";
    rsapi.post(url, {
      [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo
    })
      .then(response => {
       let  selectedRecord={...response.data,...JSON.parse(response.data.jsonstring)}
        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            selectedRecord,
            screenName: fetchRecordParam.screenName,
            operation: fetchRecordParam.operation,
            openModal: true,
            ncontrolCode: fetchRecordParam.ncontrolCode,
            loading: false,
            selectedId: fetchRecordParam.primaryKeyValue
          }
        });
      })
      .catch(error => {
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response.status === 500) {
          toast.error(intl.formatMessage({ id: error.message }));
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
      })
  }
}

export function filterColumnData(filterValue, filterParam) {
  return function (dispatch) {

    let masterData = filterParam.masterData;

    let primaryKeyValue = 0;
    let searchedData = undefined;
    if (filterValue === "") {
      if (masterData[filterParam.inputListName] && masterData[filterParam.inputListName].length > 0) {
        primaryKeyValue = masterData[filterParam.inputListName][0][filterParam.primaryKeyField];
      }
    }
    else {

      searchedData = searchData(filterValue, masterData[filterParam.inputListName], filterParam.searchFieldList || []);

      if (searchedData.length > 0) {
        primaryKeyValue = searchedData[0][filterParam.primaryKeyField];
      }
    }

    if (primaryKeyValue !== 0) {
      dispatch(initRequest(true));
      return rsapi.post(filterParam.fetchUrl, { ...filterParam.fecthInputObject, [filterParam.primaryKeyField]: primaryKeyValue })
        .then(response => {
              masterData["searchedData"] = searchedData;
              masterData = { ...masterData, ...response.data };
             
              if (filterParam.inputListName === "DashBoardView"){
                  // dispatch(selectedDashBoardView(response, masterData));
              }
              else{
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
              }
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
      masterData[filterParam.selectedObject] = undefined;
      masterData["searchedData"] = [];
      Object.keys(masterData).forEach(item => {
        if (item !== filterParam.inputListName && item !== filterParam.selectedObject
          && filterParam.unchangeList && filterParam.unchangeList.indexOf(item) === -1)
          masterData[item] = [];
      })
      dispatch({
        type: DEFAULT_RETURN, payload: {
          masterData, operation: null, modalName: undefined,
          loading: false
        }
      });
    }
  }
}


export function postCRUDOrganiseSearch(postParam, respObject) {
  return function (dispatch) {

    let masterData = respObject.masterData;

    if (respObject.inputParam.operation === "create" || respObject.inputParam.operation === "copy") {
      if (respObject.modalName === "openModal") {
        if (respObject.inputParam.isChild === undefined) {
          respObject.inputParam.searchRef.current.value = "";
          masterData["searchedData"] = undefined;
        }
      }
      dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData, modalName: undefined } })
    }
    else if (respObject.inputParam.operation === "delete") {

      if (masterData["searchedData"] !== undefined && respObject.modalName === "openModal") {
        let temp = masterData["searchedData"];
        let primaryKeyValue = respObject.masterData["searchedData"][0][postParam.primaryKeyField];
        if (respObject.inputParam.isChild === undefined) {          

          temp = masterData["searchedData"].filter(item => Array.isArray(postParam.primaryKeyValue) ?
            !postParam.primaryKeyValue.includes(item[postParam.primaryKeyField])
            : item[postParam.primaryKeyField] !== postParam.primaryKeyValue);

        }
        else {
          primaryKeyValue = masterData[postParam.selectedObject][postParam.primaryKeyField];
        }
        masterData["searchedData"] = temp;
        respObject = { ...respObject, modalName: undefined };
        if (masterData["searchedData"].length > 0) {
          return rsapi.post(postParam.fetchUrl, {
            ...postParam.fecthInputObject, [postParam.primaryKeyField]: primaryKeyValue
          })
            .then(response => {
              masterData = { ...masterData, ...response.data };
              sortData(masterData);
              dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } });
            })
            .catch(error => {
              dispatch({ type: DEFAULT_RETURN, payload: { ...respObject } })
              if (error.response.status === 500) {
                toast.error(intl.formatMessage({ id: error.message }));
              }
              else {
                toast.warn(intl.formatMessage({ id: error.response.data }));
              }
            })
        }
        else {
          masterData[postParam.selectedObject] = undefined;
          masterData["searchedData"] = [];
          Object.keys(masterData).forEach(item => {
            if (item !== postParam.inputListName && item !== postParam.selectedObject
              && postParam.unchangeList && postParam.unchangeList.indexOf(item) === -1)
              masterData[item] = [];
          })

          dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } });
        }
      }
      else {
        dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData, modalName: undefined } });
      }
    }
    else {
      respObject = { ...respObject, modalName: undefined };
      if (masterData["searchedData"] !== undefined) {
        if (masterData[postParam.selectedObject][postParam.primaryKeyField]) {

          const foundIndex = masterData["searchedData"].findIndex(
            x => x[postParam.primaryKeyField] === masterData[postParam.selectedObject][postParam.primaryKeyField]
          );
          masterData["searchedData"][foundIndex] = masterData[postParam.selectedObject];
        } else {
          const foundIndex = masterData["searchedData"].findIndex(
            x => x[postParam.primaryKeyField] === masterData[postParam.selectedObject][0][postParam.primaryKeyField]
          );
          masterData["searchedData"][foundIndex] = masterData[postParam.selectedObject][0];
        }
      }
      dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } });
    }

  }
}
export const viewAttachment = (inputParam) => {
  return (dispatch) => {
    let inputData = { ...inputParam.inputData }
    if (inputData['selectedRecord']) {
      delete inputData['selectedRecord']['expanded'];
    }
    dispatch(initRequest(true));
    rsapi.post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, inputData)
      .then(response => {
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        let value="";
        if (response.data["AttachFile"]) {
          document.getElementById("download_data").setAttribute("href", response.data.FilePath);
          document.getElementById("download_data").click();
        } else {
          value = response.data["AttachLink"];
          var win = window.open(value, '_blank');
          if (win) {
            win.focus();
          } else {
            intl.warn('IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE');
          }
        }
        
        
        
      
        
      })
      .catch(error => {
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response.status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(error.response.data);
        }
      });
  }
}
export function filterTransactionList(filterValue, filterParam, filteredListName) {
  return function (dispatch) {
    let masterData = filterParam.masterData;
    filteredListName = filteredListName || "searchedData"
    let primaryKeyValue = 0;
    let searchedData = undefined;
    let selectedData = []
    filterParam.childRefs && filterParam.childRefs.map(childref => {
      if (childref.ref !== undefined && childref.ref.current !== null) {
        childref.ref.current.value = "";
        masterData[childref.childFilteredListName] = undefined
      }
      return null;
    })
    if (filterValue === "") {
      if (masterData[filterParam.inputListName] && masterData[filterParam.inputListName].length > 0) {
        primaryKeyValue = masterData[filterParam.inputListName][0][filterParam.primaryKeyField];
        selectedData.push(masterData[filterParam.inputListName][0])
      }
    }
    else {
      if (masterData[filterParam.inputListName]) {
        searchedData = searchData(filterValue, masterData[filterParam.inputListName], filterParam.searchFieldList || []);
      } else {
        searchedData = []
      }

      if (searchedData.length > 0) {
        primaryKeyValue = searchedData[0][filterParam.primaryKeyField];
        selectedData.push(searchedData[0])
      }
    }

    if (primaryKeyValue !== 0) {
      primaryKeyValue = filterParam.isSingleSelect ? primaryKeyValue : String(primaryKeyValue)
      dispatch(initRequest(true));
      return rsapi.post(filterParam.fetchUrl, { ...filterParam.fecthInputObject, [filterParam.primaryKeyField]: primaryKeyValue })
        .then(response => {
          const dataState={
            skip:0,
            take:10
          }
          masterData[filteredListName] = searchedData;
          masterData[filterParam.selectedObject] = selectedData
          masterData = { ...masterData, ...response.data };
          //sortData(masterData);
          dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, skip: 0, take: 10, testskip: 0, testtake: 10,dataState } });
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
      masterData[filterParam.selectedObject] = undefined;
      masterData[filteredListName] = [];
      filterParam.changeList.map(name => masterData[name] = [])
      // Object.keys(masterData).forEach(item=> {
      //   if (item !== filterParam.inputListName && item !== filterParam.selectedObject 
      //     && filterParam.unchangeList && filterParam.unchangeList.indexOf(item) ===-1)
      //       masterData[item] = [];
      //   })   
      dispatch({
        type: DEFAULT_RETURN, payload: {
          masterData, operation: null, modalName: undefined,
          loading: false
        }
      });
    }
  }

}
export function postCRUDOrganiseTransSearch(postParamList, respObject) {
  return function (dispatch) {
    let masterData = respObject.masterData;
    postParamList && Array.isArray(postParamList) && postParamList.map((postParam, index) => {
      if (postParam.clearFilter === 'yes') {

        postParam.searchRef.current.value = "";
        masterData[postParam.filteredListName] = undefined;
        postParam.childRefs && postParam.childRefs.map(childref => {
          if (childref.ref !== undefined && childref.ref.current !== null) {
            childref.ref.current.value = "";
            masterData[childref.childFilteredListName] = undefined
          }
          return null;
        })

      }
      if (Object.keys(masterData).indexOf(postParam.filteredListName) !== -1 && masterData[postParam.filteredListName] !== undefined) {

        if (postParam.clearFilter === 'check') {
          if (masterData[postParam.filteredListName] !== undefined) {
            const temp = masterData[postParam.filteredListName].filter(item => !Array.isArray(postParam.primaryKeyValue) ? postParam.primaryKeyValue : postParam.primaryKeyValue.includes(item[postParam.primaryKeyField]));
            masterData[postParam.filteredListName] = temp;

            if (masterData[postParam.filteredListName].length > 0) {
              return rsapi.post(postParam.fetchUrl, { ...postParam.fecthInputObject.fecthInputObject, [postParam.primaryKeyField]: String(respObject.masterData[postParam.filteredListName][0][postParam.primaryKeyField]) })
                .then(response => {
                  masterData = { ...masterData, ...response.data };
                })
            }
          }
        }
        else {
          if (masterData[postParam.filteredListName] !== undefined) {
            masterData[postParam.filteredListName] = replaceUpdatedObject(masterData[postParam.updatedListname], masterData[postParam.filteredListName], postParam.primaryKeyField)
          }
        }
      }
      return null;
    })
    //sortData(masterData);
    dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } })
  }
}
export function showUnderDevelopment() {
  return function (dispatch) {
    toast.info(intl.formatMessage({ id: "IDS_UNDERDEVELOPMENT"}));
  }
}