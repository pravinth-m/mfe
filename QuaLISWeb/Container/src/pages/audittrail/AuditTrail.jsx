import React from 'react'
import { connect } from 'react-redux';
import {  injectIntl } from 'react-intl';
import { Row, Col, Button, Card,Nav } from 'react-bootstrap';//Nav, Card, Button
//import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ContentPanel } from '../../components/App.styles.jsx';
import { constructOptionList, getStartOfDay, getEndOfDay, sortData, validateTwoDigitDate, convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript.js';//showEsign, getControlMap,
import {
    callService, crudMaster, validateEsignCredential, updateStore, filterTransactionList,
     filterColumnData, 
    getAuditTrailDetail, getFilterAuditTrailRecords, getFormNameByModule, getExportExcel
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes.js';
import AuditTrailFilter from './AuditTrailFilter.js';
import TransactionListMaster from '../../components/TransactionListMaster.jsx';
import BreadcrumbComponent from '../../components/Breadcrumb.Component.jsx';
import DataGrid from '../../components/data-grid/data-grid.component.jsx';
import SplitterLayout from 'react-splitter-layout';
import { ProductList } from '../product/product.styled.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faSync } from '@fortawesome/free-solid-svg-icons';


class AuditTrail extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        // this.searchAuditRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            group: [{ field: "viewPeriod", dir: "desc"  }] //field: "groupDate" , dir: "desc" 
        };

        const dataStateAll = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5
        };

        this.searchFieldList = ["sauditdate"]

        this.state = {
            masterStatus: "",
            error: "",
            isOpen: false,
            selectedRecord: {},
            //selectedcombo: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,

            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),

            dataResult: [],
            dataState: dataState,
            dataStateAll: dataStateAll,
            qualisModule: [], 
            qualisForms: [],
            users: [],
            userRole: [],
            viewTypeAudit: [],
            wholeQualisForms: [],
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            kendoSkip:0,
            kendoTake:this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            splitChangeWidthPercentage: 30,
        };
        this.searchRef = React.createRef();
        this.searchAuditRef = React.createRef();
  
    }
    dataStateChange = (event) => {
        if (this.state.selectedRecord["nauditactionfiltercode"].value === 1) {
            this.setState({
                dataResult: process(this.props.Login.masterData.AuditDetails|| [], event.dataState),
                dataStateAll: event.dataState,kendoSkip:event.dataState.skip,kendoTake:event.dataState.skip
            });
        }
        else {
            let data=[];
            if( event.dataState.filter === null && event.dataState.sort === null){
            let auditdata=(this.props.Login.masterData.AuditDetails &&
            this.props.Login.masterData.AuditDetails.slice(0,
                event.dataState.take+event.dataState.skip))||[]
              data=process(auditdata || [], event.dataState)
            }else{
                
                data=process(this.props.Login.masterData.AuditDetails || [], event.dataState)
            
            }
            this.setState({
                dataResult: data,
                dataState: event.dataState,
            });
        }
    }

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    pageChange = (event) => {
            this.setState({
                kendoSkip:event.page.skip,
                kendoTake:event.page.take
        })
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


    exportExcelNew = () => {
        let fromDate=  this.props.Login.masterData.FromDate;
        let toDate=  this.props.Login.masterData.ToDate;
 
         let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);  
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
            formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
            usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
            userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
            viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,
            userinfo: this.props.Login.userInfo,
            sauditdate: this.props.Login.masterData.SelectedAuditTrail.saudittraildate,
            nauditformcode: 78,
            ncontrolcode: 78

        }

        let inputParam = { inputData }
        this.props.getExportExcel(inputParam);
        // if(this.props.Login.resultStatus === "Success"){
        //     toast.info("Excel export successfully");
        // }
    }

    render() {

        this.extractedColumnList = [
            { "idsName": "IDS_AUDITDATE", "dataField": "sauditdate", "width": "200px", "componentName": "date" },
            { "idsName": "IDS_AUDITACTION", "dataField": "sauditaction", "width": "200px" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "350px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
            { "idsName": "IDS_ACTIONTYPE", "dataField": "sactiontype", "width": "200px" },
            { "idsName": "IDS_MODULENAME", "dataField": "smodulename", "width": "200px" },
            { "idsName": "IDS_FORMNAME", "dataField": "sformname", "width": "200px" },
            { "idsName": "IDS_ESIGNCOMMENTS", "dataField": "sreason", "width": "200px" },


        ]

        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate);
        }

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, 
            this.props.Login.masterData.ToDate,
            this.props.Login.userInfo); 

        let auditParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            // fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
            // toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
            // moduleCode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
            // formCode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
            // userCode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
            // userRole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
            // viewTypeCode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0

            skip:this.state.skip,
            take:this.state.take,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            moduleCode: this.props.Login.masterData.breadCrumbModule ? this.props.Login.masterData.breadCrumbModule.value : 0,
            formCode: this.props.Login.masterData.breadCrumbForm ? this.props.Login.masterData.breadCrumbForm.value : 0,
            userCode: this.props.Login.masterData.breadCrumbUser ? this.props.Login.masterData.breadCrumbUser.value : 0,
            userRole: this.props.Login.masterData.breadCrumbRole ? this.props.Login.masterData.breadCrumbRole.value : 0,
            viewTypeCode: this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.value :
                this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode : 0
            //viewTypeCode :this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode:0
        }
        
        this.filterParam = {
            inputListName: "AuditTrail", selectedObject: "SelectedAuditTrail", primaryKeyField: "saudittraildate",
            fetchUrl: "audittrail/getAuditTrailDetail", masterData: this.props.Login.masterData,
           
            fecthInputObject: {
                // fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
                // toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
                // modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
                // formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
                // usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
                // userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
                // viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,

                userinfo: this.props.Login.userInfo,
                fromDate: obj.fromDate, 
                toDate: obj.toDate,
                modulecode: this.props.Login.masterData.breadCrumbModule ? this.props.Login.masterData.breadCrumbModule.value : 0,
                formcode: this.props.Login.masterData.breadCrumbForm ? this.props.Login.masterData.breadCrumbForm.value : 0,
                usercode: this.props.Login.masterData.breadCrumbUser ? this.props.Login.masterData.breadCrumbUser.value : 0,
                userrole: this.props.Login.masterData.breadCrumbRole ? this.props.Login.masterData.breadCrumbRole.value : 0,
                viewtypecode: this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.value :
                    this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode : 0

            },
            filteredListName: "searchedAudit",
            clearFilter: "no",
            updatedListname: "SelectedAuditTrail",
            searchRef: this.searchAuditRef,
            searchFieldList: this.searchFieldList,
            unchangeList: ["QualisModule", "QualisForms", "Users", "UserRole", "ViewTypeAudit"],
            changeList: ["AuditDetails"]

        };

        this.breadCrumbData = this.breadcrumbList();



        // this.state.selectedRecord && this.state.selectedRecord["nmodulecode"] &&
        // {
        //     "label": "IDS_MODULENAME",
        //     "value": this.state.selectedRecord["nmodulecode"].label 
        // }
        // this.state.selectedRecord["nformcode"] &&
        //  {
        //     "label": "IDS_FORMNAME",
        //     "value": this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].label : ""
        // }, 
        // this.state.selectedRecord["nusercode"] &&
        // {
        //     "label": "IDS_USERNAME",
        //     "value": this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].label : ""
        // }, 
        // this.state.selectedRecord["nuserrolecode"] &&
        // {
        //     "label": "IDS_USERROLE",
        //     "value": this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].label : ""

        // }
        // ]

        // let auditInputData = {
        //     fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
        //     toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
        //     modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
        //     formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
        //     usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
        //     userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
        //     viewtypecode: this.state.selectedcombo["nauditactionfiltercode"] ? this.state.selectedcombo["nauditactionfiltercode"].value : 0,
        //     userinfo: this.props.Login.userInfo
        // }

        this.postParamList = [
            {
                filteredListName: "searchedAudit",
                clearFilter: "no",
                searchRef: this.searchRef,
                primaryKeyField: "saudittraildate",
                fetchUrl: "audittrail/getFilterAuditTrailRecords",
                fecthInputObject: this.filterParam,
                //childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }],
                selectedObject: "SelectedAuditTrail",
                inputListName: "AuditTrail",
                updatedListname: "SelectedAuditTrail",
                unchangeList: ["QualisModule", "QualisForms", "Users", "UserRole", "ViewTypeAudit"]
            }];
            return (
            <>
                <div className="mtop-fixed-breadcrumb client-listing-wrap">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters>
                        {/* //ref={(parentHeight) => { this.parentHeight = parentHeight }} */}
                        <Col md={12} className="parent-port-height sticky_head_parent" >
                            <SplitterLayout borderColor="#999" 
                            primaryIndex={1}
                            percentage={true}
                             secondaryInitialSize={this.state.splitChangeWidthPercentage}
                             onSecondaryPaneSizeChange={this.paneSizeChange}
                             primaryMinSize={40}
                             secondaryMinSize={20}
                             >
                                {/* <Col md={3}> */}
                                <TransactionListMaster
                                 splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                    //paneHeight={this.state.parentHeight}
                                    // masterList={this.props.Login.masterData.searchedAudit || 
                                    //     this.props.Login.masterData.AuditTrail ? sortData(this.props.Login.masterData.AuditTrail,'descending','saudittraildate') : []}
                                   // masterList={this.props.Login.masterData.searchedAudit ? this.props.Login.masterData.searchedAudit :
                                     //   this.props.Login.masterData.AuditTrail ? sortData(this.props.Login.masterData.AuditTrail, 'descending', 'saudittraildate') : []}
                                    
                                     masterList={this.props.Login.masterData.searchedAudit ||
                                        (this.props.Login.masterData.AuditTrail||[])}
                                    selectedMaster={[this.props.Login.masterData.SelectedAuditTrail]}
                                    primaryKeyField="saudittraildate"
                                    getMasterDetail={this.props.getAuditTrailDetail}
                                    inputParam={auditParam}
                                    //additionalParam={['napprovalversioncode']}
                                    mainField="sauditdate"
                                    selectedListName="SelectedAuditTrail"
                                    filterColumnData={this.props.filterTransactionList}
                                    searchListName="searchedAudit"
                                    searchRef={this.searchRef}
                                    filterParam={this.filterParam}
                                    objectName="auditrail"
                                    listName="IDS_AUDITTRAIL"
                                    showFilter={this.props.Login.showFilter}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.onFilterSubmit}
                                    // needAccordianFilter={true}
                                    handlePageChange={this.handlePageChange}
                                    skip={this.state.skip}
                                    take={this.state.take}
                                    needFilter={true}
                                    needAccordianFilter={false}
                                    filterComponent={[
                                        {
                                            "IDS_AUDITTRAIL":
                                                <AuditTrailFilter
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    filterModuleName={this.state.qualisModule}
                                                    filterFormName={this.state.qualisForms}
                                                    filterViewType={this.state.viewTypeAudit}
                                                    filterUsers={this.state.users}
                                                    filterUserRole={this.state.userRole}
                                                    handleDateChange={this.handleDateChange}
                                                    fromDate={fromDate}
                                                    toDate={toDate}
                                                    userInfo={this.props.Login.userInfo}
                                                    onComboChange={this.onComboChange}
                                                />
                                        }
                                    ]}
                                    // accordianfilterComponent={[
                                    //     {
                                    //         "IDS_AUDITTRAIL":
                                    //             <ViewTypeFilter
                                    //                 selectedRecord={this.state.selectedcombo || {}}
                                    //                 filterViewType={this.state.viewTypeAudit}
                                    //                 userInfo={this.props.Login.userInfo}
                                    //                 onComboChange={this.onComboChange}
                                    //             />
                                    //     }
                                    // ]}
                                    commonActions={
                                        <ProductList className="d-flex product-category float-right">
                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                            <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                onClick={() => this.onReload()}
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }} />
                                            </Button>
                                            {/* </Tooltip> */}
                                        </ProductList>
                                    }
                                />
                                {/* <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400} customClassName="fixed_list_height"> */}
                                {/* <Col md={9}> */}
                                <PerfectScrollbar>
                                <div ref={this.myRef}>
                                    {this.props.Login.masterData.SelectedAuditTrail && this.props.Login.masterData.SelectedAuditTrail !== undefined ?
                                        <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Header className="padding-class">
                                                    <Card.Title className="product-title-main">{this.props.Login.masterData.SelectedAuditTrail.sauditdate}
                                                            <div className="d-flex product-category" style={{ float: "right",marginRight:"1rem" }}>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                // hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOADEXCEL" })}
                                                                //data-for="tooltip_list_wrap"
                                                                onClick={this.exportExcelNew}>
                                                                <FontAwesomeIcon icon={faFileExcel} />
                                                            </Nav.Link>
                                                            </div>
                                                    </Card.Title>
                                            </Card.Header>
                                            
                                            <Card.Body className='form-static-wrap padding-class'>
                                                <DataGrid
                                                    // gridWidth={"57.5rem"}
                                                    gridHeight={this.state.gridHeight + 'px'}
                                                    pageable={true}
                                                    pageSizes={this.props.Login.settings && this.props.Login.settings[17].split(",").map(setting => parseInt(setting))}
                                                    scrollable={"scrollable"}
                                                    primaryKeyField="nauditcode"
                                                    data={this.props.Login.masterData.AuditDetails||[]}
                                                    dataResult={this.state.dataResult}
                                                    total={this.props.Login.masterData.AuditDetails&&this.props.Login.masterData.AuditDetails.length||0}
                                                //  dataResult={process(this.props.Login.masterData.AuditDetails || [],
                                                    //  this.state.selectedRecord["nauditactionfiltercode"]
                                                    //     && this.state.selectedRecord["nauditactionfiltercode"].value === 1
                                                        //   ? this.state.dataStateAll : this.state.dataState)}
                                                    dataState={this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll
                                                        : this.state.dataState}
                                                    dataStateChange={this.dataStateChange}
                                                    extractedColumnList={this.extractedColumnList || []}
                                                    controlMap={this.state.controlMap}
                                                    methodUrl="AuditTrail"
                                                    groupable={this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? true : false : false}
                                                    isActionRequired={false}
                                                    isToolBarRequired={false}
                                                    isAddRequired={false}
                                                    isRefreshRequired={false}
                                                    isDownloadPDFRequired={false}
                                                    isDownloadExcelRequired={false}
                                                    isExportExcelRequired={false}
                                                    // isIdsField="yes"
                                                    exportExcelNew={this.exportExcelNew}
                                                    onExpandChange={this.expandChange}
                                                    expandField="expanded"
                                                    hideDetailBand={true}
                                                /> 
                                            </Card.Body>
                                        </Card>
                                    </ContentPanel>
                                            
                                   :""
                                    }
                                     </div>
                                </PerfectScrollbar>
                            </SplitterLayout>
                            {/* </SplitterLayout> */}
                        </Col>
                    </Row>
                </div>
            </>
        );

    }
    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.setState({
            dataResult: process(this.props.Login.masterData.AuditDetails || [], this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll :
                this.state.dataState),
            dataState: this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll
                : this.state.dataState,
        });
    };
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        //setTimeout(() => { this._scrollBarRef.updateScroll() })
    };


    onReload = () => {

        // let dFromDate = this.props.Login.masterData.breadCrumbFrom ? (this.props.Login.masterData.breadCrumbFrom) : this.props.Login.masterData.FromDate;
        // let dToDate = this.props.Login.masterData.breadCrumbTo ? (this.props.Login.masterData.breadCrumbTo) : this.props.Login.masterData.ToDate;
        //var dTempFromDate = this.state.selectedRecord["fromdate"] ? this.state.selectedRecord["fromdate"] : this.props.Login.masterData.FromDate;
        //let dTempToDate = this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"] : this.props.Login.masterData.ToDate;
        //let temp = dFromDate.indexOf('-');
        // let fromMonth = (dTempFromDate.getMonth()+1);
        // let toMonth = (dTempToDate.getMonth()+1);
        // let fromMonth = String(new Date(dFromDate).getMonth() + 1)
        // let toMonth = String(new Date(dToDate).getMonth() + 1)
        // let fromYear = dFromDate.substring(0, 4);
        // let toYear = dToDate.substring(0, 4);
        // let ntempviewtypecode = 0;
        let breadCrumbFrom = this.props.Login.masterData.FromDate ? this.props.Login.masterData.FromDate : this.props.Login.masterData.breadCrumbFrom;
        let breadCrumbTo = this.props.Login.masterData.ToDate ? this.props.Login.masterData.ToDate : this.props.Login.masterData.breadCrumbTo;
        let breadCrumbModule = this.props.Login.masterData.breadCrumbModule
        let breadCrumbForm = this.props.Login.masterData.breadCrumbForm
        let breadCrumbUser = this.props.Login.masterData.breadCrumbUser
        let breadCrumbRole = this.props.Login.masterData.breadCrumbRole
        let breadCrumbViewType = this.props.Login.masterData.breadCrumbViewType
            ? this.props.Login.masterData.breadCrumbViewType : this.props.Login.ViewType;

            let fromDate=  this.props.Login.masterData.FromDate;
            let toDate=  this.props.Login.masterData.ToDate;
     
             let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);  
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            modulecode: breadCrumbModule ? breadCrumbModule.value : 0,
            formcode: breadCrumbForm ? breadCrumbForm.value : 0,
            usercode: breadCrumbUser ? breadCrumbUser.value : 0,
            userrole: breadCrumbRole ? breadCrumbRole.value : 0,
            viewtypecode: breadCrumbViewType ? breadCrumbViewType.value
                : this.props.Login.masterData.ViewType.nauditactionfiltercode,

            // viewtypecode : this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode :0,
            // viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,
            userinfo: this.props.Login.userInfo,
            postParamList: this.filterParam,
        }

        let masterData = {
            ...this.props.Login.masterData, breadCrumbFrom, breadCrumbTo, breadCrumbModule,
            breadCrumbForm, breadCrumbUser, breadCrumbRole,
            //breadCrumbViewType : breadCrumbViewType ? breadCrumbViewType :
            // this.props.Login.masterData.ViewType
            breadCrumbViewType: breadCrumbViewType ? breadCrumbViewType
                : {
                    label: this.props.Login.masterData.ViewType.sauditactionfiltername,
                    value: this.props.Login.masterData.ViewType.nauditactionfiltercode,
                    item: this.props.Login.masterData.ViewType
                }
        }


        let inputParam = { masterData, inputData, searchRef: this.searchRef, detailSkip: this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll.skip : this.state.dataState.skip }
        this.props.getFilterAuditTrailRecords(inputParam)
    }

    onFilterSubmit = () => {

        let breadCrumbFrom = this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.FromDate);
        let breadCrumbTo = this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate);
        let breadCrumbModule = this.state.selectedRecord['nmodulecode']
        let breadCrumbForm = this.state.selectedRecord['nformcode']
        let breadCrumbUser = this.state.selectedRecord['nusercode']
        let breadCrumbRole = this.state.selectedRecord['nuserrolecode']
        let breadCrumbViewType = this.state.selectedRecord['nauditactionfiltercode']

        let masterData = {
            ...this.props.Login.masterData, breadCrumbFrom, breadCrumbTo, breadCrumbModule, breadCrumbForm, breadCrumbUser, breadCrumbRole, breadCrumbViewType
        }
       let fromDate= this.state.selectedRecord["fromdate"] ?this.state.selectedRecord["fromdate"]: this.props.Login.masterData.FromDate;
       let toDate= this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"]: this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);  
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
            formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
            usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
            userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
            //viewtypecode: ntempviewtypecode,//this.state.selectedcombo["nviewtypecode"] ? this.state.selectedcombo["nviewtypecode"].value:0,
            viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : -1,
            userinfo: this.props.Login.userInfo,
            postParamList: this.filterParam,
        }

        let inputParam = {
            masterData, inputData, searchRef: this.searchRef,
            detailSkip: this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll.skip : this.state.dataState.skip
        }
        this.props.getFilterAuditTrailRecords(inputParam)
    }

    onComboChange = (comboData, fieldName, caseNo) => {
        if (comboData != null) {
            if (fieldName === "nmodulecode" || fieldName === "nformcode"
                || fieldName === "nusercode" || fieldName === "nuserrolecode" || fieldName === "nauditactionfiltercode") {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[fieldName] = comboData;
                // let qualisForms = this.state.qualisForms;
                let qualisForms = this.state.wholeQualisForms;
                if (fieldName === "nmodulecode") {

                    selectedRecord["nformcode"] = "";
                    qualisForms = qualisForms.filter(form => form.item.nmodulecode === comboData.value);

                } else if (selectedRecord.nmodulecode && selectedRecord.nmodulecode.value) {

                    qualisForms = qualisForms.filter(form => form.item.nmodulecode === selectedRecord.nmodulecode.value);

                }
                this.setState({ selectedRecord, qualisForms });
            }



            /*if (fieldName === "nauditactionfiltercode") {
 
                this.searchRef.current.value = "";
 
                const selectedcombo = this.state.selectedcombo || {};
                selectedcombo[fieldName] = comboData;
                const dataStateAll = {
                    skip: 0,
                    take: 100
                };
 
                this.setState({ selectedcombo, dataStateAll });
 
                let masterData = {
                    ...this.props.Login.masterData, searchedAudit: undefined
                }
                let inputData = {
                    fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
                    toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
                    modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
                    formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
                    usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
                    userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
                    viewtypecode: this.state.selectedcombo["nauditactionfiltercode"] ? this.state.selectedcombo["nauditactionfiltercode"].value : 0,
                    userinfo: this.props.Login.userInfo,
                    postParamList: this.filterParam,
                }
 
                let inputParam = { masterData, inputData }
                this.props.getFilterAuditTrailRecords(inputParam)
            }*/

        }
        else {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            if (fieldName === 'nmodulecode') {
                selectedRecord["nformcode"] = "";
                const qualisForms = this.state.wholeQualisForms;
                this.setState({ selectedRecord, qualisForms });
            }
            else
                this.setState({ selectedRecord });
        }

    }

    handleDateChange = (dateName, dateValue) => {
        let selectedRecord = this.state.selectedRecord;
        selectedRecord[dateName] = dateValue;


        //this.setState({selectedRecord});

        let viewTypeAuditList = this.state.viewTypeAudit;

        let dFromDate = this.state.selectedRecord["fromdate"] ? rearrangeDateFormat(this.props.Login.userInfo,this.state.selectedRecord["fromdate"]) : rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.FromDate);
        let dToDate = this.state.selectedRecord["todate"] ? rearrangeDateFormat(this.props.Login.userInfo,this.state.selectedRecord["todate"]) : rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate);
        // let ntempviewtypecode = 0;
        let fromMonth = String(dFromDate.getMonth() + 1)
        let toMonth = String(dToDate.getMonth() + 1)
        let fromYear = String(dFromDate.getFullYear()) ;
        let toYear = String(dToDate.getFullYear()) ;

        if (fromYear !== toYear) {

            selectedRecord["nauditactionfiltercode"] =
                viewTypeAuditList.length > 0 ? {
                    "value": viewTypeAuditList[2].item.nauditactionfiltercode,
                    "label": viewTypeAuditList[2].item.sauditactionfiltername
                } : this.state.selectedRecord["nauditactionfiltercode"]

            // ntempviewtypecode = viewTypeAuditList[2].item.nauditactionfiltercode;
        }
        else if (fromMonth !== toMonth) {
            selectedRecord["nauditactionfiltercode"] = viewTypeAuditList.length > 0 ? {
                "value": viewTypeAuditList[1].item.nauditactionfiltercode,
                "label": viewTypeAuditList[1].item.sauditactionfiltername
            } : this.state.selectedRecord["nauditactionfiltercode"]


            // ntempviewtypecode = viewTypeAuditList[1].item.nauditactionfiltercode;
        }
        else {
            selectedRecord["nauditactionfiltercode"] = viewTypeAuditList.length > 0 ? {
                "value": viewTypeAuditList[0].item.nauditactionfiltercode,
                "label": viewTypeAuditList[0].item.sauditactionfiltername
            } : this.state.selectedRecord["nauditactionfiltercode"]

            // ntempviewtypecode = viewTypeAuditList[0].item.nauditactionfiltercode;
        }

        this.setState({ selectedRecord });
    }


    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    breadcrumbList = () => {
        let breadCrumbArray = [];
 // let fromDate = this.props.Login.masterData.breadCrumbFrom ? this.props.Login.masterData.breadCrumbFrom : this.props.Login.masterData.FromDate;
    //    let toDate = this.props.Login.masterData.breadCrumbTo ? this.props.Login.masterData.breadCrumbTo : this.props.Login.masterData.ToDate;
       
     let fromDate = this.props.Login.masterData.FromDate ? this.props.Login.masterData.FromDate : this.props.Login.masterData.breadCrumbFrom;
     let toDate = this.props.Login.masterData.ToDate ? this.props.Login.masterData.ToDate : this.props.Login.masterData.breadCrumbTo;
      
    let obj = convertDateValuetoString(fromDate, 
            toDate,
            this.props.Login.userInfo);   
        breadCrumbArray.push({
            "label": "IDS_FROM",
            "value": obj.breadCrumbFrom
        }, {
            "label": "IDS_TO",
            "value": obj.breadCrumbto
        });
        this.props.Login.masterData.breadCrumbModule &&
            breadCrumbArray.push(
                {
                    "label": "IDS_MODULENAME",
                    "value": this.props.Login.masterData.breadCrumbModule.label
                });
        this.props.Login.masterData.breadCrumbForm &&
            breadCrumbArray.push(
                {
                    "label": "IDS_FORMNAME",
                    "value": this.props.Login.masterData.breadCrumbForm.label
                });
        this.props.Login.masterData.breadCrumbUser &&
            breadCrumbArray.push(
                {
                    "label": "IDS_USERNAME",
                    "value": this.props.Login.masterData.breadCrumbUser.label
                });
        this.props.Login.masterData.breadCrumbRole &&
            breadCrumbArray.push(
                {
                    "label": "IDS_USERROLE",
                    "value": this.props.Login.masterData.breadCrumbRole.label
                });

        breadCrumbArray.push(
            {
                "label": "IDS_VIEWPERIOD",
                "value": this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.label :
                    this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.sauditactionfiltername : ""
            });


        // this.state.selectedRecord["nformcode"] &&
        //  {
        //     "label": "IDS_FORMNAME",
        //     "value": this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].label : ""
        // },
        // this.state.selectedRecord["nusercode"] &&
        // {
        //     "label": "IDS_USERNAME",
        //     "value": this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].label : ""
        // },
        // this.state.selectedRecord["nuserrolecode"] &&
        // {
        //     "label": "IDS_USERROLE",
        //     "value": this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].label : ""

        // }
        return breadCrumbArray;
    };

    // covertDatetoString(startDateValue, endDateValue) {
    //     const startDate = new Date(startDateValue);
    //     const endDate = new Date(endDateValue);

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate()));
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
    //     const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
    //     const fromDate = fromDateOnly + "T00:00:00";
    //     const toDate = toDateOnly + "T23:59:59";


    //     return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    // }

   

    componentDidUpdate(previousProps) {
        
        let updateState = false;
        let { selectedRecord, qualisModule, qualisForms, wholeQualisForms, users, userRole,
            viewTypeAudit, dataStateAll, dataState, dataResult,skip,take } = this.state
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        if (this.props.Login.masterData.QualisModule !== previousProps.Login.masterData.QualisModule
            || this.props.Login.masterData.QualisForms !== previousProps.Login.masterData.QualisForms
            || this.props.Login.masterData.Users !== previousProps.Login.masterData.Users
            || this.props.Login.masterData.UserRole !== previousProps.Login.masterData.UserRole
        ) {
            updateState = true;
            const qualisModuleMap = constructOptionList(this.props.Login.masterData.QualisModule || [], "nmodulecode",
                "smodulename", "nsorter", "ascending", false);
            //const allQualisModuleList = qualisModule.get("OptionList");
            const qualisModuleList = qualisModuleMap.get("OptionList");

            const qualisFormsMap = constructOptionList(this.props.Login.masterData.QualisForms || [], "nformcode",
                "sformname", "nsorter", "ascending", false);
            // const allQualisFormsList = qualisForms.get("OptionList");
            let qualisFormsList = []
            if (selectedRecord && selectedRecord.nmodulecode && selectedRecord.nmodulecode.value) {
                qualisFormsList = qualisFormsMap.get("OptionList").filter(form => form.item.nmodulecode === selectedRecord.nmodulecode.value);
            } else {
                qualisFormsList = qualisFormsMap.get("OptionList");
            }

            const usersMap = constructOptionList(this.props.Login.masterData.Users || [], "nusercode",
                "susername", undefined, undefined, undefined);
            //const allUsersList = users.get("OptionList");
            const usersList = usersMap.get("OptionList");

            const userRoleMap = constructOptionList(this.props.Login.masterData.UserRole || [], "nuserrolecode",
                "suserrolename", undefined, undefined, undefined);
            //const allUserRoleList = userRole.get("OptionList");
            const userRoleList = userRoleMap.get("OptionList");

            const viewTypeAuditMap = constructOptionList(this.props.Login.masterData.ViewTypeAudit || [], "nauditactionfiltercode",
                "sauditactionfiltername", "nsorter", "ascending", false);
            const viewTypeAuditList = viewTypeAuditMap.get("OptionList");


            qualisModule = qualisModuleList
            qualisForms = qualisFormsList
            wholeQualisForms = qualisFormsList
            users = usersList
            userRole = userRoleList
            viewTypeAudit = viewTypeAuditList
            selectedRecord = {
                nauditactionfiltercode: viewTypeAuditList.length > 0 ? {
                    "value": viewTypeAuditList[0].item.nauditactionfiltercode,
                    "label": viewTypeAuditList[0].item.sauditactionfiltername
                } : this.state.selectedRecord["nauditactionfiltercode"]
            }

        }

        if (this.props.Login.resetDataGridPage && this.props.Login.resetDataGridPage !== previousProps.Login.resetDataGridPage) {
            if (this.state.selectedRecord["nauditactionfiltercode"].value === 1) {

                dataStateAll.skip =  0
                updateState = true;
            }
            else {

                dataState.skip = 0
                updateState = true;
            }
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            updateState = true;
            if (selectedRecord && selectedRecord.nmodulecode && selectedRecord.nmodulecode.value) {
                qualisForms = qualisForms.filter(form => form.item.nmodulecode === selectedRecord.nmodulecode.value);
            } else {
                qualisForms = wholeQualisForms;
            }
            if (this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1) {

                dataStateAll = {skip:0, take:dataStateAll.take, group:dataStateAll.group}
                updateState = true;
            }
            else {

                dataState = {skip:0, take:dataState.take, group:dataState.group}
                updateState = true;
            }
            const auditdate=(this.props.Login.masterData.AuditDetails&&this.props.Login.masterData.AuditDetails.slice(dataState.skip,dataState.take+dataState.skip))||[]
            dataResult = process(auditdate|| [],  dataState)

                skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
                take = this.props.Login.take || take

        }
        if (updateState) {
            this.setState({
                selectedRecord, qualisModule, qualisForms, wholeQualisForms, users, userRole,
                viewTypeAudit, dataStateAll, dataState, dataResult,skip,take
            })
        }

    }

    componentDidMount() {
        if (this.myRef.current.offsetParent.clientHeight !== this.state.gridHeight) {
            this.setState({
                gridHeight: this.myRef.current.offsetParent.clientHeight
            })
    
        }
    }
    

}


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, filterTransactionList,
    updateStore, filterColumnData, getAuditTrailDetail, getFilterAuditTrailRecords, getFormNameByModule, getExportExcel
})(injectIntl(AuditTrail));