import React from 'react';
import MultiSelect from 'react-multi-select-component';
import { MultiSelectWrap } from '../form-multi-select/form-multi-select.styles.jsx';
import { Form } from 'react-bootstrap';

function FormMultiSelect({ 
    name,
    className,
    isMandatory,
    errors,
    ClearIcon,
    label,
    ClearSelectedIcon,
    disableSearch,
    disabled,
    ArrowRenderer,
    focusSearchOnOpen,
    optionId,
    optionValue,
    options,
    value,
    onChange,
    isInvalid,
    ...props

    }) {
    
    return (
        <React.Fragment>
            <Form.Group className="floating-label">
                <MultiSelectWrap>
                    <Form.Label htmlFor={name}>{label}{ isMandatory && <sup>*</sup>}</Form.Label>
                    <MultiSelect
                        //options={options}
                        // options={
                        //         Object.values((props.sortField ? (
                        //                 (props.sortOrder  === "ascending" ?
                        //                         options.sort((itemA, itemB) => itemA[props.sortField] < itemB[props.sortField] ? -1 : 1) 
                        //                         : options.sort((itemA, itemB) => itemA[props.sortField] > itemB[props.sortField] ? -1 : 1) )
                        //             )
                        //             : (props.alphabeticalSort ?
                        //                 options.sort((itemA, itemB) => itemA[optionValue] < itemB[optionValue] ? -1 : 1) : options)
                                    
                        //         )
                        //         ).map(item => {
                        //             return { label: item[optionValue], value: item[optionId], item: item }
                        //         })}
                                options={options
                                    }
                        value={value}
                        onChange={onChange}
                        labelledBy={"Select"}
                        name={name}
                        className={className}
                        isMandatory={isMandatory}
                        label={label}
                        errors={errors}
                        ClearIcon={ClearIcon}
                        ClearSelectedIcon={ClearSelectedIcon}
                        disableSearch={disableSearch}
                        disabled={disabled}
                        focusSearchOnOpen={focusSearchOnOpen}
                        ArrowRenderer={ArrowRenderer}
                        isInvalid={isInvalid}
                    />
                </MultiSelectWrap>

                <Form.Control.Feedback type="invalid">
                    { errors }
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    );
}
export default FormMultiSelect;