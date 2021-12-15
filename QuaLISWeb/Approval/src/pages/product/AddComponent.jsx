import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import {transactionStatus} from '../../components/Enumeration';
import {injectIntl } from 'react-intl';


const AddComponent = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_COMPONENT" })}
                    name={"scomponentname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_COMPONENT" })}
                    value={props.selectedRecord ? props.selectedRecord["scomponentname"] : ""}                   
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_COMPONENTSHORTNAME" })}
                    name={"scomponentshortname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_COMPONENTSHORTNAME" })}
                    value={props.selectedRecord ? props.selectedRecord["scomponentshortname"] : ""}
                    rows="2"                  
                    isMandatory={true}
                    required={true}
                    maxLength={"10"}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                    name={"scomments"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                    value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                    rows="3"                   
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
            </Col>
            <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                    type="switch"
                    name={"ntransactionstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : true}
                    error={""}
                    rows="4"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : true}

                >

                </CustomSwitch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_STORAGECONDITION" })}
                    isSearchable={true}
                    name={"nstorageconditioncode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.storageCondition}
                    // optionId='nstorageconditioncode'
                    // optionValue='sstorageconditionname'                                                                         
                    // defaultValue={props.nstorageconditioncode || []}
                    value={props.selectedRecord["nstorageconditioncode"] || []}
                    isClearable={false}
                    onChange={value => props.handleChange(value, "nstorageconditioncode", "")}
                    closeMenuOnSelect={true}
                    // alphabeticalSort= {true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_FINALPRODUCTUSAGE" })}
                    isSearchable={true}
                    name={"nproductdesccode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.productDescription}
                    // optionId='nproductdesccode'
                    // optionValue='sproductclass'                                                                         
                    // defaultValue={props.nproductdesccode || []}
                    value={props.selectedRecord["nproductdesccode"] || []}
                    onChange={value => props.handleChange(value, "nproductdesccode", "isMandate")}
                    closeMenuOnSelect={true}
                    // alphabeticalSort= {true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch

                    formLabel={props.intl.formatMessage({ id: "IDS_UPSTREAMPRODUCTTYPE" })}
                    isSearchable={true}
                    name={"nproducttypecode"}
                    isDisabled={false}
                    isClearable={props.requiredSymbol === 1 ? false : true}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={props.requiredSymbol === 1 ? true : false}
                    options={props.productType}
                    // optionId='nproducttypecode'
                    // optionValue='sproducttype'                                                                      
                    // defaultValue={props.nproducttypecode || []}
                    value={props.selectedRecord["nproducttypecode"] || []}
                    onChange={value => props.handleChange(value, "nproducttypecode", "")}
                    closeMenuOnSelect={true}
                    // alphabeticalSort= {true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_BULKTYPE" })}
                    isSearchable={true}
                    name={"nbulktypecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    isClearable={true}
                    options={props.bulkType}
                    // optionId='nbulktypecode'
                    // optionValue='sbulktype'
                    // value={this.state.nbulktypecode}
                   // defaultValue={props.nbulktypecode || []}
                   value={props.selectedRecord["nbulktypecode"] || []}
                    onChange={value => props.handleChange(value, "nbulktypecode")}
                    closeMenuOnSelect={true}
                    // alphabeticalSort= {true}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    )
}
export default injectIntl(AddComponent);