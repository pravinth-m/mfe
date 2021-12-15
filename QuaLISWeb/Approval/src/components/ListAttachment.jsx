import React, { Component } from 'react';
import { ListGroup, Media, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt, faTrashAlt, faPencilAlt, faExternalLinkAlt, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { injectIntl } from 'react-intl';
import { attachmentType, designProperties } from './Enumeration';
import ConfirmDialog from './confirm-alert/confirm-alert.component.jsx';
import { Attachments } from './dropzone/dropzone.styles.jsx';
import { getAttachedFileIcon } from './FileIcon.js';
import { MediaLabel, MediaSubHeader } from './App.styles.jsx';
import { Nav } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import '../pages/registration/registration.css'
import { bytesToSize } from './CommonScript';
import ReactTooltip from 'react-tooltip';
import CustomPager from './CustomPager.jsx';
class ListAttachment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: {},
            buttonCount: 2,
            info: true,
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        }
    }
    render() {

        const { fileName, deleteId, editId, defaultId, viewId } = this.props;
        let data = this.props.hidePaging ? this.props.attachmentList : this.props.attachmentList.slice(this.state.skip, ((this.state.skip) + (this.state.take)))
        return (
            <ListGroup variant="flush">
                {data.length > 0 ?
                    data.map((file, index) => {
                        let fileExtension = "";
                        if (file.nattachmenttypecode === attachmentType.FTP) {
                            const splittedFileName = file[fileName].split('.');
                            fileExtension = file[fileName].split('.')[splittedFileName.length - 1];
                        }
                        return (
                            <>
                                <ReactTooltip place="bottom" globalEventOff="true" id="tooltip_attachment_wrap" />
                                <ListGroup.Item key={`file_${index}`}>
                                    <Attachments>
                                        <Media>
                                            <Image
                                                width={40}
                                                height={40}
                                                className="mr-2"
                                                src={getAttachedFileIcon(fileExtension)}
                                            />
                                            <Media.Body>
                                                <h5 className="mt-0 attatchment-title">{file[fileName]}</h5>
                                                <div className="attatchment-details">
                                                    {/* {file[this.props.mainField]?<>{file[this.props.mainField]}<span className="seperator">|</span></>:""}{file.screateddate} 
                                        {
                                            file.nattachmenttypecode === attachmentType.FTP?
                                                <>
                                                    {file[filesize]?<><span className="seperator">|</span>{file[filesize]} bytes</>:""}
                                                    {file[defaultStatusName]?<><span className="seperator">|</span>{file[defaultStatusName]} </>:""}
                                                </>
                                            :
                                                <>
                                                    {file[linkname]?<><span className="seperator">|</span>{file[linkname]}</>:""}
                                                    {file[defaultStatusName]?<><span className="seperator">|</span>{file[defaultStatusName]}</>:""}
                                                </>
                                        } */}
                                                    {
                                                        this.props.subFields && this.props.subFields.map((field, i) =>
                                                            <>
                                                                {field['fieldType'] === 'size' ?
                                                                    <MediaLabel>{bytesToSize(file[field[designProperties.VALUE]])}</MediaLabel> :
                                                                    <MediaLabel>{file[field[designProperties.VALUE]]}</MediaLabel>}
                                                                {/* {this.props.subFields.length > 1 && i % 2 === 0 ?<MediaLabel className="seperator">|</MediaLabel>: ""} */}
                                                                {i !== this.props.subFields.length - 1 ? <MediaLabel className="seperator">|</MediaLabel> : ""}
                                                            </>
                                                        )
                                                    }
                                                    {
                                                        this.props.moreField && this.props.moreField.length > 0 ?
                                                            <>
                                                                <MediaLabel>
                                                                    <Nav.Link name={`show-wrap_${index}`} className={`show-more-action showmore`} onClick={(event) => this.showHideDetails(event, index)} style={{ display: "inline" }}>
                                                                        <Form.Label className={`show-more-link showmore`} for={`show-wrap_${index}`}>{` ...${this.props.intl.formatMessage({ id: this.state.showMore[index] ? "IDS_SHOWLESS" : "IDS_SHOWMORE" })}`}</Form.Label>
                                                                    </Nav.Link>
                                                                </MediaLabel>
                                                                <Media.Body className={`show-more-wrap ${this.state.showMore[index] ? "showmore" : ""}`}>
                                                                    <MediaSubHeader>
                                                                        {this.props.moreField.map((field, i) =>
                                                                            <>
                                                                                <MediaLabel style={{ fontWeight: "bold" }}>{field[1] ? this.props.intl.formatMessage({ id: field[designProperties.LABEL] }) + ": " : ""} </MediaLabel>
                                                                                <MediaLabel>{file[field[designProperties.VALUE]]}</MediaLabel>
                                                                                {field['fieldType'] === 'size' ? <>{" "} bytes</> : ""}
                                                                                {i % 2 === 0 && i !== this.props.moreField.length - 1 ?
                                                                                    <MediaLabel className="seperator">|</MediaLabel> : ""}
                                                                                {(i + 1) % 2 === 0 ? <br></br> : ""}
                                                                            </>
                                                                        )}
                                                                    </MediaSubHeader>
                                                                </Media.Body>
                                                            </>
                                                            : ""
                                                    }
                                                </div>
                                            </Media.Body>
                                            <>
                                                <Nav.Link className="action-icons-wrap">
                                                    {file.nattachmenttypecode === attachmentType.FTP ?
                                                        <FontAwesomeIcon icon={faCloudDownloadAlt} className="mr-3" size="lg" hidden={this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                                            data-for="tooltip_attachment_wrap"
                                                            onClick={() => this.props.viewFile(file)} />
                                                        : <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-3" size="lg" hidden={this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_LINK" })}
                                                            data-for="tooltip_attachment_wrap"
                                                            onClick={() => this.props.viewFile(file)} />

                                                    }
                                                    <FontAwesomeIcon icon={faThumbtack} className="mr-3" size="lg" hidden={this.props.userRoleControlRights.indexOf(defaultId) === -1}
                                                        onClick={() => this.props.defaultRecord({ ...this.props.defaultParam, selectedRecord: file })} />
                                                    <FontAwesomeIcon icon={faPencilAlt} className="mr-3 d-font-icon" size="lg" hidden={this.props.userRoleControlRights.indexOf(editId) === -1}
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                        data-for="tooltip_attachment_wrap"
                                                        onClick={() => this.props.fetchRecord({ ...this.props.editParam, selectedRecord: file, operation: "update"  })} />
                                                    <ConfirmDialog
                                                        name="deleteMessage"
                                                        message={this.props.intl.formatMessage({ id: "IDS_DELETECONFIRMMSG" })}
                                                        cardTitle={this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" })}
                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                        dataforprops="tooltip_attachment_wrap"
                                                        icon={faTrashAlt}
                                                        size="lg"
                                                        title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                        hidden={this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                        handleClickDelete={() => this.props.deleteRecord({ ...this.props.deleteParam, selectedRecord: file, ncontrolCode: deleteId, data, skip: this.props.skip ? this.props.skip : this.state.skip, take: this.props.take ? this.props.take : this.state.take })}
                                                    />
                                                </Nav.Link>
                                            </>
                                        </Media>
                                    </Attachments>
                                </ListGroup.Item>
                            </>
                        );
                    }) : <ListGroup.Item>
                        <Attachments className="norecordtxt">
                            {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                        </Attachments>
                    </ListGroup.Item>
                }
                {this.props.hidePaging ? "" :
                    <CustomPager
                        skip={this.state.skip}
                        take={this.state.take}
                        // width={20}
                        pagershowwidth={33}
                        handlePageChange={this.handlePageChange}
                        total={this.props.attachmentList ? this.props.attachmentList.length : 0}
                        buttonCount={this.state.buttonCount}
                        info={this.state.info}
                        pageSize={this.props.settings ? this.props.settings[15].split(",").map(setting => parseInt(setting)):[5, 10,15]}

                    >
                    </CustomPager>
                }
            </ListGroup>
        );
    }
    showHideDetails = (event, index) => {

        event.stopPropagation();
        let showMore = { ...this.state.showMore, [index]: !this.state.showMore[index] }
        this.setState({ showMore })

    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    componentDidUpdate(previousProps) {
        if (this.props.attachmentList !== previousProps.attachmentList) {
            if (this.props.skip === undefined && this.props.attachmentList && this.props.attachmentList.length <= this.state.skip) {
                this.setState({ skip: 0 });
            }
        }
        if (this.props.skip !== undefined && this.props.skip !== previousProps.skip) {
            this.setState({ skip: this.props.skip, take: this.props.take });
        }
    }
}
export default injectIntl(ListAttachment);