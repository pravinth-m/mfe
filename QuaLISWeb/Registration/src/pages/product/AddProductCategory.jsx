import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component.jsx';
import FormTextarea from '../../components/form-textarea/form-textarea.component.jsx';
import CustomSwitch from '../../components/custom-switch/custom-switch.component.jsx';

const AddProductCategory = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_SPECIMENCATEGORY" })}
                    name="sproductcatname"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_SPECIMENCATEGORY" })}
                    value={props.selectedRecord["sproductcatname"] ? props.selectedRecord["sproductcatname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name="sdescription"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"] ? props.selectedRecord["sdescription"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
            <Col md={12} hidden={true}>
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    type="switch"
                    name={"ncategorybasedflow"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["ncategorybasedflow"] === 3 ? true : false}
                //   disabled={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === 3 ? true : false : false}
                >
                </CustomSwitch>
            </Col>
            <Col md={12}>
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_DISPLAYSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DISPLAYSTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["ndefaultstatus"] === 3 ? true : false}
                //  disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                >
                </CustomSwitch>
            </Col>
        </Row>
    );
};

export default AddProductCategory;