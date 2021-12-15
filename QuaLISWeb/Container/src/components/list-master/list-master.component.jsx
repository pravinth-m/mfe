import React from 'react';
import { injectIntl } from 'react-intl';
import { Button, InputGroup, FormControl, Media, ListGroup, Form } from 'react-bootstrap';
import { ClientList, SearchAdd, MediaHeader, MediaSubHeader, MediaLabel, SearchIcon } from '../App.styles';
import { ListMasterWrapper } from '../list-master/list-master.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPlus, faSearch, faSitemap, faSync } from '@fortawesome/free-solid-svg-icons';
// import FilterWithAccordian from './FilterWithAccordian';
import FilterAccordion from '../custom-accordion/filter-accordion.component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Affix } from 'rsuite';
import AdvFilter from '../AdvFilter';
import CustomPager from '../CustomPager';
import { ListView } from '@progress/kendo-react-listview';
import { connect } from 'react-redux';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import { ListWrapper } from '../client-group.styles';
import ReactTooltip from 'react-tooltip';
class ListMaster extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonCount: 4,
            info: true,
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[3]) : 5,
            testskip: 0,
            testtake: this.props.Login.settings ? parseInt(this.props.Login.settings[12]) : 5
        }
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    filterColumn = (event) => {
        let filterValue = event.target.value;
        if (event.keyCode === 13) {
            this.props.filterColumnData(filterValue, this.props.filterParam);
        }

        // clearInterval(this.interval);

        // if (filterValue === "") {
        //     this.props.filterColumnData(filterValue, this.props.filterParam);

        // } else {
        //     // (filterValue.length > 2) {
        //     this.interval = setInterval(() => {
        //         this.props.filterColumnData(filterValue, this.props.filterParam);
        //         clearInterval(this.interval);
        //     }, 3000);
        //     // }
        // }
    }

    getSelectedDetail = (master) => {
        if (this.props.allowDuplicateHits
            || this.props.selectedMaster[this.props.primaryKeyField] !== master[this.props.primaryKeyField])
            this.props.getMasterDetail(master);
    }
    ListDesign = props => {
        let item = props.dataItem;
        const labelColor = ['label-orange', 'label-green', 'label-yellow', 'label-purple'];
        return (
            // <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
            <ListGroup.Item key={`listKey_${props.index}`} as="li" onClick={() => this.getSelectedDetail(item)}
                className={`list-bgcolor ${this.props.selectedMaster ? this.props.selectedMaster[this.props.primaryKeyField] === item[this.props.primaryKeyField] ? "active" : "" : ""}`}>
                {/* <ReactTooltip place="bottom" id="tooltip_list_wrap" /> */}
                <Media>
                    {this.props.isMultiSelecct ?
                        <Form.Check custom type="checkbox" id="customControl"  >
                            <Form.Check.Input type="checkbox" id={`tm_customCheck_${props.index}`}
                                checked={this.props.selectedMaster ? this.props.selectedMaster[this.props.primaryKeyField] === item[this.props.primaryKeyField] ? true : false : false}
                                readOnly
                            />

                            <Form.Check.Label className={`mr-3 label-circle ${labelColor[props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{item[this.props.mainField] && item[this.props.mainField].substring(0, 1).toUpperCase()}</Form.Check.Label>
                        </Form.Check> :
                        this.props.hideCheckLabel ? "" :
                            <Form.Check.Label className={`mr-3 label-circle ${labelColor[props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{item[this.props.mainField] && item[this.props.mainField].substring(0, 1).toUpperCase()}</Form.Check.Label>
                    }
                    <Media.Body>
                        {/* <ReactTooltip place="bottom" id="tooltip_list_wrap" /> */}
                        <MediaHeader data-tip={item[this.props.mainField]} data-for="tooltip_list_wrap">{item[this.props.mainField]}</MediaHeader>
                        <MediaSubHeader className="title-grid-width-sm">
                            <MediaLabel>{item[this.props.firstField]}</MediaLabel>
                            {this.props.secondField ? <>
                                <MediaLabel className="text_seperator">
                                    {item[this.props.secondField]}
                                </MediaLabel>
                            </> : ""}
                        </MediaSubHeader>
                    </Media.Body>
                </Media>
            </ListGroup.Item>
        )
    }
    render() {
        let headerClass = this.props.hideSearch ? "justify-content-end" : "justify-content-between";
        return (
            <>
                <Affix top={this.props.showFilterIcon ? 91 : 53}>
                    {/* ${this.props.needAccordianFilter ? 'hight-md' : 'height-normal'} */}
                    <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" />
                    <ListMasterWrapper className={`${this.state.showModalBg ? 'show_modal_bg' : ''} `}>
                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                        <SearchAdd className={`bg-white d-flex ${headerClass}  pad-15 ${this.props.titleClasses ? this.props.titleClasses : ''}`} >
                            {this.props.hideSearch ? "" :
                                <InputGroup className="list-group-search">
                                    <SearchIcon className="search-icon">
                                        <FontAwesomeIcon icon={faSearch} style={{ color: "#c1c7d0" }} />
                                    </SearchIcon>

                                    <FormControl
                                        ref={this.props.searchRef}// onEnterKeyPress={this.filterColumn}
                                        autoComplete="off"
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SEARCH" })} //.concat(this.props.screenName)
                                        name={"search".concat(this.props.screenName.toLowerCase())}
                                        onKeyUp={(e) => this.filterColumn(e)}
                                    />

                                    {this.props.showFilterIcon ?
                                        <InputGroup.Append>
                                            <AdvFilter
                                                filterComponent={this.props.filterComponent}
                                                dataFor="tooltip_list_wrap"
                                                onFilterSubmit={this.props.onFilterSubmit}
                                                showFilter={this.props.showFilter}
                                                openFilter={this.props.openFilter}
                                                closeFilter={this.props.closeFilter}
                                                showModalBg={(e) => this.setState({ showModalBg: e })}

                                            />
                                        </InputGroup.Append>

                                        : ""
                                    }
                                </InputGroup>


                            }


                            <ListWrapper className="d-flex ml-2">
                                {this.props.titleHead ? <h4>{this.props.titleHead}</h4> : ''}
                                {this.props.hideAddButton ? "" :
                                    <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                        hidden={this.props.userRoleControlRights.indexOf(this.props.addId) === -1}
                                        //title={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                        data-for="tooltip_list_wrap"
                                        onClick={() => this.props.openModal()}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                }
                                {this.props.hideReload ? "" :
                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                        onClick={() => this.props.reloadData()}
                                        // {/* title={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}  */}
                                        data-for="tooltip_list_wrap"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                        <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }} />
                                    </Button>
                                }
                                {this.props.showGraphView ?
                                    <Button
                                        className="btn btn-circle outline-grey ml-2 fa-rotate-270" variant="link"
                                        onClick={() => this.props.getGraphView()}
                                        data-for="tooltip_list_wrap"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}>
                                        {/* title={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}> */}
                                        <FontAwesomeIcon icon={faSitemap} style={{ "width": "0.6!important" }} />
                                    </Button>
                                    // <Nav.Link className="btn btn-circle outline-grey ml-2 action-icons-wrap" onClick={() => this.props.getGraphView()} title={this.props.intl.formatMessage({ id: "IDS_GRAPH" })} >
                                    //     <Image src={Graph} alt="filer-icon" width="20" height="20" className="ActionIconColor img-normalize"/>
                                    // </Nav.Link>
                                    : ""
                                }
                                {this.props.showCopy ?
                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                        hidden={this.props.userRoleControlRights.indexOf(this.props.copyId) === -1}
                                        // title={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                        data-for="tooltip_list_wrap"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                        onClick={() => this.props.copyData()}>
                                        <FontAwesomeIcon icon={faCopy} />
                                    </Button>
                                    : ""
                                }
                            </ListWrapper>
                        </SearchAdd>
                        {/* </Tooltip> */}

                        {this.props.needAccordianFilter ?
                            <FilterAccordion
                                key="filter"
                                filterComponent={this.props.filterComponent}
                                className={this.props.accordianClassName}
                            />
                            : ""}

                        <ClientList className="product-list list_rightborder">
                            <PerfectScrollbar>
                                {/* style={{ height: this.props.paneHeight ? this.props.paneHeight : this.props.needAccordianFilter ? 'calc(100vh - 220px)' : 'calc(100vh - 180px)' }} */}
                                {/* className="inner-hg-pane" */}
                                <div className={`${this.props.needAccordianFilter ? 'height-md' : 'height-normal'} ${this.props.showFilterIcon ? 'height-xd' : 'height-xl'} ${this.props.hidePaging ? '' : 'height-xxd'}`}>
                                    <ListGroup as="ul">
                                        {this.props.masterList ?
                                            <ListView
                                                data={this.props.hidePaging ? this.props.masterList : this.props.masterList.slice(this.props.skip ? this.props.skip : this.state.skip, ((this.props.skip ? this.props.skip : this.state.skip) + (this.props.take ? this.props.take : this.state.take)))}
                                                item={(props) => this.ListDesign(props)}
                                            /> : ""}

                                        {/* {this.props.masterList ?

                                    this.props.masterList.map((master, index) =>
                                      
                                    )
                                    : ""} */}
                                    </ListGroup>
                                </div>
                            </PerfectScrollbar>

                        </ClientList>
                        {this.props.hidePaging ? "" :
                            <CustomPager
                                skip={this.props.skip ? this.props.skip : this.state.skip}
                                take={this.props.take ? this.props.take : this.state.take}
                                width={20}
                                pagershowwidth={18}
                                handlePageChange={this.handlePageChange}
                                total={this.props.masterList ? this.props.masterList.length : 0}
                                buttonCount={this.state.buttonCount}
                                info={this.state.info}
                                userInfo={this.props.Login.userInfo}
                                pageSize={this.props.pageSize? this.props.pageSize :this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))}
                            >
                            </CustomPager>
                        }
                    </ListMasterWrapper>
                </Affix>
            </>
        )
    }

    componentDidUpdate(previousProps) {
        ReactTooltip.rebuild();
        if(this.props.masterList !== previousProps.masterList){
            if(this.props.skip === undefined && this.props.masterList && this.props.masterList.length <= this.state.skip){
                this.setState({skip:0});
            }
        }
    }
}

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

export default connect(mapStateToProps, undefined)(injectIntl(ListMaster));