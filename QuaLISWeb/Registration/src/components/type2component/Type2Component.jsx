import React from 'react';
import { connect } from 'react-redux';
import {  injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component.jsx';
import Esign from '../../pages/audittrail/Esign.js';
import SlideOutModal from '../slide-out-modal/SlideOutModal.jsx';
import { getFieldSpecification } from './Type2FieldSpecificationList.jsx';
import AddType2Component from './AddType2Component.js';
import { callService, crudMaster, updateStore, validateEsignCredential, fetchRecord } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes.js';
import { showEsign, getControlMap, extractFieldHeader } from '../CommonScript.js';
import { ListWrapper} from '../client-group.styles.jsx';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Type2Component extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.fieldList = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
        };
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    openModal = (ncontrolCode) => {
        let selectedRecord = { "ndefaultstatus": 4 };
        if (this.props.Login.userInfo.nformcode === 12) {
            selectedRecord = { "nsafetymarkermand": 4 }
        }
        else if (this.props.Login.userInfo.nformcode === 13) {
            selectedRecord = { "nproducttypemand": 4 }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord, operation: "create", ncontrolCode,selectedId:null,
                openModal: true, screenName: this.props.Login.inputParam.displayName
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId:null }
        }
        this.props.updateStore(updateInfo);

    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    render() {
        let primaryKeyField = "";
        let fieldList = {};
        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        if (this.props.Login.inputParam !== undefined) {
            fieldList = getFieldSpecification().get(this.props.Login.inputParam.methodUrl) || [];
            this.extractedColumnList = extractFieldHeader(Object.values(fieldList));
            if(this.props.Login.masterData.length>0){
                if(this.props.Login.masterData[0]["jsondynamicstring"]!==null && this.props.Login.masterData[0]["jsondynamicstring"]!==undefined){
                   let columnlist=[]
                   Object.keys(JSON.parse(this.props.Login.masterData[0]["jsondynamicstring"])).map(item=>{
                        
                   const fileds={
                   }
                   fileds["controlType"]="text"
                   fileds["idsName"]=item
                   fileds["dataField"]=item
                   fileds["width"]="200px"
                   fileds["mandatory"]= false
                   
                    columnlist.push(fileds)
                     
                    }) 
                    this.extractedColumnList= [...this.extractedColumnList,...columnlist]
                }
    
            }
            primaryKeyField = Object.keys(fieldList).length > 0 ? fieldList[0].dataField : "";

        }

      

        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
               && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
    
        const editParam = {screenName:this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation:"update",  primaryKeyField, 
            inputParam:this.props.Login.inputParam,   userInfo:this.props.Login.userInfo,  ncontrolCode:editId};

        const deleteParam ={operation:"delete"};

        const mandatoryFields=[];
        this.extractedColumnList.forEach(item=>item.mandatory === true ? 
            mandatoryFields.push(item) :""
        );        

        return(<>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {/* <PrimaryHeader className="d-flex justify-content-between mb-3">
                                <HeaderName className="header-primary-md">
                                    {this.props.Login.inputParam  && this.props.Login.inputParam.displayName ?
                                        <FormattedMessage id={this.props.Login.inputParam.displayName} defaultMessage=""/> : ""}
                                </HeaderName>
                                <Button className="btn btn-user btn-primary-blue"
                                    hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                    onClick={() => this.openModal(addId)} role="button">
                                    <FontAwesomeIcon icon={faPlus} /> {}
                                    <FormattedMessage id={"IDS_ADD"} defaultMessage='Add' />
                                </Button>
                            </PrimaryHeader> */}

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchRecord}
                                    editParam={editParam}
                                    deleteRecord={this.deleteRecord}
                                    deleteParam={deleteParam}
                                    reloadData={this.reloadData}
                                    addRecord = {() => this.openModal(addId)}
                                    pageable={true}
                                    scrollable={'scrollable'}
                                    // isComponent={true}
                                    gridHeight = {'600px'}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>

                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.openModal ? 
                    <SlideOutModal show={this.props.Login.openModal}
                        // className = "k-animation-container"
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        // addComponentParam={{}}                   
                        // addComponent={this.addComponent}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddType2Component
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                extractedColumnList={this.extractedColumnList}
                            />}
                    />
                :""}

            </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
               
               this.props.Login.masterData&&this.props.Login.masterData.map(item=>{
                   if(item["jsonstring"]!==null&&item["jsonstring"]!==undefined){
                    const jsonstring=JSON.parse(item["jsonstring"]);
                Object.keys(jsonstring).map((key) => {
                    item[key]=jsonstring[key]
                })
                       }
                       if(item["jsondynamicstring"]!==null&&item["jsondynamicstring"]!==undefined){
                        const jsonstring=JSON.parse(item["jsondynamicstring"]);
                    Object.keys(jsonstring).map((key) => {
                        item[key]=jsonstring[key]
                    })
                           }
                   
                })

                
              
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData||[],
                    dataResult: process(this.props.Login.masterData||[], this.state.dataState),
                });
            }
            else {
                let {dataState}=this.state;
                if(this.props.Login.dataState===undefined){
                    dataState={skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                }

                this.props.Login.masterData&&this.props.Login.masterData.map(item=>{
                    if(item["jsonstring"]!==null&&item["jsonstring"]!==undefined){
                     const jsonstring=JSON.parse(item["jsonstring"]);
                 Object.keys(jsonstring).map((key) => {
                     item[key]=jsonstring[key]
                 })
                        }
                        if(item["jsondynamicstring"]!==null&&item["jsondynamicstring"]!==undefined){
                            const jsonstring=JSON.parse(item["jsondynamicstring"]);
                        Object.keys(jsonstring).map((key) => {
                            item[key]=jsonstring[key]
                        })
                               }
                    
                 })
                this.setState({
                    data: this.props.Login.masterData||[], selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData||[], dataState),
                    dataState
                });
            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    // addComponent=(addComponentParam)=>{
    //     if(this.props.Login.loadEsign){
    //         return <Esign operation={this.props.Login.operation}
    //             onInputOnChange={this.onInputOnChange}
    //             inputParam={this.props.Login.inputParam}
    //             selectedRecord={this.state.selectedRecord || {}}
    //         />
    //     }
    //     else{
    //         return <AddType2Component
    //                 selectedRecord={this.state.selectedRecord || {}}
    //                 onInputOnChange={this.onInputOnChange}
    //                 extractedColumnList={this.extractedColumnList}
    //                 failedControls={addComponentParam.failedControls ||[]}
    //             />
    //     }
    // }

    // = (selectedRecord, operation, ncontrolCode) => {
    deleteRecord = (deleteParam) =>{
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation:deleteParam.operation,
            dataState:this.state.dataState
        }

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode,deleteParam.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation:deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
        //add / edit            
        // const mandatoryFields=[]
        // let validationPassed = true;
        // this.extractedColumnList.forEach(item=>item.mandatory === true ? 
        //     this.state.selectedRecord[item.dataField].trim().length === 0 ? validationPassed=false :"":""
        // );
       
        // if (validationPassed){
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            let dataState =undefined;
            let selectedId = null;
            const jsonstring  ={} 
            if (this.props.Login.operation === "update") {
                // edit
                dataState=this.state.dataState
                inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;
                this.extractedColumnList.map(item => {
                    let fieldName = item.dataField;
                    if (item.controlType === "checkbox") {
                        fieldName = item.controlName
                    }
                    return jsonstring[fieldName] =this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : "";
                })
                selectedId = this.props.Login.selectedId; 
            }
            else {
                //add      
                 
                inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
                inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nstatus"] = 1;
                this.extractedColumnList.map(item => {
                    let fieldName = item.dataField;
                    if (item.controlType === "checkbox") {
                        fieldName = item.controlName
                    }

                   
                    return jsonstring[fieldName] =this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : "";
                })
            }

            Object.keys(jsonstring).map((key) => {
              delete inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][key]
            })

            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]['jsonstring'] =JSON.stringify(jsonstring);
            
            
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: this.props.Login.inputParam.methodUrl,
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData, selectedId,
                operation: this.props.Login.operation, saveType, formRef,dataState
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        // }else{
        //     console.log("validation status:", validationPassed);
        // }
    }
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"]
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    fetchRecord
})(injectIntl(Type2Component));