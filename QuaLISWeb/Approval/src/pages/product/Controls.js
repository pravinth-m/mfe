import React from 'react'
import FormInput from '../../components/form-input/form-input.component';

const Controls=(data,props)=>{
    switch(data.data.inputtype){
        case "TextInput":
            return(
            <FormInput
             label={data.data.label}
             name={data.data.sdisplayname}
             type="text"
             onChange={(event) => data.props.onInputOnChange(event)}
             placeholder={data.data.label}
             value={data.props.selectedRecord[data.data.sdisplayname]
                 ? data.props.selectedRecord[data.data.sdisplayname] : ""}
             isMandatory={true}
             required={true}
             maxLength={100}
             /> 
            )
    }

}
export default Controls;