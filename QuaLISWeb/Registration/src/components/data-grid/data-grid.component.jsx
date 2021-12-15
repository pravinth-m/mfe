import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Nav, Image } from 'react-bootstrap';
import { Grid, GridColumn, GridToolbar, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import ConfirmDialog from '../confirm-alert/confirm-alert.component.jsx';
import SimpleGrid from './SimpleGrid.jsx';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { AtTableWrap, FormControlStatic, FontIconWrap } from '../data-grid/data-grid.styles.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck, faTrashAlt, faPencilAlt, faThumbsUp,
    faCopy, faPlus, faSync, faFileExcel, faFilePdf, faCloudDownloadAlt, faRedo, faEye
} from '@fortawesome/free-solid-svg-icons';
import ColumnMenu from './ColumnMenu.jsx';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import reject from '../../assets/image/reject.svg'
import CustomSwitch from '../custom-switch/custom-switch.component.jsx';// import '../../assets/styles/unicode-font.css';
import parse from 'html-react-parser';
import { toast } from 'react-toastify';
import FormCheckbox from '../form-checkbox/form-checkbox.component.jsx';
import messages_en from '../../assets/translations/en.json';
import messages_de from '../../assets/translations/de.json';
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
import { connect } from 'react-redux';
import { process } from '@progress/kendo-data-query';
import ReactTooltip from 'react-tooltip';

const messages = {
    'en-US': messages_en,
    'ko-KR': messages_de
}

class DataGrid extends React.Component {
    _pdfExport;
    _excelExport;

    detailBand = (props) => {
        return (
            <Row bsPrefix="margin_class">
                <Col md={12}>
                    {this.props.hasDynamicColSize ?
                        <Card>
                            <Card.Header><FormattedMessage id="IDS_MOREINFO" message="More Info" /></Card.Header>
                            <Card.Body className="form-static-wrap">
                                <Row style={{ marginLeft: -18 }}>
                                    {this.props.detailedFieldList.map((item) => {
                                        return (

                                            <Col md={item.columnSize}>
                                                <FormGroup>
                                                    <FormLabel><FormattedMessage id={item.idsName} message={item.idsName} /></FormLabel>
                                                    <FormControlStatic>
                                                        {props.dataItem[item.dataField] === undefined || props.dataItem[item.dataField] === null || props.dataItem[item.dataField].length === 0 ? '-' :
                                                            item.isIdsField ? <FormattedMessage id={props.dataItem[item.dataField]} message={props.dataItem[item.dataField]} /> : item.isHTML ? parse(props.dataItem[item.dataField]) : props.dataItem[item.dataField]}
                                                    </FormControlStatic>
                                                </FormGroup>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Card.Body>
                        </Card>
                        : this.props.hasChild ?
                            <SimpleGrid childList={this.props.childList.get(parseInt(props.dataItem[this.props.childMappingField])) || []}
                                extractedColumnList={this.props.childColumnList} />
                            :
                            <Card>
                                <Card.Header><FormattedMessage id="IDS_MOREINFO" message="More Info" /></Card.Header>
                                <Card.Body className="form-static-wrap">
                                    <Row>
                                        {this.props.detailedFieldList.map((item) => {
                                            return (

                                                <Col md={6}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={item.idsName} message={item.idsName} /></FormLabel>
                                                        <FormControlStatic>
                                                            {props.dataItem[item.dataField] === undefined || props.dataItem[item.dataField] === null || props.dataItem[item.dataField].length === 0 ? '-' :
                                                                item.isIdsField ? <FormattedMessage id={props.dataItem[item.dataField]} message={props.dataItem[item.dataField]} /> : item.isHTML ? parse(props.dataItem[item.dataField]) : props.dataItem[item.dataField]}
                                                        </FormControlStatic>
                                                    </FormGroup>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Card.Body>
                            </Card>}
                </Col> </Row>
        )
    }



    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;

        if (this.props.hasChild && event.value === true) {
            event.dataItem.expanded = !isExpanded;
            this.props.handleExpandChange(event, this.props.dataState)
        }
        else {
            event.dataItem.expanded = !isExpanded;
            this.setState({ isExpanded });
        }
    }

    exportExcel = () => {
        if (this.props.dataResult.data.length > 0) {
                this._excelExport.save();
        }
        else
            toast.info(this.props.intl.formatMessage({ id: "IDS_NODATATOEXPORT" }));
    }

    exportPDF = () => {
        if (this.props.dataResult.data.length > 0)
            this._pdfExport.save();
        else
            toast.info(this.props.intl.formatMessage({ id: "IDS_NODATATOEXPORT" }));
    }

    columnProps(field) {
        if (!this.props.hideColumnFilter) {
            return {
                field: field,
                columnMenu: ColumnMenu,
                headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
            };
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }

    handleClickDelete = (deleteParam) => {
        this.props.deleteRecord(deleteParam);
    }

    render() {
        loadMessages(messages[this.props.Login.userInfo.slanguagetypecode], "lang");
        const methodUrl = this.props.methodUrl ? this.props.methodUrl : (this.props.inputParam && this.props.inputParam.methodUrl);

        const addId = this.props.controlMap && this.props.controlMap.has("Add".concat(methodUrl))
            && this.props.controlMap.get("Add".concat(methodUrl)).ncontrolcode;

        const editId = this.props.controlMap && this.props.controlMap.has("Edit".concat(methodUrl))
            && this.props.controlMap.get("Edit".concat(methodUrl)).ncontrolcode;

        // const viewId = this.props.controlMap.has("View".concat(methodUrl))
        //     && this.props.controlMap.get("View".concat(methodUrl)).ncontrolcode;

        const deleteId = this.props.controlMap && this.props.controlMap.has("Delete".concat(methodUrl))
            && this.props.controlMap.get("Delete".concat(methodUrl)).ncontrolcode;

        // const defaultId = this.props.controlMap && this.props.controlMap.has("Default".concat(methodUrl))
        //     && this.props.controlMap.get("Default".concat(methodUrl)).ncontrolcode;

        const approveId = this.props.controlMap && this.props.controlMap.has("Approve".concat(methodUrl))
            && this.props.controlMap.get("Approve".concat(methodUrl)).ncontrolcode;

        const copyId = this.props.controlMap && this.props.inputParam && this.props.controlMap.has("Copy".concat(methodUrl))
            && this.props.controlMap.get("Copy".concat(methodUrl)).ncontrolcode;

        const completeId = this.props.controlMap && this.props.controlMap.has("Complete".concat(methodUrl))
            && this.props.controlMap.get("Complete".concat(methodUrl)).ncontrolcode;

        const switchId = this.props.controlMap && this.props.switchParam && this.props.controlMap.has(this.props.switchParam.operation.concat(methodUrl))
            && this.props.controlMap.get(this.props.switchParam.operation.concat(methodUrl)).ncontrolcode;

        const cancelId = this.props.controlMap && this.props.controlMap.has("Cancel".concat(methodUrl))
            && this.props.controlMap.get("Cancel".concat(methodUrl)).ncontrolcode;

        // const receiveGoodsId = this.props.controlMap.has("Receive".concat(methodUrl))
        //     && this.props.controlMap.get("Receive".concat(methodUrl)).ncontrolcode;
        const downloadId = this.props.controlMap && this.props.controlMap.has("Download".concat(methodUrl))
            && this.props.controlMap.get("Download".concat(methodUrl)).ncontrolcode;
            
        const resentId = this.props.controlMap && this.props.controlMap.has("Resent")
                    && this.props.controlMap.get("Resent").ncontrolcode;

        const selectedId = this.props.selectedId;
        // const confirmMessage = new ConfirmMessage();
        const pageSizes = this.props.pageSizes ? this.props.pageSizes : this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting))
        return (
            <>
                <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' />
                <AtTableWrap className="at-list-table" actionColWidth={this.props.actionColWidth ? this.props.actionColWidth : "150px"} >
                    {/* <Tooltip openDelay={100} position="bottom" tooltipClassName="ad-tooltip" anchorElement="element" parentTitle={true}> */}
                    <LocalizationProvider language="lang">
                        <ExcelExport
                            data={process(this.props.data || [], { sort: this.props.dataState.sort, filter: this.props.dataState.filter, group: this.props.dataState.group }).data}
                            filterable={true}
                            // fileName={this.props.inputParam && this.props.intl.formatMessage({ id: this.props.inputParam.displayName })}
                            group={this.props.dataState.group}
                            ref={(exporter) => {
                                // console.log(exporter);
                                this._excelExport = exporter;
                            }}>


                            <Grid
                                className={((this.props.dataResult && this.props.dataResult.length > 0) || (this.props.extractedColumnList && this.props.extractedColumnList.length > 0)) ? "active-paging" : "no-paging"}
                                style={{ height: this.props.gridHeight, width: this.props.gridWidth }}
                                sortable
                                resizable
                                reorderable={false}
                                scrollable={this.props.scrollable}
                                pageable={this.props.pageable ? { buttonCount: 5, pageSizes: pageSizes , previousNext: false } : ""}
                                groupable={this.props.groupable ? true : false}
                                detail={this.props.hideDetailBand ? false : this.detailBand}
                                expandField={this.props.expandField ? this.props.expandField : false}
                                onExpandChange={this.expandChange}
                                data={this.props.dataResult}
                                total={this.props.total}
                                {...this.props.dataState}
                                selectedField="selected"
                                onRowClick={this.props.handleRowClick}
                                onDataStateChange={this.props.dataStateChange}>

                                {this.props.isToolBarRequired ?
                                    <GridToolbar>
                                        {this.props.isAddRequired === false ? "" :
                                            <Button className="btn btn-icon-rounded btn-circle solid-blue" variant="link"
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                data-for="tooltip-grid-wrap"
                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(addId) === -1}
                                                onClick={() => this.props.addRecord(addId)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        }
                                        {this.props.isRefreshRequired === false ? "" :
                                            <Button className="btn btn-circle outline-grey" variant="link"
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                data-for="tooltip-grid-wrap"
                                                onClick={() => this.props.reloadData()}>
                                                <FontAwesomeIcon icon={faSync} />
                                            </Button>
                                        }
                                         {this.props.isDownloadPDFRequired === false ? "" :
                                            <Button className="btn btn-circle outline-grey" variant="link"
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOADPDF" })}
                                                data-for="tooltip-grid-wrap"
                                                onClick={this.exportPDF}>
                                                <FontAwesomeIcon icon={faFilePdf} />
                                            </Button>
                                        }
                                        {/* {this.props.isDownloadExcelRequired === false ? "" : */}
                                        <Button className="btn btn-circle outline-grey" variant="link"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOADEXCEL" })}
                                            data-for="tooltip-grid-wrap"
                                            onClick={this.exportExcel}>
                                            <FontAwesomeIcon icon={faFileExcel} />
                                        </Button>
                                        {/* } */}
                                        {/* {this.props.isExportExcelRequired === true ?
                                            <Button className="btn btn-circle outline-grey" variant="link"
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EXPORTPDF" })}
                                                data-for="tooltip-grid-wrap"
                                                onClick={() => this.props.exportExcelNew()}>
                                                <FontAwesomeIcon icon={faFileExcel} />
                                            </Button>
                                            : ""
                                        } */}
                                        {/* <Button className="btn btn-circle outline-grey" variant="link"
                                            title="Download Excel"
                                            onClick={this.exportExcel}>
                                            <FontAwesomeIcon icon={faFileExcel} />
                                        </Button> */}

                                    </GridToolbar>
                                    : ""}

                                {this.props.extractedColumnList.map((item, index) =>
                                    <GridColumn key={index}
                                        // data-tip={this.props.intl.formatMessage({ id: item.idsName })}
                                        title={this.props.intl.formatMessage({ id: item.idsName })}
                                        {...this.columnProps(item.dataField)}
                                        width={item.width}
                                        cell={(row) => (
                                            row.rowType === "groupHeader" ? null :
                                                item.componentName === "switch" ?
                                                    <td style={{ textAlign: "center" }}>
                                                        <CustomSwitch type="switch" id={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                            disabled={item.needRights ? this.props.userRoleControlRights
                                                                && this.props.userRoleControlRights.indexOf(
                                                                    this.props.controlMap.has(item.controlName) && this.props.controlMap.get(item.controlName).ncontrolcode
                                                                ) === -1 : false}
                                                            onChange={(event) => this.props.onSwitchChange({ ...this.props.switchParam, selectedRecord: row["dataItem"], ncontrolCode: switchId }, event)}
                                                            checked={row["dataItem"][item.switchFieldName] === item.switchStatus ? true : false}
                                                            name={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td> :
                                                    item.componentName === "checkbox" ?
                                                        <td>
                                                            <FormCheckbox
                                                                name={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                type="checkbox"
                                                                value={row["dataItem"][item.checkBoxField] !== 0 ? true : false}
                                                                isMandatory={false}
                                                                required={false}
                                                                //checked={row["dataItem"][item.checkBoxField] === item.switchStatus ? true : false}
                                                                checked={row["dataItem"][item.checkBoxField] !== 0 ? true : false}
                                                                onChange={(event) => this.props.onInputOnChange(event)}
                                                            />
                                                        </td> :

                                                        <td data-tip={row["dataItem"][item.dataField]} data-for="tooltip-grid-wrap"
                                                            className={selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}>

                                                            {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                                : row["dataItem"][item.dataField]}
                                                        </td>
                                        )}
                                    />
                                )
                                }

                                {this.props.isActionRequired ?
                                    <GridColumn
                                        locked
                                        headerClassName="text-center"
                                        title={this.props.intl.formatMessage({ id: 'IDS_ACTION' })}
                                        sort={false}
                                        cell={(row) => (

                                            row.rowType === "groupHeader" ? null :
                                                <td className={`k-grid-content-sticky k-command-cell selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''`} style={{ left: '0', right: '0', borderRightWidth: '1px', textAlign: 'center' }}>
                                                    <>
                                                        <Nav.Link className="action-icons-wrap">
                                                            <FontIconWrap className="d-font-icon"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                data-for="tooltip-grid-wrap"
                                                                data-place="left"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(editId) === -1}
                                                                onClick={() => this.props.fetchRecord({ ...this.props.editParam, primaryKeyValue: row["dataItem"][this.props.editParam.primaryKeyField], editRow: row["dataItem"],ncontrolCode: editId })}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </FontIconWrap>

                                                            {/* <FontAwesomeIcon icon={faEye}
                                                    title={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                    onClick={() => this.props.viewRecord({...this.props.viewParam, primaryKeyValue:row["dataItem"][this.props.viewParam.primaryKeyField], viewRow:row["dataItem"]})}/>
                                                 */}        <FontIconWrap className="d-font-icon" data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })} data-place="left"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                            >
                                                                <ConfirmDialog
                                                                    name="deleteMessage"
                                                                    cardTitle={this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" })}
                                                                    title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    message={this.props.intl.formatMessage({ id: "IDS_DELETECONFIRMMSG" })}
                                                                    doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                    doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                    icon={faTrashAlt}
                                                                    handleClickDelete={() => this.handleClickDelete({ ...this.props.deleteParam, selectedRecord: row["dataItem"], ncontrolCode: deleteId }, row)}
                                                                />
                                                            </FontIconWrap>

                                                            <FontIconWrap className="d-font-icon"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(downloadId) === -1}
                                                                onClick={() => this.props.viewDownloadFile({ ...this.props.masterdata, ...this.props.downloadParam, inputData: { ...row["dataItem"],userinfo: this.props.Login.userInfo }, userinfo: this.props.Login.userInfo, ncontrolCode: downloadId }, row)}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })} data-place="left"
                                                                data-for="tooltip-grid-wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faCloudDownloadAlt} //title={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })}
                                                                 />
                                                            </FontIconWrap>
                                                            {this.props.isreportview ? 
                                                            <FontIconWrap className="d-font-icon"
                                                                //hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(viewreport) === -1}
                                                                onClick={() => this.props.viewReportFile({ ...this.props.masterdata, ...this.props.downloadParam, inputData: { ...row["dataItem"],userinfo: this.props.Login.userInfo }, userinfo: this.props.Login.userInfo, ncontrolCode: downloadId }, row)}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_VIEWREPORT" })} data-place="left"
                                                                data-for="tooltip-grid-wrap"
                                                            >
                                                                
                                                                <FontAwesomeIcon icon={faEye} //title={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })} 
                                                                />
                                                            </FontIconWrap>
                                                            :""}
                                                            {/* <FontAwesomeIcon icon={faTrashAlt}
                                                    title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                    onClick = {() => confirmMessage.confirm(
                                                        "deleteMessage",
                                                        this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                        this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                        () => this.handleClickDelete({ ...this.props.deleteParam, selectedRecord: row["dataItem"], ncontrolCode: deleteId }, row)
                                                    )}
                                                /> */}

                                                            {/* <FontAwesomeIcon icon={faThumbtack}
                                                            title={this.props.intl.formatMessage({ id: "IDS_SETDEFAULT" })}
                                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(defaultId) === -1}
                                                            onClick={() => this.props.defaultRecord({ ...this.props.defaultParam, selectedRecord: row["dataItem"], ncontrolCode: defaultId }, row)} /> */}
                                                            <FontIconWrap className="d-font-icon" data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(approveId) === -1}
                                                                onClick={() => this.props.approveRecord(row, "Approve", approveId)} data-place="left" data-for="tooltip-grid-wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                            </FontIconWrap>
                                                            <FontIconWrap className="d-font-icon" data-tip={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(copyId) === -1}
                                                                onClick={() => this.props.copyRecord(row, "Copy", copyId)} data-place="left" data-for="tooltip-grid-wrap">
                                                                <FontAwesomeIcon icon={faCopy} />
                                                            </FontIconWrap>

                                                            <FontIconWrap className="d-font-icon" data-tip={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(completeId) === -1}
                                                                onClick={() => this.props.completeRecord(row["dataItem"], "Complete", completeId)} data-place="left" data-for="tooltip-grid-wrap">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </FontIconWrap>

                                                            <FontIconWrap className="d-font-icon" data-tip={this.props.intl.formatMessage({ id: "IDS_RESENT" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(resentId) === -1}
                                                                onClick={() => this.props.reSent(row["dataItem"], "Resent", resentId)} 
                                                                data-place="left" data-for="tooltip-grid-wrap">
                                                                <FontAwesomeIcon icon={faRedo} />
                                                            </FontIconWrap>
                                                            

                                                            <Nav.Link data-tip={this.props.intl.formatMessage({ id: "IDS_CANCEL" })} data-place="left" data-for="tooltip-grid-wrap"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(cancelId) === -1} >
                                                                <Image src={reject} alt="filer-icon" width="20" height="20" className="ActionIconColor img-normalize"
                                                                    onClick={() => this.props.cancelRecord(row["dataItem"], "Cancel", cancelId)} data-place="left" />
                                                            </Nav.Link>
                                                            {/* <Button variant="link" title={this.props.intl.formatMessage({ id: "IDS_RECEIVE" })}
                                                    className="mr-2 action-icons-wrap"
                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(receiveGoodsId) === -1}
                                                    onClick={() => this.props.receiveRecord({ ...this.props.receiveParam, selectedRecord: row["dataItem"], ncontrolCode: receiveGoodsId })}>
                                                    <Image src={checkedIcon} alt="filer-icon" width="20" height="20" />
                                                </Button> */}
                                                            {this.props.hasControlWithOutRights &&
                                                                <>
                                                                    {this.props.showeditRecordWORights &&
                                                                        <FontIconWrap className="d-font-icon" data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                            //title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} 
                                                                            data-place="left">
                                                                            <FontAwesomeIcon icon={faPencilAlt}
                                                                                //title={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                                name={"deleteworights"}
                                                                                onClick={() => this.props.editRecordWORights(row["dataItem"])}
                                                                            />
                                                                        </FontIconWrap>
                                                                    }
                                                                    {
                                                                        this.props.showdeleteRecordWORights &&
                                                                        <FontIconWrap className="d-font-icon" data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })} data-for="tooltip-grid-wrap">
                                                                            <FontAwesomeIcon icon={faTrashAlt}
                                                                                //title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                name={"deleteworights"}
                                                                                onClick={() => this.props.deleteRecordWORights(row["dataItem"])}
                                                                            />
                                                                        </FontIconWrap>
                                                                    }

                                                                </>
                                                            }
                                                        </Nav.Link>
                                                    </>

                                                </td>
                                        )}
                                    /> : ""}
                            </Grid>
                        </ExcelExport>
                    </LocalizationProvider >
                    {/* </Tooltip> */}
                    {
                        this.props.isToolBarRequired ?
                            <GridPDFExport
                                ref={(element) => { this._pdfExport = element; }}
                                margin="1cm"
                                // paperSize= "A4"
                                scale={0.75}
                                fileName="Export.pdf"

                            >
                                {<Grid data={process(this.props.data || [], { sort: this.props.dataState.sort, filter: this.props.dataState.filter, group: this.props.dataState.group })} group={this.props.dataState.group} groupable={true}>
                                    {this.props.extractedColumnList.map((item, index) =>
                                        <GridColumn key={index} title={this.props.intl.formatMessage({ id: item.idsName })}
                                            field={item.dataField}
                                            width={item.width}

                                            cell={(row) => (
                                                <td>
                                                    {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                        : row["dataItem"][item.dataField]}
                                                </td>)}
                                        />
                                    )}

                                </Grid>}
                            </GridPDFExport>
                            : ""
                    }
                </AtTableWrap >
            </>
        );
    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }
}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}



export default connect(mapStateToProps, undefined)(injectIntl(DataGrid));