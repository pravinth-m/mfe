import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    fillRecordBasedOnCheckBoxSelection,checkCancelAndReject,
    filterRecordBasedOnTwoArrays, getRecordBasedOnPrimaryKeyName, getSameRecordFromTwoArrays, replaceUpdatedObject, sortData, updatedObjectWithNewElement, rearrangeDateFormat, convertDateTimetoString
} from '../components/CommonScript'
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { intl } from '../components/App';
import { initRequest } from './LoginAction';
import { RegistrationSubType, RegistrationType, transactionStatus } from '../components/Enumeration';
import { crudMaster, postCRUDOrganiseTransSearch } from './ServiceAction'
import { getTestChildTabDetail } from './index.js'
import { constructOptionList } from '../components/CommonScript';

export function getSampleTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/getRegTypeBySampleType", Map)
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: { ...event.item }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });

            })
            .catch(error => {
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getRegTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        rsapi.post("/registration/getRegSubTypeByRegType", Map)
            .then(response => {
                // const RegistrationSubType = response.data["RegistrationSubType"];

                //  console.log(response.data);
                // RegistrationSubType.length > 0 ?
                //     selectedRecord["nregsubtypecode"] = {
                //         "value": RegistrationSubType[0].nregsubtypecode,
                //         "label": RegistrationSubType[0].sregsubtypename
                //     } : selectedRecord["nregsubtypecode"] = "";
                // const [labelname] = event.item;
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: { ...event.item }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });

            })
            .catch(error => {
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getRegSubTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/getRegSubTypeByRegType", Map)

            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: { ...event.item }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });

            })
            .catch(error => {
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getRegistrationComboService(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {

        if ((masterData.RealRegTypeValue !== undefined && masterData.RealRegSubTypeValue !== undefined && operation === "create") || (operation === "update" && (masterData.selectedProduct.ntransactionstatus === transactionStatus.DRAFT || masterData.selectedProduct.ntransactionstatus === transactionStatus.CORRECTION))) {
            dispatch(initRequest(true));
            let urlArray = [];
            const ProductCategoryService = rsapi.post("/productcategory/getProductCategory", {
                "userinfo": userInfo
            });

            const Goodsin = rsapi.post("/registration/getGoodsinReceive", {
                "userinfo": userInfo
            });
            const EprotocolService = rsapi.post("/eprotocol/getEProtocol", {
                "userinfo": userInfo
            });
            if (masterData.RealRegTypeValue.nregtypecode === RegistrationType.NON_BATCH) {
                const ClientService = rsapi.post("/client/getActiveClient", {
                    "userinfo": userInfo
                });
                urlArray = [ClientService]
            }

            //ROUTINE
            if (masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {
                const ClientService = rsapi.post("/client/getActiveClient", { "userinfo": userInfo });
                urlArray.push(ClientService)
                const supplierService = rsapi.post("/supplier/getApprovedSupplier", { "userinfo": userInfo });
                urlArray.push(supplierService)
                const containerTypeService = rsapi.post("/containertype/getContainerType", { "userinfo": userInfo });
                urlArray.push(containerTypeService)
                const StorageConditionbySite = rsapi.post("/storagecondition/getStorageCondition", { "userinfo": userInfo });
                urlArray.push(StorageConditionbySite);
                const timezoneService = rsapi.post("timezone/getTimeZone");
                urlArray.push(timezoneService);
                const DispositionService = rsapi.post("/registration/getDisposition", { "userinfo": userInfo });
                urlArray.push(DispositionService)
                const unitService = rsapi.post("/unit/getUnit", { "userinfo": userInfo });
                urlArray.push(unitService)
                const PriorityService = rsapi.post("/registration/getPriority", { "userinfo": userInfo });
                urlArray.push(PriorityService)
                const periodService = rsapi.post("/registration/getPeriodConfig", { "userinfo": userInfo });
                urlArray.push(periodService)
                const manufacturerService = rsapi.post("/manufacturer/getManufacturersCombo", { "userinfo": userInfo });
                urlArray.push(manufacturerService)
            }
            if (operation === "create") {
                urlArray = [ProductCategoryService, Goodsin, EprotocolService, ...urlArray];
            } else {
            }

            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = { "ntransactionstatus": 3 };
                    let PopUpLabel = masterData.RealRegTypeValue.sregtypename + "(" + masterData.RealRegSubTypeValue.sregsubtypename + " )";
                    const ProductCategory = constructOptionList(response[0].data || [], "nproductcatcode",
                        "sproductcatname", undefined, undefined, true).get("OptionList");
                    const Goodsin = constructOptionList(response[1].data || [], "nrmsno",
                        "nrmsno", "nrmsno", "descending", false).get("OptionList");
                    const EProtocol = constructOptionList(response[2].data || [], "neprotocolcode",
                        "seprotocolname", undefined, undefined, true).get("OptionList");
                    let Client = masterData.RealRegTypeValue.nregtypecode === RegistrationType.NON_BATCH ?
                        constructOptionList(response[3].data || [], "nclientcode",
                            "sclientname", undefined, undefined, true).get("OptionList") : [];
                    let { Supplier, ContainerType, StorageCondition, timezone, Disposition, Unit, Period, Priority, Manufacturer } = []
                    //ROUTINE
                    if (masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {

                        Client = constructOptionList(response[3].data || [], "nclientcode",
                            "sclientname", undefined, undefined, true).get("OptionList");

                        Supplier = constructOptionList(response[4].data || [], "nsuppliercode",
                            "ssuppliername", undefined, undefined, true).get("OptionList");

                        ContainerType = constructOptionList(response[5].data || [], "ncontainertypecode",
                            "scontainertype", undefined, undefined, true).get("OptionList");

                        StorageCondition = constructOptionList(response[6].data || [], "nstorageconditioncode",
                            "sstorageconditionname", undefined, undefined, true).get("OptionList");

                        timezone = constructOptionList(response[7].data || [], "ntimezonecode",
                            "stimezoneid", undefined, undefined, true).get("OptionList");

                        let ntzdreceivedate = { "label": userInfo.stimezoneid, "value": userInfo.ntimezonecode };
                        selectedRecord = { ...selectedRecord, ntzdreceivedate }

                        Disposition = constructOptionList(response[8].data || [], "ndispositioncode",
                            "sdispositionname", undefined, undefined, true).get("OptionList");

                        Unit = constructOptionList(response[9].data || [], "nunitcode",
                            "sunitname", undefined, undefined, true).get("OptionList");

                        Priority = constructOptionList(response[10].data || [], "nprioritycode",
                            "spriorityname", undefined, undefined, true).get("OptionList");

                        Period = constructOptionList(response[11].data || [], "nperiodcode",
                            "speriodname", undefined, undefined, true).get("OptionList");

                        Manufacturer = constructOptionList(response[12].data || [], "nmanufcode",
                            "smanufname", undefined, undefined, true).get("OptionList");

                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ProductCategory,
                            Goodsin,
                            EProtocol,
                            Client,
                            Product: [],
                            Specification: [],
                            AgaramTree: [],
                            Component: [],
                            Test: [],
                            SelectedTest: [],
                            selectedComponent: [],
                           // Sources: [],
                            Source:[],
                            SelectedSource: [],
                            operation,
                            screenName: PopUpLabel,
                            PopUpLabel: PopUpLabel,
                            selectedRecord,
                            openModal: true,
                            ncontrolCode,
                            loadPreregister: true,
                            loadTest: false,
                            loadComponent: false,
                            loadPoolSource: false,
                            loadPrinter: false,
                            loadFile: false,
                            loadChildTest: false,
                            parentPopUpSize: "xl",
                            loading: false,
                            showSample: undefined,
                            Supplier, ContainerType, StorageCondition, timezone, Disposition, Unit, Period, Priority, Manufacturer
                        }
                    })
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                })
        } else {
            // const alertstatus=masterData.selectedProduct.stransdisplaystatus+"CANNOTBEEEDITED";
            // toast.warn(masterData.selectedProduct.sproductname +" : " +this.props.formatMessage({id:alertstatus}));
        }
    }
}

export function getProductCategoryChange(Map, selectedRecord, masterData, ncategorybasedFlow) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/getProductByProductCategory", Map)
            .then(response => {
                selectedRecord["nproductcatcode"]=Map["event"]
                let { Product, Specification, AgaramTree, ActiveKey, FocusKey, OpenNodes, Manufacturer } = response.data;
                if (ncategorybasedFlow === 3) {
                    if (masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {

                        selectedRecord["nallottedspeccode"] = "";
                        selectedRecord["sversion"] = "";
                        selectedRecord["ntemplatemanipulationcode"] = -1;

                    } else {
                        selectedRecord["nallottedspeccode"] = Specification.length > 0 ?
                            {
                                "value": Specification[0].nallottedspeccode,
                                "label": Specification[0].sspecname
                            } : "";
                        selectedRecord["sversion"] = Specification.length > 0 ? Specification[0].sversion : ""
                        selectedRecord["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].ntemplatemanipulationcode : -1;
                    }

                    selectedRecord["nproductcode"] = Product.length > 0 ?
                        {
                            "value": Product[0].nproductcode,
                            "label": Product[0].sproductname
                        } : selectedRecord["nproductcode"];

                } else {
                    selectedRecord["nallottedspeccode"] = "";
                    selectedRecord["sversion"] = "";
                    selectedRecord["nproductcode"] = "";
                }
                selectedRecord["smanufname"] = "";
                selectedRecord["smahname"] = "";
                selectedRecord["smanufsitename"] = "";
                selectedRecord["nproductmahcode"] = "";

                Specification = constructOptionList(Specification || [], "nallottedspeccode",
                    "sspecname", undefined, undefined, true).get("OptionList");
                Product = constructOptionList(Product || [], "nproductcode",
                    "sproductname", undefined, undefined, true).get("OptionList");
                let optionalUpdates = {};
                //ROUTINE
                if (masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {

                    optionalUpdates = {};

                }else{
                    optionalUpdates = {Manufacturer}
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Product, Specification, selectedRecord, AgaramTree, ActiveKey, FocusKey, OpenNodes, 
                        ...optionalUpdates,
                        Component: [],
                        Test: [],
                        SelectedTest: [], 
                        ProductMaholder: [], loading: false
                        ,SelectedSource:[],Source:[]
                    }
                });

            })
            .catch(error => {
                //console.log(error);
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getReProductChange(Map, selectedRecord, LoginProps) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/getManufacturespecByProduct", Map)
            .then(response => {
                selectedRecord["nproductcode"]=Map["event"]
                let { Specification, AgaramTree, ActiveKey, FocusKey, OpenNodes, Manufacturer } = LoginProps;
                if (response.data["rtn"] === true) {
                    Specification = constructOptionList(response.data["Specification"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true).get("OptionList");
                    AgaramTree = response.data["AgaramTree"];
                    ActiveKey = response.data["ActiveKey"];
                    FocusKey = response.data["FocusKey"];
                    OpenNodes = response.data["OpenNodes"];
                    Manufacturer = response.data["Manufacturer"];
                    if (LoginProps.masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {
                        selectedRecord["nallottedspeccode"] = "";
                        selectedRecord["sversion"] = ""
                        selectedRecord["ntemplatemanipulationcode"] = -1
                    } else {
                        selectedRecord["nallottedspeccode"] = Specification.length > 0 ? Specification[0]: "";
                            // {
                            //     "value": Specification[0].nallottedspeccode,
                            //     "label": Specification[0].sspecname
                            // } : "";
                        selectedRecord["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                        selectedRecord["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1
                    }
                    selectedRecord["nmanufcode"] = "";
                    selectedRecord["smanufname"] = "";
                    selectedRecord["smanufsitename"] = "";
                    selectedRecord["nproductmahcode"] = "";
                    selectedRecord["smahname"] = "";

                } else {
                    Manufacturer = response.data["Manufacturer"];
                    selectedRecord["nmanufcode"] = "";
                    selectedRecord["smahname"] = "";
                    selectedRecord["smanufname"] = "";
                    selectedRecord["smanufsitename"] = "";
                    selectedRecord["nproductmahcode"] = "";
                }
                let optionalUpdates = {};
                //ROUTINE
                if (LoginProps.masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {

                    optionalUpdates = {};

                }else{
                    optionalUpdates = {Manufacturer}
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Specification, 
                        ...optionalUpdates,
                        selectedRecord,
                        AgaramTree, ActiveKey, FocusKey, OpenNodes,
                        Component: [],
                        Test: [],
                        ProductMaholder: [],
                        SelectedTest: [], 
                        loading: false
                        ,SelectedSource:[],Source:[]
                    }
                });
            })
            .catch(error => {
                // console.log(error);
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getComponentTestBySpec(Map, selectedRecord, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/getComponentTestBySpec", Map)
            .then(response => {
                const { Component, Test } = response.data;
                let slno = Component.length > 0 ? Component[0].slno : -1;
                let selectedComponent = Component.length > 0 ? Component[0] : undefined
                let SelectedTest = [];
                let SelectedSource = [];

                if (Object.keys(Test).length > 0) {
                    SelectedTest = Test[slno];
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Component, Test, SelectedTest, selectedComponent, loading: false, 
                        SelectedSource, selectedRecord, popUptestDataState:{skip:0, take:10},Source:[]
                    }
                });

            })
            .catch(error => {
                // console.log(error);
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function AddComponent(Map) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = []
        const ComponentTestBySpec = rsapi.post("/registration/getComponentBySpec",
            Map);
        const timezone = rsapi.post("timezone/getTimeZone");
        const StorageConditionbySite = rsapi.post("/storagecondition/getStorageCondition", {
            "userinfo": Map["userinfo"]
        });
        const StorageLocationbySite = rsapi.post("/storagelocation/getStorageLocation", {
            "userinfo": Map["userinfo"]
        });
        if (Map["nregtypecode"] === RegistrationType.PLASMA_POOL) {
            const PlasmaMasterByManufCode = rsapi.post("/plasmamasterfile/getPlasmaMasterFileByManufcode",
                { "userinfo": Map["userinfo"], nmanufcode: Map["nmanufcode"] })
            urlArray = [PlasmaMasterByManufCode]
        }

        urlArray = [ComponentTestBySpec, StorageConditionbySite, StorageLocationbySite, timezone, ...urlArray
        ]
        Axios.all(urlArray)
            .then(response => {
                const lstComponentMap = constructOptionList(response[0].data.lstComponent || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, true);
                const StorageConditionMap = constructOptionList(response[1].data || [], "nstorageconditioncode",
                    "sstorageconditionname", undefined, undefined, true);
                const StorageLocationMap = constructOptionList(response[2].data || [], "nstoragelocationcode",
                    "sstoragelocationname", undefined, undefined, true);
                const timeZoneListMap = constructOptionList(response[3].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, true);

                // const StorageCondition = response[1].data;
                // const StorageLocation = response[2].data;
                // const timeZoneList = response[3].data;
                let plasmaMasterFile = [];

                if (Map["nregtypecode"] === RegistrationType.PLASMA_POOL) {
                    plasmaMasterFile = constructOptionList(response[4].data || [], "nplasmafilecode",
                        "splasmafilenumber", undefined, undefined, true).get("OptionList");
                }
                const lstComponent = lstComponentMap.get("OptionList");
                const StorageCondition = StorageConditionMap.get("OptionList");
                const StorageLocation = StorageLocationMap.get("OptionList");
                const timeZoneList = timeZoneListMap.get("OptionList");
                // const dreceiveddate = lstComponent[0].dreceiveddate || [];

                let dreceiveddate = null;
                if (lstComponent[0].item.sreceiveddate)
                    dreceiveddate = rearrangeDateFormat(Map["userinfo"], lstComponent[0].item.sreceiveddate);//new Date(lstComponent[0].item.sreceiveddate);//|| [];

                let selectComponent = {
                    sreceiveddate: dreceiveddate,
                    dreceiveddate,//: new Date(dreceiveddate),
                    ntzdmanufdate: { "label": Map["userinfo"].stimezoneid, "value": Map["userinfo"].ntimezonecode },
                    ntzdreceivedate: { "label": Map["userinfo"].stimezoneid, "value": Map["userinfo"].ntimezonecode },
                    stzdmanufdate: Map["userinfo"].stimezoneid,
                    stzdreceivedate: Map["userinfo"].stimezoneid,
                    nstorageconditioncode: StorageConditionMap.get("DefaultValue"),
                    scomments: "",
                    nallottedspeccode:lstComponent[0].item.nallottedspeccode
                };
                let CurrentTime = dreceiveddate;//new Date(dreceiveddate);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loadComponent: true,
                        lstComponent, StorageCondition, StorageLocation, dreceiveddate, ChildscreenName: "Component",
                        showSaveContinue: true, openChildModal: false, childoperation: "create", selectComponent,
                        parentPopUpSize: "lg", CurrentTime, timeZoneList, loading: false, plasmaMasterFile
                    }
                });
            })
            .catch(error => {
                // console.log(error);
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getTestfromDB(objComponent, LoginProps, nflag) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let component = { ...objComponent };
        component["ncomponentcode"] = objComponent["ncomponentcode"] ? objComponent["ncomponentcode"].value : -1;
        component["nstoragelocationcode"] = objComponent["nstoragelocationcode"] ? objComponent["nstoragelocationcode"].value : -1;
        component["nstorageconditioncode"] = objComponent["nstorageconditioncode"] ? objComponent["nstorageconditioncode"].value : -1;
        component["slno"] = LoginProps.Component? Object.keys(LoginProps.Component).length + 1: 0;
        component["scomponentname"] = objComponent["ncomponentcode"].label;
        component["sstoragelocationname"] = objComponent["nstoragelocationcode"] && objComponent["nstoragelocationcode"].label ? objComponent["nstoragelocationcode"].label : "";
        component["sstorageconditionname"] = objComponent["nstorageconditioncode"] && objComponent["nstorageconditioncode"].label ? objComponent["nstorageconditioncode"].label : "";
        component["ntzdmanufdate"] = objComponent["ntzdmanufdate"] ? objComponent["ntzdmanufdate"].value : -1;
        component["ntzdreceivedate"] = objComponent["ntzdreceivedate"] ? objComponent["ntzdreceivedate"].value : -1;
        component["stzdreceivedate"] = objComponent["ntzdreceivedate"] ? objComponent["ntzdreceivedate"].label : "";
        component["nplasmafilecode"] = objComponent["nplasmafilecode"] ? objComponent["nplasmafilecode"].value : -1;
        component["splasmafilenumber"] = objComponent["nplasmafilecode"] ? objComponent["nplasmafilecode"].label : "";
        const dreceiveddate = objComponent["dreceiveddate"];
        component["dreceiveddate"] = dreceiveddate;//formatInputDate(objComponent["dreceiveddate"], false);
        component["sreceiveddate"] = convertDateTimetoString(dreceiveddate, LoginProps.userInfo);//formatInputDateWithoutT(objComponent["dreceiveddate"], false);//formatDate(objComponent["sreceiveddate"]);
        // rsapi.post("/registration/getTestfromDB", { "Component": component })
        rsapi.post("/registration/getTestfromDB", {
            nspecsampletypecode: component.nspecsampletypecode,
            slno: component.slno
        })
            .then(response => {
                let TestData = response.data;
                let slno = component.slno;
                let SelectedTest = [];
                let loadComponent = true;
                let selectComponent = {};
                let showSaveContinue = true;
                let SelectedSource = [];
                // let openChildModal = true;
                let selectedComponent = undefined;
                let parentPopUpSize = "lg"
                // selectComponent = objComponent
                if (nflag === 1) {
                    loadComponent = true;
                    objComponent["smanuflotno"] = "";
                    objComponent["dreceiveddate"] = rearrangeDateFormat(LoginProps.userInfo, LoginProps.CurrentTime)//new Date(LoginProps.CurrentTime);
                    objComponent["sreceiveddate"] = rearrangeDateFormat(LoginProps.userInfo, LoginProps.CurrentTime)//new Date(LoginProps.CurrentTime);
                    selectComponent = objComponent;
                } else {
                    loadComponent = false;
                    parentPopUpSize = "xl"
                    // openChildModal = false;
                    showSaveContinue = false;
                    selectComponent = undefined
                }
                let Test = LoginProps.Test || [];
                let Component = LoginProps.Component || [];
                Component.unshift(component);
                selectedComponent = component;
                Test[slno] = response.data;
                SelectedTest = TestData;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Component, Test, SelectedTest, selectComponent, selectedComponent,
                        loadComponent, showSaveContinue, parentPopUpSize, loading: false, SelectedSource
                    }
                });
                // console.log(response.data);
            })
            .catch(error => {
                //   console.log(error);
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getTest(objComponent, LoginProps) {
    return function (dispatch) {

        if (Object.keys(objComponent).length > 0) {
            dispatch(initRequest(true));
            //rsapi.post("/registration/getTestfromDB", { "Component": objComponent })
            rsapi.post("/registration/getTestfromDB", {
                nspecsampletypecode: objComponent.nspecsampletypecode,
                slno: objComponent.slno
            })
                .then(response => {
                    let TestData = response.data;
                    let Test = LoginProps.Test || [];
                    let componentTest = Test[objComponent.slno] ? Test[objComponent.slno] : [];
                    const TestCombined = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestgrouptestcode");
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            TestCombined, loadTest: true, openChildModal: false, ChildscreenName: "Test",
                            childoperation: "create", parentPopUpSize: "lg", loading: false
                        }
                    });
                })
                .catch(error => {
                    //console.log(error);
                    toast.error(error.message);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                })
        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTCOMPONENTTOADDTEST" }));
        }

    }
}

export function EditComponent(Map, component, userInfo, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        const ComponentTestBySpec = rsapi.post("/registration/getComponentBySpec",
            Map);

        const StorageConditionbySite = rsapi.post("/storagecondition/getStorageCondition", {
            "userinfo": userInfo
        });
        const StorageLocationbySite = rsapi.post("/storagelocation/getStorageLocation", {
            "userinfo": userInfo
        });
        const timezone = rsapi.post("timezone/getTimeZone");
        if (Map["nregtypecode"] === RegistrationType.PLASMA_POOL) {
            const PlasmaMasterByManufCode = rsapi.post("/plasmamasterfile/getPlasmaMasterFileByManufcode",
                { "userinfo": Map["userinfo"], nmanufcode: Map["nmanufcode"] })
            urlArray = [PlasmaMasterByManufCode]
        }
        urlArray = [ComponentTestBySpec, StorageConditionbySite, StorageLocationbySite, timezone, ...urlArray]
        Axios.all(urlArray)
            .then(response => {
                const lstComponentMap = constructOptionList(response[0].data.lstComponent || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, true);
                const StorageConditionMap = constructOptionList(response[1].data || [], "nstorageconditioncode",
                    "sstorageconditionname", undefined, undefined, true);
                const StorageLocationMap = constructOptionList(response[2].data || [], "nstoragelocationcode",
                    "sstoragelocationname", undefined, undefined, true);
                const timeZoneListMap = constructOptionList(response[3].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, true);
                const TimeZoneField = response[3].data;
                const lstComponent = lstComponentMap.get("OptionList");
                const StorageCondition = StorageConditionMap.get("OptionList");
                const StorageLocation = StorageLocationMap.get("OptionList");
                const timeZoneList = timeZoneListMap.get("OptionList");

                let plasmaMasterFile = []
                if (Map["nregtypecode"] === RegistrationType.PLASMA_POOL) {
                    plasmaMasterFile = constructOptionList(response[4].data || [], "nplasmafilecode",
                        "splasmafilenumber", undefined, undefined, true).get("OptionList");
                    if (plasmaMasterFile.length > 0) {
                        component["nplasmafilecode"] = component.nplasmafilecode && component.nplasmafilecode !== -1 ? {
                            "label": plasmaMasterFile[plasmaMasterFile.findIndex(x => x.value === component.nplasmafilecode)].label,
                            "value": plasmaMasterFile[plasmaMasterFile.findIndex(x => x.value === component.nplasmafilecode)].value
                        } : ""
                    }
                }
                component["ncomponentcode"] = { label: component.scomponentname, value: component.ncomponentcode }
                // component["nstoragelocationcode"] = { label: component.sstoragelocationname, value: component.nstoragelocationcode }
                // component["nstorageconditioncode"] = { label: component.sstorageconditionname, value: component.nstorageconditioncode }

                if (component.nstoragelocationcode !== -1){
                    component["nstoragelocationcode"] = { label: component.sstoragelocationname, value: component.nstoragelocationcode }
                }
                else{
                    component["nstoragelocationcode"] = undefined;
                }
                if (component.nstorageconditioncode !== -1){
                    component["nstorageconditioncode"] = { label: component.sstorageconditionname, value: component.nstorageconditioncode }
                }
                else{
                    component["nstorageconditioncode"] = undefined;
                }

                component["dreceiveddate"] = rearrangeDateFormat(userInfo, component["sreceiveddate"]);//new Date(component["sreceiveddate"])

                let ntzdmanufdate = component.ntzdmanufdate;
                if (component.ntzdmanufdate !== null && typeof component.ntzdmanufdate === "object") {
                    ntzdmanufdate = component.ntzdmanufdate.value;
                }
                let ntzdreceivedate = component.ntzdreceivedate;
                if (component.ntzdreceivedate !== null && typeof component.ntzdreceivedate === "object") {
                    ntzdreceivedate = component.ntzdreceivedate.value;
                }
                component["ntzdmanufdate"] = component.ntzdmanufdate && TimeZoneField.length > 0 ? { "label": TimeZoneField[TimeZoneField.findIndex(x => x.ntimezonecode === ntzdmanufdate)].stimezoneid, "value": TimeZoneField[TimeZoneField.findIndex(x => x.ntimezonecode === ntzdmanufdate)].ntimezonecode } : "" //findIndex(x => x.ntimezonecode === ntzdmanufdate)
                component["ntzdreceivedate"] = component.ntzdreceivedate ? { "label": TimeZoneField[TimeZoneField.findIndex(x => x.ntimezonecode === ntzdreceivedate)].stimezoneid, "value": TimeZoneField[TimeZoneField.findIndex(x => x.ntimezonecode === ntzdreceivedate)].ntimezonecode } : ""


                // if(typeof Component.ntzdmanufdate)
                // Component["ntzdmanufdate"] = Component.ntzdmanufdate ? { "label": timeZoneList[timeZoneList.findIndex(x => x.ntimezonecode === Component.ntzdmanufdate)].stimezoneid, "value": timeZoneList[timeZoneList.findIndex(x => x.ntimezonecode === Component.ntzdmanufdate)].ntimezonecode } : ""
                // Component["ntzdreceivedate"] = Component.ntzdreceivedate ? { "label": timeZoneList[timeZoneList.findIndex(x => x.ntimezonecode === Component.ntzdreceivedate)].stimezoneid, "value": timeZoneList[timeZoneList.findIndex(x => x.ntimezonecode === Component.ntzdreceivedate)].ntimezonecode } : ""
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loadComponent: true, childoperation: "update",
                        lstComponent, StorageCondition, StorageLocation, ChildscreenName: "Component",
                        openChildModal: false, selectComponent: component, parentPopUpSize: "lg",
                        timeZoneList, plasmaMasterFile, loading: false
                    }
                });
            })
            .catch(error => {
                //console.log(error);
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })

        // return dispatch({
        //     type: DEFAULT_RETURN,
        //     payload: {

        //     }
        // })
    }
}

export function insertRegistration(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/createRegistration", inputParam.inputData)
            .then(response => {
                let openModal = true;
                if (response.data["rtn"] === "Success") {
                    let RegistrationGetSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.RegistrationGetSample);

                    let selectedSample = response.data["selectedSample"];
                    let RegistrationGetSubSample = response.data["selectedSubSample"];
                    let RegistrationGetTest = response.data["selectedTest"];
                    let selectedSubSample = RegistrationGetSubSample;
                    RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc");
                    let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];

                    if (inputParam.multipleselectionFlag) {
                        selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                        updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.RegistrationGetSubSample);
                        updatedObjectWithNewElement(response.data["selectedTest"], masterData.RegistrationGetTest);
                        RegistrationGetSubSample = masterData.RegistrationGetSubSample;
                        RegistrationGetTest = masterData.RegistrationGetTest;
                    }

                    masterData = {
                        ...masterData, ...response.data,
                        selectedSample, selectedSubSample, selectedTest,
                        RegistrationGetSubSample, RegistrationGetTest, RegistrationGetSample
                    }


                    // sortData(masterData);
                    // dispatch({
                    //     type: DEFAULT_RETURN,
                    //     payload: {
                    //         openModal: false, masterData, showConfirmAlert: false, selectedRecord: undefined
                    //     }
                    // });

                    // sortData(masterData);
                    // dispatch({
                    //     type: DEFAULT_RETURN,
                    //     payload: {
                    //         openModal: false, masterData, showConfirmAlert: false, selectedRecord: undefined
                    //     }
                    // });
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        openModal: false,
                        loadEsign: false,
                        showConfirmAlert: false,
                        selectedRecord: undefined,
                        loading: false,
                        loadPreregister: false,
                        showSample: undefined
                    }
                    inputParam.postParamList[0]['clearFilter'] = 'yes'
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } 
                else if (response.data["rtn"] && response.data["rtn"] !== "") {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            booleanFlag: response.data["rtn"],//.split(",").join("\n"), 
                            showConfirmAlert: true, masterData, openModal, loading: false
                        }
                    });
                } 
                else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            showConfirmAlert: false, loading: false
                        }
                    });
                }
            })
            .catch(error => {
                // console.log(error);
                toast.error(error.message);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false } })
            })
    }
}

// export function getRegistrationsubSampleDetail(inputData, isServiceRequired) {
//     return function (dispatch) {
//         let inputParamData = {
//             nflag: 2,
//             ntype: 2,
//             nsampletypecode: inputData.nsampletypecode,
//             nregtypecode: inputData.nregtypecode,
//             nregsubtypecode: inputData.nregsubtypecode,
//             npreregno: inputData.npreregno,
//             ntransactionstatus: inputData.ntransactionstatus,
//             napprovalconfigcode: inputData.napprovalconfigcode,
//             activeTestTab: inputData.activeTestTab,
//             activeSampleTab: inputData.activeSampleTab,
//             userinfo: inputData.userinfo
//         }
//         dispatch(initRequest(true));
//         if (isServiceRequired) {
//             rsapi.post("registration/getRegistrationSubSample", inputParamData)
//                 .then(response => {
//                     sortData(response.data);
//                     fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
//                     let wholeRegistrationTestComments = [];
//                     let RegistrationTestComment = [];
//                     if (inputData.checkBoxOperation === 1) {
//                         RegistrationTestComment = getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment,
//                             inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : "", "ntransactiontestcode")
//                     } else if (inputData.checkBoxOperation === 5) {
//                         let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
//                         let RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
//                         let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
//                         RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment1, ntransactiontestcode, "ntransactiontestcode");
//                         // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
//                     } else {
//                         RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
//                     }
//                     let { testskip, testtake } = inputData
//                     let bool = false;
//                     let skipInfo = {}
//                     if (inputData.masterData.RegistrationGetTest.length < inputData.testskip) {
//                         testskip = 0;
//                         bool = true
//                     }
//                     if (bool) {
//                         skipInfo = { testskip, testtake }
//                     }
//                     if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
//                         inputData.searchTestRef.current.value = ""
//                         inputData.masterData['searchedTest'] = undefined
//                     }
//                     dispatch({
//                         type: DEFAULT_RETURN, payload: {
//                             masterData: {
//                                 ...inputData.masterData,
//                                 selectedSample: inputData.selectedSample,
//                                 selectedPreregno: inputData.npreregno,
//                                 selectedTest: inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [],
//                                 RegistrationTestComment,
//                                 selectedSubSample: inputData.masterData.RegistrationGetSubSample, wholeRegistrationTestComments
//                             },
//                             loading: false,
//                             showFilter: false,
//                             activeSampleTab: inputData.activeSampleTab,
//                             activeTestTab: inputData.activeTestTab,
//                             skip: undefined,
//                             take: undefined,
//                             ...skipInfo,
//                             showSample:undefined
//                         }
//                     })
//                 })
//                 .catch(error => {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                     if (error.response.status === 500) {
//                         toast.error(error.message);
//                     }
//                     else {
//                         toast.warn(error.response.data);
//                     }
//                 })
//         } else {
//             let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
//             let isGrandChildGetRequired = false;
//             if (TestSelected.length > 0) {
//                 isGrandChildGetRequired = true;
//             } else {
//                 isGrandChildGetRequired = false;
//             }
//             fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
//             if (isGrandChildGetRequired) {
//                 let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode.toString() : "-1";
//                 let selectedSample = inputData.selectedSample;
//                 let selectedPreregno = inputData.npreregno;
//                 let selectedTest = inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [];
//                 let selectedSubSample = inputData.masterData.RegistrationGetSubSample
//                 let masterData = { ...inputData.masterData, selectedSample, selectedSubSample, selectedTest }
//                 inputData = {
//                     ...inputData, childTabsKey: ["RegistrationTestComment"], ntransactiontestcode, masterData, selectedTest,
//                     selectedSubSample, checkBoxOperation: 3
//                 }
//                 dispatch(getTestChildTabDetail(inputData, true));
//             } else {
//                 let RegistrationTestComment = getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment,
//                     inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : "-1", "ntransactiontestcode")
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         masterData: {
//                             ...inputData.masterData,
//                             selectedSample: inputData.selectedSample,
//                             selectedPreregno: inputData.npreregno,
//                             selectedTest: inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [],
//                             RegistrationTestComment,
//                             selectedSubSample: inputData.masterData.RegistrationGetSubSample
//                         },
//                         loading: false,
//                         showFilter: false,
//                         activeSampleTab: inputData.activeSampleTab,
//                         activeTestTab: inputData.activeTestTab
//                     }
//                 })
//             }

//         }

//     }
// }

export function getRegistrationsubSampleDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            nflag: 2,
            ntype: 2,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalconfigcode: inputData.napprovalconfigcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            userinfo: inputData.userinfo
        }
        let activeName = "";
        let dataStateName = "";
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi.post("registration/getRegistrationSubSample", inputParamData)
                .then(response => {
                    sortData(response.data);
                    let oldSelectedTest = inputData.masterData.selectedTest
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        selectedSample: inputData.selectedSample,
                        selectedPreregno: inputData.npreregno,
                        selectedTest: inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [],
                        // RegistrationTestComment,
                        selectedSubSample: inputData.masterData.RegistrationGetSubSample, //wholeRegistrationTestComments
                    }
                    //let wholeRegistrationTestComments = [];
                    let RegistrationTestComment = [];
                    let RegistrationParameter = [];
                    if (inputData.checkBoxOperation === 1) {

                        let wholeTestList = masterData.RegistrationGetTest.map(b => b.ntransactiontestcode)
                        oldSelectedTest.forEach((test, index) => {
                            if (!wholeTestList.includes(test.ntransactiontestcode)) {
                                oldSelectedTest.splice(index, 1)
                            }

                        })
                        let keepOld = false;
                        let ntransactiontestcode;
                        if (oldSelectedTest.length > 0) {
                            keepOld = true
                            masterData = {
                                ...masterData,
                                selectedTest: oldSelectedTest
                            }
                        } else {
                            ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : ""
                        }
                        switch (inputData.activeTestTab) {
                            case "IDS_PARAMETERRESULTS":
                                RegistrationParameter = keepOld ? inputData.masterData.RegistrationParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            default :
                                RegistrationParameter = keepOld ? inputData.masterData.RegistrationParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                        
                        

                    } 
                    else if (inputData.checkBoxOperation === 5) {
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTCOMMENTS":
                                let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment1 = [];
                                if(inputData.masterData.RegistrationTestComment!==undefined){
                                    RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                }
                                let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment1, ntransactiontestcode, "ntransactiontestcode");
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_PARAMETERRESULTS":
                                let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                let ntransactiontestcode1 = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                RegistrationParameter = getRecordBasedOnPrimaryKeyName(RegistrationParameter1, ntransactiontestcode1, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                            default :
                                let ResponseData1 = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment2 = [];
                                if(inputData.masterData.RegistrationTestComment!==undefined){
                                    RegistrationTestComment2 = [...inputData.masterData.RegistrationTestComment, ...ResponseData1];
                                }
                                let ntransactionTestCode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                        // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                    } 
                    else {
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_PARAMETERRESULTS":
                                RegistrationParameter = response.data.RegistrationParameter ? [...response.data.RegistrationParameter] : [];
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                            default :
                                RegistrationParameter = response.data.RegistrationParameter ? [...response.data.RegistrationParameter] : [];
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                    }
                    masterData['RegistrationTestComment'] = RegistrationTestComment;
                    masterData["RegistrationParameter"] = RegistrationParameter;
                    let { testskip, testtake } = inputData
                    let bool = false;
                    let skipInfo = {}
                    if (inputData.masterData.RegistrationGetTest.length < inputData.testskip) {
                        testskip = 0;
                        bool = true
                    }
                    
                    if (bool) {
                        skipInfo = { testskip, testtake }
                    }
                    if (inputData.masterData.selectedSample && inputData.sampleGridDataState
                         && inputData.masterData.selectedSample.length <= inputData.sampleGridDataState.skip) {
                        skipInfo = {
                            ...skipInfo,
                            sampleGridDataState:{
                                ...inputData.sampleGridDataState,
                                skip: 0,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }else{
                        skipInfo = {
                            ...skipInfo,
                            sampleGridDataState:{
                                ...inputData.sampleGridDataState,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }
                    if (inputData.sourceDataState && masterData.RegistrationSourceCountry
                         && masterData.RegistrationSourceCountry.length <= inputData.sourceDataState.skip) {
                        skipInfo = {
                            ...skipInfo,
                            sourceDataState: {
                                ...inputData.sourceDataState,
                                skip: 0,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }else{
                        skipInfo = {
                            ...skipInfo,
                            sourceDataState: {
                                ...inputData.sourceDataState,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTest'] = undefined
                    }
                    let inputParam={attachmentskip:undefined}
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }else{
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeSampleTab: inputData.activeSampleTab,
                            activeTestTab: inputData.activeTestTab,
                            skip: undefined,
                            take: undefined,
                            ...skipInfo,
                            inputParam
                        }
                    })
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            let oldSelectedTest = inputData.masterData.selectedTest
            let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = true;
            } else {
                isGrandChildGetRequired = false;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode.toString() : "-1";
                let selectedSample = inputData.selectedSample;
                // let selectedPreregno = inputData.npreregno;
                let selectedTest = inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [];
                let selectedSubSample = inputData.masterData.RegistrationGetSubSample
                let masterData = { ...inputData.masterData, selectedSample, selectedSubSample, selectedTest }
                inputData = {
                    ...inputData, childTabsKey: ["RegistrationTestComment", "RegistrationParameter"], ntransactiontestcode, masterData, selectedTest,
                    selectedSubSample, checkBoxOperation: 3
                }
                dispatch(getTestChildTabDetail(inputData, true));
            } else {
                //added by sudharshanan for test select issue while sample click
                let masterData = {
                    ...inputData.masterData,
                    selectedSample: inputData.selectedSample,
                    selectedPreregno: inputData.npreregno,
                    selectedTest: inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [],
                    // RegistrationTestComment,
                    selectedSubSample: inputData.masterData.RegistrationGetSubSample
                }
                let wholeTestList = masterData.RegistrationGetTest.map(b => b.ntransactiontestcode)
                oldSelectedTest.forEach((test, index) => {
                    if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        oldSelectedTest.splice(index, 1)
                    }
                    return null;
                })
                let keepOld = false;
                let ntransactiontestcode;
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        selectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : "-1"
                }
                masterData["RegistrationTestComment"] = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                masterData["RegistrationParameter"] = keepOld ? inputData.masterData.RegistrationParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                let skipInfo = {};
                let dataStateArray = [
                    {activeName:'selectedSample', dataStateName:'sampleGridDataState'},
                    {activeName:'RegistrationSourceCountry', dataStateName:'sourceDataState'},
                    {activeName:'RegistrationTestComment', dataStateName:'testCommentDataState'},
                    {activeName:'RegistrationParameter', dataStateName:'resultDataState'},
                ]
                dataStateArray.map(arr=>{
                    if (inputData[arr.dataStateName] && masterData[arr.activeName] && 
                        masterData[arr.activeName].length <= inputData[arr.dataStateName].skip) {
                        skipInfo = {
                            ...skipInfo,
                            [arr.dataStateName]: {
                                ...inputData[arr.dataStateName],
                                skip: 0,
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }else{
                        skipInfo = {
                            ...skipInfo,
                            [arr.dataStateName]: {
                                ...inputData[arr.dataStateName],
                                sort:undefined,
                                filter:undefined
                            }
                        }
                    }
                    return null;
                });
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab,
                        ...skipInfo
                    }
                })
            }

        }

    }
}

export function acceptRegistration(inputParam, LoginProps) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/acceptRegistration", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success"
                    || response.data.rtn === "IDS_ATLEASTONETESTMUSTBEPREREGISTER"
                    || response.data.rtn === "IDS_ALLSAMPLESAREREGISTERED"|| response.data.rtn === "IDS_SELECTPREREGISTERORQUARANTINESAMPLES") {
                    // replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                    // let masterData = {
                    //     ...LoginProps, ...response.data
                    // }

                    replaceUpdatedObject(response.data["selectedSample"], LoginProps.RegistrationGetSample, "npreregno");
                    replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                    replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                    delete response.data["RegistrationGetSample"];
                    delete response.data["RegistrationGetSubSample"];
                    delete response.data["RegistrationGetTest"];
                    let masterData = {
                        ...LoginProps, ...response.data,
                        selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno"),
                        selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.selectedSubSample, "ntransactionsamplecode"),
                        selectedTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.selectedTest, "ntransactiontestcode"),
                    }
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                    if (response.data.rtn === "IDS_ATLEASTONETESTMUSTBEPREREGISTER"
                        || response.data.rtn === "IDS_ALLSAMPLESAREREGISTERED"|| response.data.rtn === "IDS_SELECTPREREGISTERORQUARANTINESAMPLES") {
                        toast.warn(intl.formatMessage({ id: response.data.rtn }));
                    }
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
                }

                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: {
                //         masterData
                //     }
                // });
            })
            .catch(error => {
                //console.log(error);
                toast.error(error.message);
            })
    }
}

export function getRegistrationSample(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("registration/getRegistrationByFilterSubmit", { ...inputData.inputData })
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data
                }
                if (inputData.searchSampleRef !== undefined && inputData.searchSampleRef.current !== null) {
                    inputData.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                    inputData.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                let respObject = {};
                if (inputData.selectedFilter){
                    respObject = {selectedFilter : {...inputData.selectedFilter}};
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        testskip: 0,
                        take: undefined,
                        testtake: undefined,
                        showSample: undefined,
                        ...respObject,
                        activeSampleTab:inputData.inputData.activeSampleTab
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function ReloadData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("registration/getRegistrationByFilterSubmit", { ...inputData.inputData })
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data
                }
                if (inputData.searchSampleRef !== undefined && inputData.searchSampleRef.current !== null) {
                    inputData.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                    inputData.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    //masterData['searchedTests'] = undefined
                    masterData['searchedTest'] = undefined
                }
                // let selectedFilter = inputData.selectedFilter;
                // selectedFilter["fromdate"] = "";
                // selectedFilter["todate"] = "";

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        testskip: 0,
                        take: undefined,
                        testtake: undefined,
                        showSample: undefined,
                        //selectedFilter
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getManufacturerChange(selectedRecord, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        if (masterData.RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL) {
            selectedRecord["nproductmahcode"] = "";
            selectedRecord["smahname"] = "";
            selectedRecord["nplasmafilecode"] = undefined;
            const maHolder = rsapi.post("registration/getMaholderByProduct",
                {
                    nproductcode: selectedRecord.nproductcode.value,
                    nproductmanufcode: selectedRecord.nproductmanufcode,
                    userinfo: userInfo
                });


            const PlasmaMasterByManufCode = rsapi.post("/plasmamasterfile/getPlasmaMasterFileByManufcode",
                { "userinfo": userInfo, nmanufcode: selectedRecord.nmanufcode })

            Axios.all([maHolder, PlasmaMasterByManufCode])
                // rsapi.post("registration/getMaholderByProduct", { nproductcode: selectedRecord.nproductcode.value, nproductmanufcode: selectedRecord.nproductmanufcode, userinfo: userInfo })
                .then(response => {

                    const plasmaMasterFile = constructOptionList(response[1].data || [], "nplasmafilecode",
                        "splasmafilenumber", undefined, undefined, true).get("OptionList");

                    let ProductMaholder = response[0].data;
                    //let plasmaMasterFile = response[1].data;
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            ProductMaholder,
                            plasmaMasterFile,
                            selectedRecord,
                            masterData,
                            loading: false
                        }
                    })
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })

        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    selectedRecord, loading: false
                }
            });
        }
    }
}

export function getComponentSource(objComponent, LoginProps) {
    return function (dispatch) {
        dispatch(initRequest(true));
        if (Object.keys(objComponent).length > 0) {
            rsapi.post("/country/getBatchPoolCountry", { "userinfo": LoginProps.userInfo })
                .then(response => {
                    let Country = response.data;
                   // let Sources = LoginProps.Sources || [];
                    let Source = LoginProps.Source || [];
                    let componentSource = Source[objComponent.slno] ? Source[objComponent.slno] : [];
                    let SourceCombined = [];
                    if (componentSource.length > 0) {
                        SourceCombined = filterRecordBasedOnTwoArrays(Country, componentSource, "ncountrycode");
                    } else {
                        SourceCombined = Country
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            SourceCombined, loadSource: true, ChildscreenName: "Source",selectedSourceData:[],
                            childoperation: "create", parentPopUpSize: "lg", loading: false, showSample: undefined
                        }
                    });
                })
                .catch(error => {
                    // console.log(error);
                    toast.error(error.message);
                })
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            });
            //toast.warn("select Component to Add Source");
            toast.warn(intl.formatMessage({ id: "IDS_SELECTCOMPONENTTOADDSOURCE" }));
        }

    }
}

export function preregRecordToQuarantine(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/quarantineRegistration", inputParam.inputData)
            .then(response => {
                replaceUpdatedObject(response.data["selectedSample"], LoginProps.RegistrationGetSample, "npreregno");
                replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                let masterData = {
                    ...LoginProps,
                    selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno"),
                    selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.selectedSubSample, "ntransactionsamplecode"),
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.selectedTest, "ntransactiontestcode"),
                }
                let respObject = {
                    masterData,
                    loading: false,
                    loadEsign: false,
                    openModal: false,
                    showSample: undefined
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data.rtn);
                }

            })
    }
}

export function cancelTestAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/cancelTest", inputParam.inputData)
            .then(response => {

                // replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                let masterData = {
                    ...LoginProps,
                    selectedTest: response.data["selectedTest"],
                    // RegistrationGetTest:response.data["RegistrationGetTest"],
                    RegistrationGetTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode"),

                    RegistrationGetSample: replaceUpdatedObject(response.data.selectedSample, LoginProps.RegistrationGetSample, 'npreregno')
                }
                let respObject = {
                    masterData,
                    ...inputParam.inputData,
                    openModal: false,
                    loadEsign: false,
                    showConfirmAlert: false,
                    selectedRecord: undefined,
                    loading: false,
                    loadPreregister: false,
                    showSample: undefined
                }
                inputParam.postParamList[0]['clearFilter'] = 'no'
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))

                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: {
                //         masterData,
                //         loading: false,
                //         loadEsign: false,
                //         openModal: false
                //     }
                // });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data.rtn);
                }
            })
    }

}

export function ImportFile(formData, ConfirmMessage, LoginProps) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("registration/importFile", formData)
            .then(response => {
                let { Component, SelectedTest, Test, selectedComponent, SelectedSource, Source, selectedSourceData } = LoginProps;
                if (response.data.rtn === "Success") {
                    Component = response.data["Component"];
                    Test = response.data["Test"];
                    Source = response.data["Source"];
                    selectedComponent = Component[0];
                    SelectedTest = Test[selectedComponent.slno];
                    SelectedSource = Source[selectedComponent.slno];
                    selectedSourceData = Source[selectedComponent.slno];
                } else {
                    const data = response.data.rtn;
                    ConfirmMessage.confirm(
                        intl.formatMessage({ id: "IDS_WARNING" }),
                        intl.formatMessage({ id: "IDS_WARNING" }),
                        data, undefined,
                        intl.formatMessage({ id: "IDS_OK" }),
                        undefined, true, undefined);
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loadFile: false, parentPopUpSize: "xl", Component, SelectedTest,
                        Test, selectedComponent, loading: false,
                        SelectedSource, Source, showSample: undefined,
                        selectedSourceData
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })

    }
}

export function getEditRegistrationComboService(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const { masterData, userInfo, operation } = { ...inputParam };

        const npreregno = inputParam.mastertoedit[inputParam.primaryKeyName];
        let urlArray = [];

        const goodsin = rsapi.post("/registration/getGoodsinReceive", { "userinfo": userInfo });
        const eprotocolService = rsapi.post("/eprotocol/getEProtocol", { "userinfo": userInfo });
        const selectedRegistration = rsapi.post("/registration/getEditRegistrationDetails", { ...inputParam.editRegParam, npreregno })
        const timezone = rsapi.post("timezone/getTimeZone");
        const storageConditionbySite = rsapi.post("/storagecondition/getStorageCondition", { "userinfo": userInfo });
        const storageLocationbySite = rsapi.post("/storagelocation/getStorageLocation", { "userinfo": userInfo });
        const UTCtimeZoneService = rsapi.post("timezone/getLocalTimeByZone", { userinfo: userInfo });

        if (masterData.RealRegTypeValue.nregtypecode === RegistrationType.NON_BATCH) {
            const ClientService = rsapi.post("/client/getActiveClient", { "userinfo": userInfo });
            urlArray = [ClientService]
        }
        if (masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {
            const ClientService = rsapi.post("/client/getActiveClient", { "userinfo": userInfo });
            urlArray.push(ClientService)
            const supplierService = rsapi.post("/supplier/getApprovedSupplier", { "userinfo": userInfo });
            urlArray.push(supplierService)
            const containerTypeService = rsapi.post("/containertype/getContainerType", { "userinfo": userInfo });
            urlArray.push(containerTypeService)
            const DispositionService = rsapi.post("/registration/getDisposition", { "userinfo": userInfo });
            urlArray.push(DispositionService)
            const unitService = rsapi.post("/unit/getUnit", { "userinfo": userInfo });
            urlArray.push(unitService)
            const PriorityService = rsapi.post("/registration/getPriority", { "userinfo": userInfo });
            urlArray.push(PriorityService)
            const periodService = rsapi.post("/registration/getPeriodConfig", { "userinfo": userInfo });
            urlArray.push(periodService)
            const manufacturerService = rsapi.post("/manufacturer/getManufacturersCombo", { "userinfo": userInfo });
            urlArray.push(manufacturerService)
        }
        urlArray = [goodsin, eprotocolService, selectedRegistration,
            timezone, storageConditionbySite, storageLocationbySite,UTCtimeZoneService, ...urlArray]

        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = { ...response[2].data["SelectedRegistration"][0] };

                const recordToEdit = { ...response[2].data["SelectedRegistration"][0] };
                const currentTime = rearrangeDateFormat(userInfo, response[6].data);

                if (selectedRecord.ntransactionstatus === transactionStatus.CANCELLED
                    || selectedRecord.ntransactionstatus === transactionStatus.REJECT) {
                    toast.warn(intl.formatMessage({ id: "IDS_CANNOTEDITCANCELLEDSAMPLE" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                }
                else {

                    selectedRecord["nproductcatcode"] = { value: selectedRecord.nproductcatcode, label: selectedRecord.sproductcatname };
                    selectedRecord["nproductcode"] = { value: selectedRecord.nproductcode, label: selectedRecord.sproductname };

                    selectedRecord["neprotocolcode"] = { value: selectedRecord.neprotocolcode, label: selectedRecord.seprotocolname };
                    selectedRecord["nrmsno"] = { label: selectedRecord.nrmsno, value: selectedRecord.nrmsno };
                    selectedRecord["nallottedspeccode"] = { value: selectedRecord.nallottedspeccode, label: selectedRecord.sspecname };
                    // selectedRecord["nstorageconditioncode"] = { value: selectedRecord.nstorageconditioncode, label: selectedRecord.sstorageconditionname };
                    selectedRecord["nclientcode"] = { value: selectedRecord.nclientcode, label: selectedRecord.sclientname };

                    selectedRecord["dreceiveddate"] = rearrangeDateFormat(userInfo, selectedRecord.sreceiveddate);//new Date(selectedRecord.sreceiveddate);
                    recordToEdit["dreceiveddate"] = selectedRecord["dreceiveddate"];
                    if (selectedRecord.smanufdate && selectedRecord.smanufdate !== null) {
                        selectedRecord["dmanufdate"] = rearrangeDateFormat(userInfo, selectedRecord.smanufdate);//new Date(selectedRecord.smanufdate);
                        recordToEdit["dmanufdate"] = selectedRecord["dmanufdate"];
                   
                    }
                    //selectedRecord["nstoragelocationcode"] = { value: selectedRecord.nstoragelocationcode, label: selectedRecord.sstoragelocationname };
                    // selectedRecord["nplasmafilecode"] = { value: selectedRecord.nplasmafilecode, label: selectedRecord.splasmafilenumber };

                    if (selectedRecord["nstorageconditioncode"] !== -1) {
                        selectedRecord["nstorageconditioncode"] = { value: selectedRecord.nstorageconditioncode, label: selectedRecord.sstorageconditionname };
                    }
                    if (selectedRecord["nstoragelocationcode"] !== -1) {
                        selectedRecord["nstoragelocationcode"] = { value: selectedRecord.nstoragelocationcode, label: selectedRecord.sstoragelocationname };
                    }
                    if (selectedRecord["nplasmafilecode"] !== -1) {
                        selectedRecord["nplasmafilecode"] = { value: selectedRecord.nplasmafilecode, label: selectedRecord.splasmafilenumber };

                    }

                    response[3].data.forEach((option) => {
                        if (option.ntimezonecode === selectedRecord["ntzdreceivedate"])
                            selectedRecord["ntzdreceivedate"] = {
                                value: option.ntimezonecode,
                                label: option.stimezoneid
                            }

                        if (option.ntimezonecode === selectedRecord["ntzdmanufdate"])
                            selectedRecord["ntzdmanufdate"] = {
                                value: option.ntimezonecode,
                                label: option.stimezoneid
                            }

                    })
                    selectedRecord["stzdreceivedate"] = selectedRecord["ntzdreceivedate"] ? selectedRecord["ntzdreceivedate"].label : "";
                    selectedRecord["stzdmanufdate"] = selectedRecord["ntzdmanufdate"] ? selectedRecord["ntzdmanufdate"].label : "";


                    const plasmaMasterFile = constructOptionList(response[2].data["PlasmaMasterFile"] || [], "nplasmafilecode",
                        "splasmafilenumber", undefined, undefined, true).get("OptionList");
                    let popUpLabel = masterData.RealRegTypeValue.sregtypename + "(" + masterData.RealRegSubTypeValue.sregsubtypename + " )";
                    let { Client, Supplier, ContainerType, Disposition, Unit, Priority, Period } = []
                    //ROUTINE
                    let Manufacturer = response[2].data["Manufacturer"] || [];
                    if (masterData.RealRegTypeValue.nregtypecode === RegistrationType.NON_BATCH) {
                        Client = constructOptionList(response[7].data || [], "nclientcode",
                            "sclientname", undefined, undefined, true).get("OptionList")
                    }
                    if (masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {

                        Client = constructOptionList(response[7].data || [], "nclientcode",
                            "sclientname", undefined, undefined, true).get("OptionList");

                        Supplier = constructOptionList(response[8].data || [], "nsuppliercode",
                            "ssuppliername", undefined, undefined, true).get("OptionList");

                        ContainerType = constructOptionList(response[9].data || [], "ncontainertypecode",
                            "scontainertype", undefined, undefined, true).get("OptionList");

                        Disposition = constructOptionList(response[10].data || [], "ndispositioncode",
                            "sdispositionname", undefined, undefined, true).get("OptionList");

                        Unit = constructOptionList(response[11].data || [], "nunitcode",
                            "sunitname", undefined, undefined, true).get("OptionList");

                        Priority = constructOptionList(response[12].data || [], "nprioritycode",
                            "spriorityname", undefined, undefined, true).get("OptionList");

                        Period = constructOptionList(response[13].data || [], "nperiodcode",
                            "speriodname", undefined, undefined, true).get("OptionList");

                        Manufacturer = constructOptionList(response[14].data || [] || [], "nmanufcode",
                            "smanufname", undefined, undefined, true).get("OptionList");

                        if (selectedRecord["nclientcode"] !== -1 && selectedRecord.nclientcode.value === undefined) {
                            selectedRecord["nclientcode"] = { value: selectedRecord.nclientcode, label: selectedRecord.sclientname };
                        }
                        if (selectedRecord["nsuppliercode"] !== -1) {
                            selectedRecord["nsuppliercode"] = { value: selectedRecord.nsuppliercode, label: selectedRecord.ssuppliername };
                        }
                        if (selectedRecord["ncontainertypecode"] !== -1) {
                            selectedRecord["ncontainertypecode"] = { value: selectedRecord.ncontainertypecode, label: selectedRecord.scontainertype };
                        }
                        if (selectedRecord["ndisposition"] !== -1) {
                            selectedRecord["ndisposition"] = { value: selectedRecord.ndisposition, label: selectedRecord.sdispositionname };
                        }
                        if (selectedRecord["ntotalunitcode"] !== -1) {
                            selectedRecord["ntotalunitcode"] = { value: selectedRecord.ntotalunitcode, label: selectedRecord.sunitname };
                        }
                        if (selectedRecord["npriority"] !== -1) {
                            selectedRecord["npriority"] = { value: selectedRecord.npriority, label: selectedRecord.spriorityname };
                        }
                        if (selectedRecord["nperiodconfigcode"] !== -1) {
                            selectedRecord["nperiodconfigcode"] = { value: selectedRecord.nperiodconfigcode, label: selectedRecord.speriodname };
                        }
                        if (selectedRecord["nmanufcode"] !== -1) {
                            selectedRecord["nmanufcode"] = { value: selectedRecord.nmanufcode, label: selectedRecord.smanufname };
                        }
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ProductCategory: [],
                            Goodsin: constructOptionList(response[0].data || [], "nrmsno", "nrmsno", undefined, undefined, true).get("OptionList"),
                            EProtocol: constructOptionList(response[1].data || [], "neprotocolcode", "seprotocolname", undefined, undefined, true).get("OptionList"),
                            Client, Supplier, ContainerType, Disposition, Unit, Priority, Period,
                            AgaramTree: response[2].data["AgaramTree"],
                            FocusKey: response[2].data["FocusKey"],
                            ActiveKey: response[2].data["ActiveKey"],
                            OpenNodes: response[2].data["OpenNodes"],
                            Manufacturer,
                            plasmaMasterFile,
                            //plasmaMasterFile: response[2].data["PlasmaMasterFile"] || [],
                            ProductMaholder: response[2].data["ProductMAHolder"] || [],
                            statustoEditDetail: response[2].data["ApprovalConfigRole"] || {},
                            timeZoneList: constructOptionList(response[3].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true).get("OptionList"),
                            StorageCondition: constructOptionList(response[4].data || [], "nstorageconditioncode", "sstorageconditionname", undefined, undefined, true).get("OptionList"),
                            StorageLocation: constructOptionList(response[5].data || [], "nstoragelocationcode", "sstoragelocationname", undefined, undefined, true).get("OptionList"),
                            currentTime,
                            operation,
                            screenName: popUpLabel,
                            PopUpLabel: popUpLabel,
                            selectedRecord,
                            openModal: true,
                            ncontrolCode: inputParam.editRegParam.ncontrolCode,
                            loadPreregister: true,
                            loadTest: false,
                            loadComponent: false,
                            parentPopUpSize: "xl",
                            loading: false,
                            showSample: undefined,
                            regRecordToEdit:recordToEdit

                        }
                    })
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            })
        //} else {
        // const alertstatus=masterData.selectedProduct.stransdisplaystatus+"CANNOTBEEEDITED";
        // toast.warn(masterData.selectedProduct.sproductname +" : " +this.props.formatMessage({id:alertstatus}));
        //}
    }
}

export function updateRegistration(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/updateRegistration", inputParam.inputData)
            .then(response => {
                sortData(response.data);
                replaceUpdatedObject(response.data["selectedSample"], masterData.RegistrationGetSample, "npreregno");
                replaceUpdatedObject(response.data["selectedSubSample"], masterData.RegistrationGetSubSample, "ntransactionsamplecode");
                // replaceUpdatedObject(response.data["selectedTest"], masterData.RegistrationGetTest, "ntransactiontestcode");
                let RegistrationGetTest = response.data["selectedTest"];
                masterData = {
                    ...masterData,
                    selectedSample: response.data["selectedSample"],
                    selectedSubSample: response.data["selectedSubSample"],
                    selectedTest: RegistrationGetTest.length>0?[RegistrationGetTest[0]]:[],
                    RegistrationGetTest
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                        loadPreregister: false, selectedRecord: undefined, showSample: undefined
                    }
                });
                let inputData = {
                    masterData,
                    selectedTest: masterData.selectedTest,
                    ntransactiontestcode: masterData.selectedTest ?
                        String(masterData.selectedTest.map(item => item.ntransactiontestcode).join(",")) : "-1",
                    npreregno: masterData.selectedSample ?
                        masterData.selectedSample.map(item => item.npreregno).join(",") : "-1",
                    userinfo: inputParam.inputData.userinfo,
                    activeTestTab : masterData.activeTestTab,
                    screenName: masterData.activeTestTab,
                    resultDataState: inputParam.resultDataState,
                    testCommentDataState: inputParam.testCommentDataState,
                }
                dispatch(getTestChildTabDetail(inputData, true))
            })
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
                else if (error.response.status === 302) {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false, loadEsign:false,
                            regEditParam: inputParam,
                            showConfirmAlert: true,
                            parentPopUpSize: "xl",
                            regDateEditConfirmMessage: error.response.data, showSample: undefined
                        }
                    });
                }
                else {
                    toast.warn(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}

export const addMoreTest = (inputParam, ncontrolCode) => {
    return (dispatch) => {
        let { sampleList } = inputParam;
        let value = false;
       value = inputParam.selectedsample.some(obj=> obj.nspecsampletypecode !== inputParam.selectedsample[0].nspecsampletypecode)
       if(value)
       {
          return toast.warn(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESPECANDCOMPONENT" }));
       }
        sampleList = sampleList ? [...sampleList.slice(inputParam.skip, inputParam.take)] : [];
        const selectedsample = getSameRecordFromTwoArrays(sampleList, inputParam.selectedsample, "npreregno");
        const selectsubsample = getSameRecordFromTwoArrays(sampleList, inputParam.selectedsubsample, "npreregno");
        if (selectedsample && selectedsample.length > 0) {
            const findTransactionStatus = [...new Set(selectedsample.map(item => item.ntransactionstatus))];
           
            if (findTransactionStatus.length === 1) {
                if (findTransactionStatus[0] !== transactionStatus.REJECT && findTransactionStatus[0] !== transactionStatus.CANCELLED) {
                   if (findTransactionStatus[0] !== transactionStatus.CERTIFIED && findTransactionStatus[0] !== transactionStatus.SENT) {
                        const findApprovalVersion = [...new Set(selectedsample.map(item => item.napprovalversioncode))];
                        if (findApprovalVersion.length === 1) {
                            const findSampleSpec = [...new Set(selectedsample.map(item => item.nallottedspeccode))];
                            const findComponent = [...new Set(selectsubsample.map(item => item.ncomponentcode))];
                            if (findSampleSpec.length === 1 && findComponent.length === 1) {
                                dispatch(initRequest(true));
                                rsapi.post("/registration/getMoreTest", { ...inputParam })
                                    .then(response => {
                                        dispatch({
                                            type: DEFAULT_RETURN,
                                            payload: {
                                                availableTest: response.data,
                                                loadChildTest: true,
                                                loading: false, ncontrolCode,
                                                screenName: "IDS_TEST",
                                                operation: "create",
                                                openModal: true,
                                                parentPopUpSize: "lg",
                                                selectedRecord: {},
                                                showSample: undefined
                                            }
                                        });
                                    })
                                    .catch(error => {
                                        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                                        if (error.response.status === 500) {
                                            toast.error(error.message);
                                        } else {
                                            toast.warn(this.props.formatMessage({ id: error.response.data }));
                                        }
                                    });
                            } else {
                                toast.warn(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESPECANDCOMPONENT" }));
                            }
                        } else {
                            toast.warn(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMEAPPROVALCONFIG" }));
                        }
                    }
                    else{
                        toast.warn(intl.formatMessage({ id: "IDS_TESTCANNOTBEFORCERTIFIEDSAMPLES" }));
                    }
                }
                  else {
                ////     toast.warn(intl.formatMessage({ id: "IDS_TESTCANNOTBEFORCANCELLEDREJECTSAMPLES" }));
                      toast.warn(intl.formatMessage({ id: "IDS_SAMPLEISREJECTEDORCANCELLED" }));
                }
            } else {
                toast.warn(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESTATUS" }));
            }
        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTSAMPLE" }));
        }
    }
      
}  

export const createRegistrationTest = (inputParam, masterData, modalName) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
            .then(response => {

                // inputParam.responseKeyList.forEach(item => {
                //     if (item.dataAction === "add") {
                //         updatedObjectWithNewElement(masterData[item.masterDataKey], response.data[item.responseKey]);
                //     } else if (item.dataAction === "update") {
                //         replaceUpdatedObject(response.data[item.responseKey], masterData[item.masterDataKey], item.primaryKey);
                //     }
                // });

                // let RegistrationGetSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.RegistrationGetSample);

                // let selectedSample = response.data["selectedSample"];
                // let RegistrationGetSubSample = response.data["selectedSubSample"];
                // let RegistrationGetTest = response.data["selectedTest"];
                // let selectedSubSample = RegistrationGetSubSample;
                // let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];

                // if (inputParam.multipleselectionFlag) {
                //     selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                //     updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.RegistrationGetSubSample);
                //     updatedObjectWithNewElement(response.data["selectedTest"], masterData.RegistrationGetTest);
                //     RegistrationGetSubSample = masterData.RegistrationGetSubSample;
                //     RegistrationGetTest = masterData.RegistrationGetTest;
                // }
                //   let lst=response.data["selectedTest"];


                //let RegistrationGetTest = getRemovedRecordAndAddNewRecord(masterData["RegistrationGetTest"], response.data["RegistrationGetTest"], inputParam.inputData.RegistrationSample, "ntransactionsamplecode");
                let RegistrationGetTest = updatedObjectWithNewElement(masterData["RegistrationGetTest"],response.data["check"]);
                masterData = {
                    ...masterData,
                    RegistrationGetTest,
                    selectedTest: response.data["check"],
                    RegistrationParameter: response.data.RegistrationParameter,
                    RegistrationGetSample: replaceUpdatedObject(response.data.selectedSample, masterData.RegistrationGetSample, 'npreregno')
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        [modalName]: false,
                        loading: false,
                        loadChildTest: false,
                        showSample: undefined
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    }
}

export function getCountryList(inputParam) {
    return (dispatch) => {
         if (inputParam.selectedSample.every(checkCancelAndReject)) {
            return  toast.warn(intl.formatMessage({ id: "IDS_CANNOTADDSOURCEFORCANCELREJECTSAMPLE" })); 
        }
        const inputData = {
            npreregno: inputParam.sample.npreregno,
            userinfo: inputParam.userInfo
        }
        dispatch(initRequest(true))
        rsapi.post("registration/getCountryList", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        sourceCountry: response.data,
                        selectedSourceData: [],
                        loadPoolSource: true,
                        openModal: true,
                        loading: false,
                        loadTest: false,
                        loadComponent: false,
                        loadSource: false,
                        loadFile: false,
                        loadPreregister: false,
                        showSaveContinue: false,
                        parentPopUpSize: 'lg',
                        operation: "create",
                        screenName: "Source",
                        insertSourcePreregno: inputParam.sample.npreregno,
                        ncontrolcode: inputParam.ncontrolcode
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(this.props.formatMessage({ id: error.response.data }));
                }
            });
    }
}

export function cancelSampleAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/registration/cancelSample", inputParam.inputData)
            .then(response => {
                replaceUpdatedObject(response.data["selectedSample"], LoginProps.RegistrationGetSample, "npreregno");
                replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                let masterData = {
                    ...LoginProps,
                    selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno"),
                    selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.selectedSubSample, "ntransactionsamplecode"),
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.selectedTest, "ntransactiontestcode"),
                }
                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: {
                //         masterData,
                //         loading: false,
                //         loadEsign: false,
                //         openModal: false
                //     }
                // });
                let respObject = {
                    masterData,
                    ...inputParam.inputData,
                    loading: false,
                    loadEsign: false,
                    openModal: false,
                    showSample: undefined
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data.rtn);
                }
            })
    }
}

export function validateEsignforRegistration(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi.post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data === "Success") {

                    const methodUrl = "registration";
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                    }
                    //dispatch(inputParam["screenData"]["inputParam"].performAction(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
                    dispatch(dispatchMethods(inputParam["screenData"]))
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    };
}

function dispatchMethods(screenData) {
    return (dispatch) => {
        let action = screenData.inputParam.action
        switch (action) {
            case "preregister":
                dispatch(insertRegistration(screenData.inputParam, screenData.masterData));
                break;
            case "editSample":
                dispatch(updateRegistration(screenData.inputParam, screenData.masterData, 'openModal'));
                break;
            case "accept":
                dispatch(acceptRegistration(screenData.inputParam, screenData.masterData));
                break;
            case "quarantine":
                dispatch(preregRecordToQuarantine(screenData.inputParam, screenData.masterData));
                break;
            case "cancelTest":
                dispatch(cancelTestAction(screenData.inputParam, screenData.masterData));
                break;
            case "cancelSample":
                dispatch(cancelSampleAction(screenData.inputParam, screenData.masterData));
                break;
            case "addregsourcecountry":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "openModal"))
                break;
            case "deleteregsourcecountry":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "openModal"))
                break;
            case "printer":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "openModal"))
                break;
            default:
                break;
        }
    }
}

export function getPrinterComboService(inputParam) {
    return (dispatch) => {
        if (inputParam.sample.ntransactionstatus !== transactionStatus.PREREGISTER && inputParam.sample.ntransactionstatus !== transactionStatus.QUARANTINE
            && inputParam.sample.ntransactionstatus !== transactionStatus.CANCELLED && inputParam.sample.ntransactionstatus !== transactionStatus.REJECT) {
            dispatch(initRequest(true))
            rsapi.post("barcode/getPrinter", inputParam.userInfo)
                .then(response => {
                    let selectedPrinterData = {}
                    selectedPrinterData['sprintername'] = { value: response.data[0].sprintername, label: response.data[0].sprintername, item: response.data[0] }
                    const printerList = constructOptionList(response.data || [], "sprintername",
                        "sprintername", undefined, undefined, true).get("OptionList");

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            printer: printerList,
                            selectedPrinterData: selectedPrinterData,
                            loadPoolSource: false,
                            loadPrinter: true,
                            openModal: true,
                            loading: false,
                            loadTest: false,
                            loadComponent: false,
                            loadSource: false,
                            loadFile: false,
                            loadPreregister: false,
                            showSaveContinue: false,
                            parentPopUpSize: 'lg',
                            operation: "print",
                            screenName: "PrintBarcode",
                            insertPrinterPreregno: inputParam.sample.npreregno,
                            ncontrolcode: inputParam.ncontrolcode,
                            loadEsign: false,
                            showSample: undefined

                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                });
        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTREGISTERSAMPLESTOPRINTBARCODE" }));
        }
    }

}

export const getRegSpecification = (inputParam, masterData, getComponents) => {
    return (dispatch) => {

        if (inputParam.selectedNode !== null) {
            dispatch(initRequest(true));
            rsapi.post("/registration/" + inputParam.operation + inputParam.methodUrl, { ...inputParam, ntreetemplatemanipulationcode: inputParam.selectedNode.ntemplatemanipulationcode })
                .then(response => {
                    sortData(response.data);
                    let Specification = constructOptionList(response.data || [], "nallottedspeccode", "sspecname", false, false, true).get("OptionList");
                    let selectedComponent = undefined;
                    if (masterData.RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {

                        inputParam.selectedRecord["nallottedspeccode"] = "";
                        inputParam.selectedRecord["sversion"] = ""
                        inputParam.selectedRecord["ntemplatemanipulationcode"] = -1

                    } else {

                        inputParam.selectedRecord["nallottedspeccode"] = Specification.length > 0 ? Specification[0] : "";
                        inputParam.selectedRecord["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : "";
                        inputParam.selectedRecord["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1;

                    }



                    //Routine Start
                    // if (getComponents) {
                    //     let inputData = {
                    //         ntemplatemanipulationcode: Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1,
                    //         nallottedspeccode: Specification.length > 0 ? Specification[0].item.nallottedspeccode : -1,
                    //         testrequired: false,
                    //         userinfo: inputParam.userinfo
                    //     }
                    //     rsapi.post("/registration/getComponentTestBySpec", inputData)
                    //         .then(componentResponse => {
                    //             Component = componentResponse.data.Component;
                    //             Test = componentResponse.data.Test;
                    //             let slno = Component.length > 0 ? Component[0].slno : -1;
                    //             selectedComponent = Component.length > 0 ? Component[0] : undefined

                    //             if (Object.keys(Test).length > 0) {
                    //                 SelectedTest = Test[slno];
                    //             }
                    //             dispatch({
                    //                 type: DEFAULT_RETURN,
                    //                 payload: {
                    //                     Component,
                    //                     Test,
                    //                     selectedComponent,
                    //                     SelectedTest,
                    //                 }
                    //             })
                    //         })
                    //         .catch(error => {
                    //             dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    //             if (error.response.status === 500) {
                    //                 toast.error(error.message);
                    //             } else {
                    //                 toast.warn(intl.formatMessage({ id: error.response.data }));
                    //             }
                    //         })
                    // }
                    //Routine End
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ActiveKey: inputParam.activeKey,
                            FocusKey: inputParam.focusKey,
                            primaryKey: inputParam.primaryKey,
                            Specification: Specification,
                            selectedNode: inputParam.selectedNode,
                            selectedRecord: inputParam.selectedRecord,
                            Component:[],
                            Test:[],
                            selectedComponent,
                            SelectedTest:[],
                            loading: false,
                            showSample: undefined
                            ,SelectedSource:[],Source:[]
                        }
                    }
                    );
                })
                .catch(error => {
                    if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                });
        }
    }
}

export function getTestByComponentChange(listData, selectedobject, LoginProps,nneedservice) {
    return function (dispatch) {

        if (Object.keys(selectedobject).length > 0) {
            dispatch(initRequest(true));
            if(nneedservice===false||nneedservice===undefined){
            //rsapi.post("/registration/getTestfromDB", { "Component": objComponent })
            rsapi.post("/registration/getTestfromDB", {
                nspecsampletypecode: selectedobject.nspecsampletypecode,
                slno: selectedobject.slno
            })
                .then(response => {
                    let TestData = response.data;
                    let Test = LoginProps.Test || [];
                    Test[selectedobject.slno] = TestData;
                    delete selectedobject.nneedservice
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            Component: listData, selectedComponent: selectedobject, loadComponent: false, openChildModal: false,
                            selectComponent: undefined, parentPopUpSize: "xl", Test, SelectedTest: TestData, loading: false, showSample: undefined
                        }
                    });
                })
                .catch(error => {
                    toast.error(error.message);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                })
            }else{
               // let TestData = response.data;
                let Test = LoginProps.Test || [];
                Test[selectedobject.slno] =[];
                delete selectedobject.nneedservice
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Component: listData, selectedComponent: selectedobject, loadComponent: false, openChildModal: false,
                        selectComponent: undefined, parentPopUpSize: "xl", Test, SelectedTest: [], loading: false, showSample: undefined
                    }
                });
            }
        } else {
            //toast.warn("select Component to Add Test");
            toast.warn(intl.formatMessage({ id: "IDS_SELECTCOMPONENTTOADDTEST" }));
        }
    }
}

