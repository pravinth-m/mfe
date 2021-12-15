import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
// import { css } from 'styled-components';
import ColumnMenu from '../../components/data-grid/ColumnMenu';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import { callService, crudMaster, updateStore, validateEsignCredential } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';
import { ListWrapper, AtTableWrap } from '../../components/client-group.styles'
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
import messages_en from '../../assets/translations/en.json';
import messages_de from '../../assets/translations/de.json';
import ReactTooltip from 'react-tooltip';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}
const messages = {
    'en-US': messages_en,
    'ko-KR': messages_de
}
class UserRoleConfiguration extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.columnWidth = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            addScreen: false, data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            selectedUserRole: {}, columnName:'', rowIndex: 0
        }
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
           
                loadEsign = false;
                openModal = false;              
                const data = [...this.state.data];
                if (this.state.selectedUserRole[this.state.columnName] === transactionStatus.YES){
                   data[this.state.rowIndex][this.state.columnName] = transactionStatus.NO; 

                }
                else{
                    data[this.state.rowIndex][this.state.columnName] = transactionStatus.YES; 

                }
                this.setState({ data });
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);

    }

    render() {
        loadMessages(messages[this.props.Login.userInfo.slanguagetypecode], "lang");
        // this.columnWidth = [{ "width": "35%" },{ "width": "35%" },{ "width": "35%" },{ "width": "35%" }];
        // this.columnWidth = [{ "width": "20%" },{ "width": "20%" },{ "width": "20%" },{ "width": "20%" },{ "width": "20%" }];
        this.extractedColumnList = ["nuserrolecode", "suserrolename", "nneedapprovalflow", "nneedresultflow"];
        //, "nneedproductflow", "nwithdrawnmail"
        const pageSizes = this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting))
        return (<>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' />
                            <AtTableWrap className="at-list-table">
                                <LocalizationProvider language="lang">
                                    <>
                                    <Grid
                                        // className={this.setPercentage()}
                                        // sortable
                                        className={"active-paging"}
                                        style={{ height: '600px'}}
                                        resizable
                                        reorderable
                                        scrollable="none"
                                        pageable={ { buttonCount: 5, pageSizes: pageSizes , previousNext: false } }
                                        data={this.state.dataResult}
                                        {...this.state.dataState}
                                        onDataStateChange={this.dataStateChange}>

                                        <GridColumn 
                                            field="suserrolename" 
                                            columnMenu= {ColumnMenu}
                                            title={this.props.intl.formatMessage({ id: "IDS_USERROLENAME" })}
                                            cell={(row) => (
                                                <td data-tip={row["dataItem"]['suserrolename']} data-for="tooltip-grid-wrap">
                                                    {row["dataItem"]['suserrolename']}
                                                </td>
                                            )}
                                        />
                                        <GridColumn
                                            field={"nneedapprovalflow"}
                                            title={this.props.intl.formatMessage({ id: "IDS_NEEDAPPROVALFLOW" })}
                                            headerClassName="text-center" 
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }} data-tip={"kfkf"} data-for="tooltip-grid-wrap">
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nneedapprovalflow"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedapprovalflow", row.dataIndex)}
                                                        checked={row["dataItem"]["nneedapprovalflow"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        />
                                        <GridColumn
                                            field={"nneedresultflow"}
                                            title={this.props.intl.formatMessage({ id: "IDS_NEEDRESULTFLOW" })}
                                            headerClassName="text-center" 
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }}   data-tip="jdjd" data-for="tooltip-grid-wrap">
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nneedresultflow"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedresultflow", row.dataIndex)}
                                                        checked={row["dataItem"]["nneedresultflow"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        />
                                        {/* <GridColumn
                                            field={"nneedproductflow"}
                                            title={this.props.intl.formatMessage({ id: "IDS_NEEDPRODUCTFLOW" })}
                                            headerClassName="text-center"
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }}>
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nneedproductflow"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedproductflow", row.dataIndex)}
                                                        checked={row["dataItem"]["nneedproductflow"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        />
                                        <GridColumn
                                            field={"nwithdrawnmail"}
                                            width="175px"
                                            title={this.props.intl.formatMessage({ id: "IDS_WITHDRAWNEMAIL" })}
                                            headerClassName="text-center"
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }}>
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nwithdrawnmail"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nwithdrawnmail", row.dataIndex)}
                                                        checked={row["dataItem"]["nwithdrawnmail"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        />
                                        <GridColumn
                                            field={"nfailmail"}
                                            width="175px"
                                            title={this.props.intl.formatMessage({ id: "IDS_FAILEMAIL" })}
                                            headerClassName="text-center"
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }}>
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nfailmail"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nfailmail", row.dataIndex)}
                                                        checked={row["dataItem"]["nfailmail"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        /> */}
                                    </Grid>
                                    </>
                                </LocalizationProvider>
                            </AtTableWrap>
                            <ReactTooltip/>
                        </ListWrapper>
                    </Col>
                </Row>
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
                    selectedRecord={this.state.selectedRecord}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            formatMessage={this.props.intl.formatMessage}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        :
                        <>
                        </>
                    }
                />
            </>
        );
    }
    
    // setPercentage = () => {
    //     let styles = css;
    //     let idx = 1;
    //     this.columnWidth.forEach(item => {
    //         styles += `.k-grid-header col:nth-of-type(${idx}){
    //                 width: ${item.width}
    //             }
    //             .k-grid-table col:nth-of-type(${idx}){
    //                 width: ${item.width}
    //             }`
    //         idx++;
    //     })
    // }

    componentDidUpdate(previousProps) {
        ReactTooltip.rebuild();
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
                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        // if (this.props.Login.masterData !== previousProps.Login.masterData) {
        //     this.setState({
        //         data: this.props.Login.masterData,
        //         addScreen: this.props.Login.showScreen,
        //         dataResult: process(this.props.Login.masterData, this.state.dataState),
        //     });
        // }
    }
    onInputOnChangeRole(event, rowItem, columnName, rowIndex) {

        const selectedRecord = rowItem || {};
        const selectedUserRole = rowItem || {};
        let isCheck = false;

        if (columnName === "nneedresultflow") {
            if (event.target.checked === true) {
                if (rowItem["nneedapprovalflow"] === transactionStatus.YES) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVALFLOWORRESULTFLOW" }));
                }
                else {
                    isCheck = true;
                }
            }
            else {
                // toast.warn("If you want deselect, Select another role");
                isCheck = true;
            }

        }
        else if (columnName === "nneedapprovalflow") {
            if (event.target.checked === true) {
                if (rowItem["nneedresultflow"] === transactionStatus.YES) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVALFLOWORRESULTFLOW" }));
                }
                else {
                    isCheck = true;
                }
            }
            else {
                isCheck = true;
            }
        }
        else if (columnName === "nneedproductflow" || columnName === "nwithdrawnmail"|| columnName === "nfailmail") {
            isCheck = true;
        }

        if (isCheck === true) {
            selectedRecord[columnName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            selectedUserRole[columnName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            this.onSaveClick(selectedRecord, undefined, undefined);
            this.setState({selectedUserRole, columnName, rowIndex});
        }


    }
    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.name === "agree") {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });

    }


    onSaveClick = (selectedRecord, saveType, formRef) => {

        let operation = "";
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;


        // edit    
        inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = selectedRecord;
        this.extractedColumnList.map(item => {
            return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = selectedRecord[item] ? selectedRecord[item] : "";
        })
        operation = "update";

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, 114)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: operation//this.props.Login.operation
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
export default connect(mapStateToProps, { callService, crudMaster, updateStore, validateEsignCredential })(injectIntl(UserRoleConfiguration));