import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
import { DEFAULT_RETURN } from '../../actions/LoginTypes.js';
import { ModalInner } from '../../components/App.styles.jsx';
import { transactionStatus } from '../Enumeration';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

class SlideOutModal extends React.Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
    formRef = React.createRef();
    state = { masterStatus: "", failedControls: [] }


    handleSaveClick = (saveType) => {
        const failedControls = [];
        const startLabel = [];
        let label = "IDS_ENTER";
        let mandatoryFields = this.props.mandatoryFields || [];
        if (this.props.esign) {
            mandatoryFields = [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            ]
        }
        mandatoryFields.forEach(item => {
            if (this.props.selectedRecord[item.dataField] === undefined || this.props.selectedRecord[item.dataField] === null) {
                const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                failedControls.push(alertMessage);
                startLabel.push(item.mandatoryLabel)//"IDS_PROVIDE";
            }
            else {
                if (item.validateFunction) {
                    const validateData = item.validateFunction;
                    if (validateData(this.props.selectedRecord[item.dataField]) === false) {
                        const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                        failedControls.push(alertMessage);
                        startLabel.push(item.mandatoryLabel)
                    }
                }
                else {
                    if (typeof this.props.selectedRecord[item.dataField] === "object") {
                        //to validate FormSelectSearch component
                        if (this.props.selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)//"IDS_SELECT";
                        }
                    }
                    else if (typeof this.props.selectedRecord[item.dataField] === "string") {
                        //to handle string field -- added trim function
                        if (this.props.selectedRecord[item.dataField].trim().length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                    else {
                        //number field
                        if (this.props.selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                }
            }
            // else{
            //     const alertMessage=(item.alertPreFix?item.alertPreFix:'')+this.props.intl.formatMessage({id:item.idsName})+(item.alertSuffix?item.alertSuffix:'')
            //     failedControls.push(alertMessage);
            // }
        });
        // console.log("validationPassed:", failedControls);

        if (failedControls.length === 0) {
            if (saveType === 4) {
                this.props.onExecuteClick(this.formRef);
            }
            else if (saveType === 3) {
                if (this.props.selectedRecord.agree && this.props.selectedRecord.agree === transactionStatus.NO) {

                    toast.info(this.props.intl.formatMessage({ id: "IDS_CHECKAGREE" }));

                } else {

                    this.props.validateEsign();
                }
            }
            else {
                this.props.onSaveClick(saveType, this.formRef);
            }
        }
        else {
            //toast.info(`${this.props.intl.formatMessage({id:"IDS_ENTER"})} ${failedControls.join(",")}`);
            label = startLabel[0] === undefined ? label : startLabel[0];
            toast.info(`${this.props.intl.formatMessage({ id: label })} ${failedControls[0]}`);
        }

    }

    componentDidUpdate() {
        let masterStatus = this.props.masterStatus;
        if (masterStatus !== "" && masterStatus !== undefined) {
            toast.warn(masterStatus);
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterStatus: "" }
            }
            this.props.updateStore(updateInfo);
            masterStatus = "";
        }
        if (this.props.innerPopup !== this.state.innerTop) {
            setTimeout(() => {
                let scrollDoc = this.props.modalEvent && this.props.modalEvent.id ? document.getElementById(this.props.modalEvent.id) : null;
                if (this.myRef && this.myRef.current) {
                    this.myRef.current.scrollIntoView({ behavior: 'smooth' })
                }
                if (scrollDoc) {
                    scrollDoc.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
            this.setState({
                innerTop: this.props.innerPopup
            })
        }
        return null;
    }

    render() {

        let saveType = 1;
        if (this.props.ignoreFormValidation) {
            saveType = 5;
        }
        let buttonLabel = "Save";
        let idsLabel = "IDS_SAVE";
        if (this.props.buttonLabel) {
            buttonLabel = this.props.buttonLabel;
            idsLabel = 'IDS_'.concat(buttonLabel.toUpperCase());
        }
        return (
            <Modal
                size={this.props.size || "lg"}
                backdrop="static"
                className={this.props.className || ""}
                show={this.props.show}
                onHide={this.props.closeModal}
                enforceFocus={false}
                dialogClassName="modal-dialog-slideout freakerstop"
                aria-labelledby="add-user">
                <Modal.Header className="d-flex align-items-center">
                    <Modal.Title id="add-user" className="header-primary flex-grow-1">
                        {this.props.graphView === true ? "" : this.props.inputParam ?
                            this.props.esign === true ?
                                <FormattedMessage id={"IDS_ESIGN"} defaultMessage="Esign" />
                                : this.props.loginoperation ?
                                    <FormattedMessage id={this.props.screenName} />
                                    : <>
                                        {this.props.operation ?
                                            <>
                                                <FormattedMessage id={this.props.operation && "IDS_".concat(this.props.operation.toUpperCase())}
                                                    defaultMessage='Add' />
                                                {" "}
                                                {
                                                    this.props.screenName ?
                                                        <FormattedMessage id={this.props.screenName} />
                                                        : ""
                                                }
                                            </>
                                            :
                                            this.props.screenName ?
                                                <FormattedMessage id={this.props.screenName} />
                                                : ""}
                                    </>
                            : ""}
                    </Modal.Title>
                    <Button className="btn-user btn-cancel" variant="" onClick={this.props.closeModal}>
                        <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                    </Button>
                    {this.props.esign === true ?
                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(3)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />
                        </Button>
                        :
                        (this.props.operation === "create" || this.props.operation === "update") && this.props.showValidate ?
                            <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(4)}>
                                <FontAwesomeIcon icon={faSave} /> { }
                                <FormattedMessage id='IDS_VALIDATE' defaultMessage='Validate' />
                            </Button> :
                            this.props.showCalculate ?
                                <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(saveType)}>
                                    <FontAwesomeIcon icon={faSave} /> { }
                                    <FormattedMessage id='IDS_CALCULATE' defaultMessage='Calculate' />
                                </Button> :
                                this.props.showParam === true && this.props.showExecute ?
                                    <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(4)}>
                                        <FontAwesomeIcon icon={faCalculator} /> { }
                                        <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />
                                    </Button> :
                                    this.props.noSave || this.props.graphView ?
                                        this.props.operation === "view" ? ""
                                            : <Button className="btn btn-user btn-primary-blue" role="button"
                                                onClick={this.props.resetView}
                                            >
                                                <FormattedMessage id={"IDS_RESET"} defaultMessage='Reset' />
                                            </Button>
                                        : this.props.hideSave ? "" :
                                            <Button className=" btn-user btn-primary-blue" onClick={() => this.handleSaveClick(saveType)}>
                                                <FontAwesomeIcon icon={faSave} /> { }
                                                <FormattedMessage id={idsLabel} defaultMessage={buttonLabel} />
                                            </Button>
                    }
                    {this.props.operation === "create" && this.props.showSaveContinue ?
                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(2)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_SAVECONTINUE' defaultMessage='Save & Continue' />
                        </Button>
                        : ""
                    }
                    {(this.props.operation === "create" || this.props.operation === "update")
                        && this.props.esign !== true && this.props.showExecute === true && this.props.showSave ?
                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(1)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_SAVE' defaultMessage='Save' />
                        </Button>
                        : ""}
                </Modal.Header>
                <Modal.Body>
                    <ModalInner ref={this.myRef}>
                        <Card.Body>
                            <React.Fragment>
                                <Form ref={this.formRef}>
                                    {this.props.addComponent}
                                    {/* {this.props.addComponent({...this.props.addComponentParam, failedControls:this.state.failedControls})} */}
                                </Form>
                            </React.Fragment>
                        </Card.Body>
                    </ModalInner>
                </Modal.Body>
            </Modal>
        );
    }

    // showComponent =()=>{
    //     {this.props.addComponent}
    // }
}

export default injectIntl(SlideOutModal);