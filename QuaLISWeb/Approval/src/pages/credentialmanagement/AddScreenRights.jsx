import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component.jsx';
import { injectIntl } from 'react-intl';
const AddScreenRights = (props) => {
    return (

        <Row>
            <Col md={12}>
                <FormMultiSelect
                    name={"nformcode"}
                    label={ props.intl.formatMessage({ id:"IDS_SCREENRIGHTS" })}                              
                    options={ props.avaliableScreen || []}
                    optionId="nformcode"
                    optionValue="sdisplayname"
                    value = { props.selectedRecord["nformcode"] ? props.selectedRecord["nformcode"] || [] :[]}
                    isMandatory={true}                                               
                    isClearable={true}
                    disableSearch={false}                                
                    disabled={false}
                    closeMenuOnSelect={false}
                    alphabeticalSort={true}
                    onChange = {(event)=> props.onComboChange(event, "nformcode")}
                />
            </Col>
              
        </Row>



    )
}
export default injectIntl(AddScreenRights);
