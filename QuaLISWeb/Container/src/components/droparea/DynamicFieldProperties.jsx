import React from 'react'
import { Row, Col, Form, FormLabel } from 'react-bootstrap';
//import FormInput from '../../components/form-input/form-input.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { ReactComponents, transactionStatus } from '../../components/Enumeration';
import FormInput from '../../components/form-input/form-input.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormSelectSearch from '../form-select-search/form-select-search.component';

const DynamicFieldProperties = (props) => {

    return (
        Object.keys(props.selectedFieldRecord).length > 0 ?
            <Row>
                <Col md={12} className="pr-2">

                    <FormLabel className="mb-3">{props.intl.formatMessage({ id: "IDS_INPUTTYPE" })} : <strong>{props.selectedFieldRecord.componentname}</strong></FormLabel>

                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_LABEL" })}
                        name={"label"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_LABEL" })}
                        value={props.selectedFieldRecord["label"] ? props.selectedFieldRecord["label"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"30"}
                    />
                </Col>
                <Col md={6}>
                    <CustomSwitch
                        label={props.intl.formatMessage({ id: "IDS_MANDATORY" })}
                        type="switch"
                        name={"nmandatory"}
                        onChange={(event) => props.onInputOnChange(event)}
                        defaultValue={props.selectedFieldRecord["nmandatory"] ? props.selectedFieldRecord["nmandatory"] === transactionStatus.YES ? true : false : false}
                        isMandatory={false}
                        required={true}
                        checked={props.selectedFieldRecord["nmandatory"] ? props.selectedFieldRecord["nmandatory"] === transactionStatus.YES ? true : false : false}
                    />
                </Col>
                <Col md={6}>
                    <CustomSwitch
                        label={props.intl.formatMessage({ id: "IDS_READONLY" })}
                        type="switch"
                        name={"readonly"}
                        onChange={(event) => props.onInputOnChange(event)}
                        defaultValue={props.selectedFieldRecord["readonly"] ? props.selectedFieldRecord["readonly"] === transactionStatus.YES ? true : false : false}
                        isMandatory={false}
                        required={true}
                        checked={props.selectedFieldRecord["readonly"] ? props.selectedFieldRecord["readonly"] === transactionStatus.YES ? true : false : false}
                    />
                </Col>
                <Col md={12}>
                    {props.selectedFieldRecord.componentcode === ReactComponents.TEXTINPUT ||
                        props.selectedFieldRecord.componentcode === ReactComponents.TEXTAREA ?
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXLENGTH" })}
                            name={"sfieldlength"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXLENGTH" })}
                            value={props.selectedFieldRecord["sfieldlength"] ? props.selectedFieldRecord["sfieldlength"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                        /> : ""}
                    {props.selectedFieldRecord.componentcode === ReactComponents.COMBO ?
                        <>
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_SOURCE" })}
                                isSearchable={true}
                                name={"source"}
                                isDisabled={false}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={false}
                                options={props.tables}
                                value={props.selectedFieldRecord ? props.selectedFieldRecord["table"] : ""}
                                onChange={value => props.onComboChange(value, "table")}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_DISPLAYMEMBER" })}
                                isSearchable={true}
                                name={"displaymember"}
                                isDisabled={false}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={false}
                                options={props.tableColumn}
                                value={props.selectedFieldRecord ? props.selectedFieldRecord["column"] : ""}
                                onChange={value => props.onComboChange(value, "column")}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                        </>
                        : ""}
                    {props.selectedFieldRecord.componentcode === ReactComponents.NUMERIC ?
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_PRECISION" })}
                            name={"precision"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_PRECISION" })}
                            value={props.selectedFieldRecord["precision"] ? props.selectedFieldRecord["precision"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"10"}
                        /> : ""}
                </Col>
            </Row>
            : ""
    )
}

export default injectIntl(DynamicFieldProperties);