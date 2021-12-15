import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ListWrapper, PrimaryHeader } from '../../components/client-group.styles'
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { callService, crudMaster, fetchRecordComponent, updateStore, validateEsignCredential } from '../../actions';
import Esign from '../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import DataGrid from '../../components/data-grid/data-grid.component';
import { showEsign, getControlMap } from '../../components/CommonScript';
import AddComponent from '../product/AddComponent';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { transactionStatus } from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Component extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            // addScreen: false, 
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState, requiredSymbol: 0,
            storageCondition: [], productDescription: [],
            productType: [], bulkType: [],
            isOpen: false, controlMap: new Map(), userRoleControlRights: []
        }

        this.mandatoryColumnList = [
            { "idsName": "IDS_COMPONENT","mandatory": true, "dataField": "scomponentname", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"  },
            { "idsName": "IDS_COMPONENTSHORTNAME","mandatory": true, "dataField": "scomponentshortname", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"  },
            { "idsName": "IDS_STORAGECONDITION", "mandatory": true,"dataField": "nstorageconditioncode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"  },
            { "idsName": "IDS_FINALPRODUCTUSAGE","mandatory": true, "dataField": "nproductdesccode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"  }
          
        ]
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
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
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;//{ addScreen: props.Login.showScreen }
    }

    handleChange = (value, valueParam, isMandate) => {

        if (value !== null) {

            let checkValue = 0;
            const selectedRecord = this.state.selectedRecord || {};

            // selectedRecord[valueParam] = value.value;
            selectedRecord[valueParam] = value;

            if (isMandate === "isMandate") {
                if (this.props.Login.productDescription.length > 0 && value.value !== undefined) {
                    //console.log(" Find : ", this.props.Login.productDescription, parseInt(value.value));
                    this.props.Login.productDescription.map(item => {

                        // if (item.nproductdesccode === parseInt(value.value)) {
                        if (item.item.nproductdesccode === parseInt(value.value)) {
                            return checkValue = item.item.nproducttypemand === 3 ? 1 : 0;
                        }
                        return checkValue;
                    })
                }
            }
            if (isMandate === "isMandate") {
                this.setState({ requiredSymbol: checkValue, selectedRecord });
            }
            else {
                this.setState({ selectedRecord });
            }
        }
        else{

            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[valueParam] = undefined;
            this.setState({ selectedRecord });

        }
    }

    render() {

        let primaryKeyField = "";

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const addParam = {
            screenName: this.props.Login.screenName,
            primaryKeyField, undefined, operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, addId
        }
        const editParam = {
            screenName: this.props.Login.screenName, primaryKeyField: "ncomponentcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };
        const deleteParam = { operation: "delete" };
       
       

        this.extractedColumnList = [
            { "idsName": "IDS_COMPONENT", "dataField": "scomponentname", "width": "200px" },
            { "idsName": "IDS_COMPONENTSHORTNAME", "dataField": "scomponentshortname", "width": "200px" },
            { "idsName": "IDS_TRANSACTIONSTATUSACTIVE", "dataField": "sdisplaystatus", "width": "200px", "isIdsField": true, "controlName": "ntransactionstatus" }
        ]
        this.detailedFieldList = [
            { "idsName": "IDS_STORAGECONDITION", "dataField": "sstorageconditionname", "columnSize":"4"},
            { "idsName": "IDS_FINALPRODUCTUSAGE", "dataField": "sfinalproduct",  "columnSize":"4"},
            { "idsName": "IDS_UPSTREAMPRODUCTTYPE", "dataField": "supstreamproduct", "columnSize":"4" },
            { "idsName": "IDS_BULKTYPE", "dataField": "sbulktype", "columnSize":"4" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "columnSize":"8" },
           
           // { "idsName": "IDS_TRANSACTIONSTATUSACTIVE", "dataField": "sdisplaystatus", "width": "200px", "isIdsField": true, "controlName": "ntransactionstatus" }
        ];
        primaryKeyField = "ncomponentcode";
        const mandatoryFields=[];
        this.mandatoryColumnList.forEach(item=>item.mandatory === true ? 
            mandatoryFields.push(item) :""
        ); 
        if(this.state.requiredSymbol === 1){            
            mandatoryFields.push({ "idsName": "IDS_UPSTREAMPRODUCTTYPE","mandatory": true, "dataField": "nproducttypecode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"  });
        }
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <PrimaryHeader className="d-flex justify-content-between mb-3">
                                {/* <HeaderName className="header-primary-md">
                                    {this.props.Login.inputParam ?
                                        <FormattedMessage id={'IDS_COMPONENT'} /> : ""}
                                </HeaderName> */}
                                {/* <Button className="btn btn-user btn-primary-blue"
                                    hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                    onClick={() => this.props.fetchRecordComponent(addParam)} role="button">
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id={'IDS_ADD'} defaultMessage='Add' />
                                </Button> */}
                            </PrimaryHeader>
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    detailedFieldList={this.detailedFieldList}
                                    expandField="expanded"
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchRecordComponent}
                                    deleteRecord={this.deleteRecord}
                                    addRecord={() => this.props.fetchRecordComponent(addParam)}
                                    deleteParam={deleteParam}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                   // isComponent={true}
                                    gridHeight = {"600px"}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    scrollable={"scrollable"}
                                    pageable={true}
                                    selectedId={this.props.Login.selectedId}
                                    hasDynamicColSize={true}
                                // pageable={{ buttonCount: 4, pageSizes: true }}
                                // pageable={true}
                                />
                                : ""}

                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
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
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                // formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <AddComponent
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                handleChange={this.handleChange}
                                // formatMessage={this.props.intl.formatMessage}

                                storageCondition={this.props.Login.storageCondition}
                                productDescription={this.props.Login.productDescription}
                                productType={this.props.Login.productType}
                                bulkType={this.props.Login.bulkType}

                                // nstorageconditioncode={this.props.Login.nstorageconditioncode}
                                // nproductdesccode={this.props.Login.nproductdesccode}
                                // nproducttypecode={this.props.Login.nproducttypecode}
                                // nbulktypecode={this.props.Login.nbulktypecode}
                                requiredSymbol={this.state.requiredSymbol}

                                extractedColumnList={this.extractedColumnList}
                            />
                        }
                    />
                }
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

                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }
                this.setState({
                    data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    isOpen: false,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord, requiredSymbol: this.props.Login.requiredSymbol });
        }
    }

    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    // deleteRecord = (selectedRecord, operation, ncontrolCode) => {
    deleteRecord = (deleteParam) => {
        if (deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded;
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            dataState: this.state.dataState
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
        // this.props.crudMaster(inputParam);
    }
    reloadData = () => {
        const inputParam = {
            inputData: { //"nsitecode": this.props.Login.userInfo.nmastersitecode 
                userinfo: this.props.Login.userInfo
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }
    onSaveClick = (saveType, formRef) => {

        //add / edit 
        let dataState = undefined;
        let operation = "";
        let inputData = [];
        let selectedId = null;
        let fieldList = ["nstorageconditioncode", "nproductdesccode", "nproducttypecode", "nbulktypecode",
            "ntransactionstatus", "ncomponentcode", "scomponentname", "scomponentshortname", "scomments"];
        inputData["userinfo"] = this.props.Login.userInfo;

        if (this.props.Login.operation === "update") {
            // edit    

            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
           // inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;
            fieldList.map(item => {
                if(item === "nstorageconditioncode" || item === "nproductdesccode"
                || item === "nproducttypecode" || item === "nbulktypecode"){

                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item].value : -1;
                }
                else{

                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                }
                return null;
            })
            operation = "update";
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId;
        }
        else {
            //add             
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            fieldList.map(item => {
                // return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
                if(item === "nstorageconditioncode" || item === "nproductdesccode"
                || item === "nproducttypecode" || item === "nbulktypecode"){

                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item].value : -1;
                }
                else{

                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                }
                return null;
            })
            operation = "create";
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef, dataState, selectedId
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
        //this.props.crudMaster(inputParam);

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
export default connect(mapStateToProps, { callService, crudMaster, fetchRecordComponent, updateStore, validateEsignCredential })(injectIntl(Component));