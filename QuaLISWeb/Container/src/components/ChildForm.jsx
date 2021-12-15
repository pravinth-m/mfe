import React from 'react';
import FotmChildInput from 'marketing/ChildForminput'

export default ({ name, label, required, isMandatory, onChange, onBlur, value }) => {
    console.log('childForm');
    return (<FotmChildInput
        name={name}
        label={label}
        type="text"
        // placeholder={this.props.intl.formatMessage({ id: "IDS_LOGINID" })}
        required={true}
        isMandatory={"*"}
        onChange={onChange}
        onBlur={onBlur}
        // onKeyUp={this.AutoLogin} 
        value={value} />)
}
