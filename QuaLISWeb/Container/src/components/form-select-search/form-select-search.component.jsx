import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';

const FormSelectSearch = ({
    name,
    formLabel,
    label,
    placeholder,
    isMandatory,
    optionId,
    optionValue,
    options,
    value,
    defaultValue,
    isMulti,
    isSearchable,
    isDisabled,
    onChange,
    onBlur,
    closeMenuOnSelect,
    className,
    classNamePrefix,
    minMenuHeight,
    maxMenuHeight,
    openMenuOnFocus,
    menuPlacement,
    menuPortalTarget,
    menuPosition,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    isInvalid,
    required,
    onKeyUp,
    ...props
}) => {
    // const optionList =Object.values(
    //                                 (props.sortField ? (
    //                                                     (props.sortOrder === "ascending" ?
    //                                                         options.sort((itemA, itemB) => itemA[props.sortField] < itemB[props.sortField] ? -1 : 1)
    //                                                         : options.sort((itemA, itemB) => itemA[props.sortField] > itemB[props.sortField] ? -1 : 1))
    //                                                     )
    //                                 : (props.alphabeticalSort ?
    //                                     options.sort((itemA, itemB) => itemA[optionValue] < itemB[optionValue] ? -1 : 1) : options)

    //                                 )
    //                             ).map(item =>(
    //                                 item.ndefaultstatus === transactionStatus.YES ? (defaultValue ={label: item[optionValue], value: item[optionId], item: item}) : "",
    //                                 { label: item[optionValue], value: item[optionId], item: item }
    //                             ));
    return (
        <React.Fragment>
            <Form.Group onKeyUp={onKeyUp} className="form-select w-100 floating-label react-select-wrap" controlId={name}>
                <Select
                    inputId={name}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    options={options}
                    value={value}
                    isInvalid={isInvalid}
                    required={required}
                    defaultValue={defaultValue}
                    isMulti={isMulti}
                    isSearchable={isSearchable}
                    isDisabled={isDisabled}
                    isClearable={props.isClearable}
                    onChange={onChange}
                    onBlur={onBlur}
                    closeMenuOnSelect={closeMenuOnSelect}
                    className={className}
                    classNamePrefix="react-select"
                    minMenuHeight={minMenuHeight}
                    maxMenuHeight={maxMenuHeight}
                    openMenuOnFocus={true}
                    menuPlacement={"auto"}
                    autoComplete="off"
                    menuPosition={menuPosition}
                // menuPortalTarget={document.querySelector('body')}
                // menuPosition="absolute"
                // styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}

                />
                <Form.Label htmlFor={name}>{formLabel}{isMandatory && <sup>*</sup>}</Form.Label>
                <Form.Control.Feedback type="invalid">
                    {errors}
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    )


};
export default FormSelectSearch;