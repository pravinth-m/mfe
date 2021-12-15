import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component.jsx';
import FormTextarea from '../../components/form-textarea/form-textarea.component.jsx';

const CreatePassWord = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    name="sloginid"
                    label={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    type="text"
                    placeholder={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    value={props.sloginid}
                    readonly
                />
                <FormInput
                    name="snewpassword"
                    label={props.intl.formatMessage({ id: "IDS_NEWPASSWORD" })}
                    type="password"
                    required={true}
                    isMandatory={"*"}
                    placeholder={props.intl.formatMessage({ id: "IDS_NEWPASSWORD" })}
                    onChange={(event) => props.onInputChange(event)}
                    value={props.createPwdRecord.snewpassword? props.createPwdRecord.snewpassword: ""}
                />
                <FormInput
                    name="sconfirmpassword"
                    label={props.intl.formatMessage({ id: "IDS_CONFIRMPASSWORD" })}
                    type="password"
                    required={true}
                    isMandatory={"*"}
                    placeholder={props.intl.formatMessage({ id: "IDS_CONFIRMPASSWORD" })}
                    onChange={(event) => props.onInputChange(event)}
                    value={props.createPwdRecord.sconfirmpassword? props.createPwdRecord.sconfirmpassword: ""}
                />
                <FormTextarea
                    name="description" 
                    rows="3"
                    value={props.msg}
                >
                </FormTextarea>
            </Col>
        </Row>
    );
};

export default injectIntl(CreatePassWord);