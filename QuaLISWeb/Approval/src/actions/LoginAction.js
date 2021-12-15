import {
    DEFAULT_RETURN,
    UPDATE_LANGUAGE,
    REQUEST_INIT
} from './LoginTypes';
import rsapi from "../rsapi";
import {
    intl
} from '../components/App';
import {
    toast
} from 'react-toastify';
import {
    constructOptionList, rearrangeDateFormat
} from '../components/CommonScript';
import {
    getRandomColor
} from '../components/header/headerutils';

export const initRequest = (loading) => {
    return {
        type: REQUEST_INIT,
        payload: loading
    }
}

export const parentToChild = (Login) => {
    console.log('dispatch',Login)
    return {
        type: DEFAULT_RETURN,
        payload: Login
    }
}


export const navPage = (data) => dispatch => {
    dispatch({
        type: DEFAULT_RETURN,
        payload: {
            navigation: data
        }
    });
}

export const changeLanguage = (language, selectedRecord) => (dispatch) => {
    dispatch({
        type: UPDATE_LANGUAGE,
        payload: {
            language,
            selectedRecord
        }
    })
}

export const clickOnLoginButton = (inputData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post(inputData.url, inputData)
            .then(response => {
                const returnStr = response.data["rtn"];
                if (returnStr.toUpperCase() === "SUCCESS") {
                    const responseData = response.data;
                    const PassFlag = responseData.PassFlag;
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openCPModal: response.data.PassFlag === 6 || PassFlag === 55 ? true : false,
                            passwordPolicy: response.data.PasswordPolicy,
                            screenName: PassFlag === 6 ? "IDS_CREATEPASSWORD" : PassFlag === 55 ? "IDS_CHANGEPASSWORD" : "",
                            PassFlag,
                            userInfo: {
                                nlogintypecode: inputData.nlogintypecode
                            }
                        }
                    });
                    if (responseData.PassFlag !== 6 && responseData.PassFlag !== 55) {
                        const inputParam = {
                            userInfo: responseData.UserInfo,
                            menuDesign: responseData.MenuDesign,
                            navigation: inputData.navigation,
                            userRoleControlRights: responseData.UserRoleControlRights,
                            userFormControlProperties: responseData.UserFormControlproperties,
                            transactionValidation: responseData.TransactionValidation,
                            displayName: "",
                            userMultiRole: responseData.UserMultiRole,
                            settings: responseData.Settings,
                            sdmselnsettings: responseData.SDMSELNSettings,
                            deputyUser: response.data.DeputyUser,
                            deputyUserRole: response.data.DeputyUserRole,
                            isDeputyLogin: false,
                            loading: false,
                            userImagePath: responseData.UserImagePath,
                            //profileColor: "#002699",
                            profileColor: responseData.UserImagePath === "" ? getRandomColor([240, 360], [90, 100], [0, 95], [1, 1]) : "#ff0000",
                            idleneed: true
                        }
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: inputParam
                        });

                       // dispatch(getListStaticDashBoard(responseData.UserInfo, 1));
                       // dispatch(getHomeDashBoard(responseData.UserInfo, 0, false));
                      //  dispatch(getListAlert(responseData.UserInfo, true));
                        if (responseData.PasswordAlertDay) {
                            toast.info(intl.formatMessage({
                                id: "IDS_PASSWORDEXPIRY"
                            }) + " " + responseData.PasswordAlertDay + " " + intl.formatMessage({
                                id: "IDS_DAY"
                            }))
                        }
                    }
                } else {
                    toast.warn(intl.formatMessage({
                        id: returnStr
                    }));
                }
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const submitChangeRole = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getuserscreenrightsmenu", inputParam)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        userInfo: response.data.UserInfo,
                        menuDesign: response.data.MenuDesign,
                        userRoleControlRights: response.data.UserRoleControlRights,
                        userMultiRole: response.data.UserMultiRole,
                        deputyUser: response.data.DeputyUser,
                        deputyUserRole: response.data.DeputyUserRole,
                        loading: false,
                        masterData: [],
                        displayName: "",
                        navigation: "home",
                        inputParam: {},
                        openRoleBox: false
                    }
                });
                // dispatch(getListStaticDashBoard(response.data.UserInfo, 1));
                // dispatch(getHomeDashBoard(response.data.UserInfo, 0, false));
                // dispatch(getListAlert(response.data.UserInfo));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const updateStore = (updateInfo) => dispatch => {
    if (updateInfo.data.loadEsign === true) {
        dispatch(initRequest(true));
        rsapi.post("/timezone/getLocalTimeByZone", {
                "userinfo": updateInfo.data.screenData.inputParam.inputData.userinfo
            })
            .then(response => {
                dispatch({
                    type: updateInfo.typeName,
                    payload: {
                        serverTime: rearrangeDateFormat(updateInfo.data.screenData.inputParam.inputData.userinfo, response.data),
                        ...updateInfo.data,
                        masterStatus: "",
                        errorCode: undefined,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    } else {
        dispatch({
            type: updateInfo.typeName,
            payload: {
                ...updateInfo.data,
                masterStatus: "",
                errorCode: undefined
            }
        });
    }
}

export const getChangeUserRole = (userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getchangerole", {
                "userinfo": userInfo
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...response.data,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const getLoginDetails = () => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getloginInfo", {})
            .then(response => {
                const loginTypeMap = constructOptionList(response.data.LoginType || [], "nlogintypecode", "sdisplayname", false, false, true);
                const languageMap = constructOptionList(response.data.Language || [], "slanguagetypecode", "slanguagename", false, false, true);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loginTypeList: loginTypeMap.get("OptionList"),
                        languageList: languageMap.get("OptionList"),
                        selectedRecord: {
                            nlogintypecode: loginTypeMap.get("DefaultValue") ? loginTypeMap.get("DefaultValue") : "",
                            nlanguagecode: languageMap.get("DefaultValue") ? languageMap.get("DefaultValue") : ""
                        },
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const getUserSiteAndRole = (inputParam, selectedRecord) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getloginvalidation", {
                ...inputParam
            })
            .then(response => {
                const roleMap = constructOptionList(response.data.UserMultiRole || [], "nusermultirolecode", "suserrolename", false, false, true, "ndefaultrole");
                const siteMap = constructOptionList(response.data.Site || [], "nusersitecode", "ssitename", false, false, true, "ndefaultsite");
                let loggeInLoginTypeCode = response.data.Users.nlogintypecode;
                let logintypecode = inputParam.logintype.filter(x => x.value === loggeInLoginTypeCode);
                if (inputParam.logintype.length > 0 && logintypecode.length === 0) {
                        logintypecode = inputParam.logintype;
                        loggeInLoginTypeCode = logintypecode[0].value;
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loginUserRole: roleMap.get("OptionList"),
                        loginUserSite: siteMap.get("OptionList"),
                        selectedRecord: {
                            ...selectedRecord,
                            nusermultirolecode: roleMap.get("DefaultValue") ?
                                roleMap.get("DefaultValue") : roleMap.get("OptionList") ? roleMap.get("OptionList")[0] : "",
                            nusersitecode: siteMap.get("DefaultValue") ?
                                siteMap.get("DefaultValue") : siteMap.get("OptionList") ? siteMap.get("OptionList")[0] : "",
                            nusercode: response.data.Users.nusercode,
                            nlogintypecode: logintypecode ? logintypecode[0] : ""
                        },
                        openCPModal: response.data.PassFlag === 6 ? true : false,
                        passwordPolicy: response.data.PasswordPolicy,
                        screenName: "IDS_CREATEPASSWORD",
                        loading: false,
                        PassFlag: response.data.PassFlag,
                        createPwdRecord: {},
                        userInfo: {
                            nlogintypecode: loggeInLoginTypeCode
                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loginUserRole: [],
                        loginUserSite: [],
                        selectedRecord: {
                            ...selectedRecord,
                            nusermultirolecode: "",
                            nusersitecode: ""
                        }
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const createPassword = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/createnewpassword", {
                ...inputParam
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: false,
                        loading: false,
                        createPwdRecord: {}
                    }
                });
                toast.success(intl.formatMessage({
                    id: "IDS_PASSWORDCREATEDSUCCESSFULLY"
                }));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const changepassword = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/changepassword", {
                ...inputParam
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: false,
                        loading: false,
                        createPwdRecord: {},
                        navigation: "login"
                    }
                });
                toast.success(intl.formatMessage({
                    id: "IDS_PASSWORDCHANGEDSUCCESSFULLY"
                }));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const getPassWordPolicy = (nuserrolecode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getPassWordPolicy", {
                nuserrolecode
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: true,
                        loading: false,
                        createPwdRecord: {},
                        screenName: "IDS_CHANGEPASSWORD",
                        passwordPolicy: response.data.PasswordPolicy
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const changeOwner = (inputData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/changeOwner", {
                ...inputData
            })
            .then(response => {
                const responseData = response.data;
                const inputParam = {
                    userInfo: responseData.UserInfo,
                    menuDesign: responseData.MenuDesign,
                    userRoleControlRights: responseData.UserRoleControlRights,
                    userFormControlProperties: responseData.UserFormControlproperties,
                    transactionValidation: responseData.TransactionValidation,
                    displayName: "",
                    userMultiRole: responseData.UserMultiRole,
                    isDeputyLogin: true,
                    // settings: responseData.Settings,
                    // deputyUser: response.data.DeputyUser,
                    // deputyUserRole: response.data.DeputyUserRole,
                    loading: false,
                    masterData: [],
                    navigation: "home",
                    inputParam: {},
                    openRoleBox: false,
                    userImagePath: responseData.UserImagePath,
                    profileColor: responseData.UserImagePath === "" ? getRandomColor([240, 360], [90, 100], [0, 95], [1, 1]) : "#ff0000",
                    idleneed: true
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: inputParam
                });
                // dispatch(getListStaticDashBoard(response.data.UserInfo, 1));
                // dispatch(getHomeDashBoard(response.data.UserInfo, 0, false));
                // dispatch(getListAlert(response.data.UserInfo));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const logOutAuditAction = (inputData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post('login/insertAuditAction', {
                ...inputData,
                nFlag: 2
            })
            .then(response => {
                dispatch(navPage("login"))
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const elnLoginAction = (inputParam, serverUrl, uiUrl) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post(serverUrl, {
                ...inputParam
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (response !== null && response.data.objResponse !== null) {
                    if (response.data.objResponse.status) {
                        if (uiUrl) {
                            let user = response;
                            let elnURL = uiUrl + "#" + user.data.username + "$" + user.data.password;
                            window.open(elnURL, '_blank');
                        } else {
                            toast.info(intl.FormattedMessage({
                                id: "IDS_ELNUIURLNOTAVAILABLE"
                            }))
                        }
                    } else {
                        toast.info(response.data.objResponse.information);
                    }
                    // if(!$("#appsdetails").is(":hidden")){
                    //     $('#appsdetails').addClass("dp-none");
                    // }
                };

            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }
}

export const sdmsLoginAction = (inputParam, serverUrl, sdmsUIUrl) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post(serverUrl, {
                ...inputParam
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (response !== null && response.data.status) {
                    if (response.data.status) {
                        const sdmsURL = sdmsUIUrl + "?un=" + response.data.username + "&pd=" + response.data.password + "&sc=" + inputParam.sSiteCode;
                        window.open(sdmsURL, '_blank');
                    } else {
                        toast.info(response.Message);
                    }
                } else {
                    toast.info(intl.FormattedMessage({
                        id: "IDS_CHECKSYNCSERVICE"
                    }));
                }
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }
}


export const getUsersiteRole = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post('login/changeSite', {
                "usersSite": inputParam.selectedRecord.nusersitecode.item
            })
            .then(response => {
                const roleMap = constructOptionList(response.data.UserMultiRole || [], "nusermultirolecode", "suserrolename", false, false, true, "ndefaultrole");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loginUserRole: roleMap.get("OptionList"),
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            nusermultirolecode: roleMap.get("DefaultValue") ?
                                roleMap.get("DefaultValue") : roleMap.get("OptionList") ? roleMap.get("OptionList")[0] : ""


                        },
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }
}

export const checkPassword = (inputParam, selectedRecord) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getlogintypevalidation", {
                ...inputParam
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord: {
                            ...selectedRecord,
                            nusercode: response.data.Users.nusercode
                        },
                        userInfo: {
                            nlogintypecode: inputParam.nlogintypecode
                        },
                        openCPModal: response.data.PassFlag === 6 ? true : false,
                        passwordPolicy: response.data.PasswordPolicy,
                        screenName: "IDS_CREATEPASSWORD",
                        loading: false,
                        PassFlag: response.data.PassFlag,
                        createPwdRecord: {}
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}