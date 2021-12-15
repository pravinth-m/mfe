import React from 'react';
import './form-textarea.styles.jsx';
import { Form } from 'react-bootstrap';
const FormTextarea = ({
    name,
    type,
    placeholder,
    onChange,
    className,
    value,
    // error,
    errors,
    isMandatory,
    children,
    rows,
    label,
    defaultValue,
    readOnly,
    isDisabled,
    isInvalid,
    ...props 
}) => (
        <React.Fragment>
            <Form.Group className="floating-label">
                <Form.Control as="textarea" 
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    rows={rows}
                    onChange={onChange}
                    value={value}
                    className={className}
                    defaultValue={defaultValue}
                    maxLength={props.maxLength}
                    required={props.required}
                    readOnly={readOnly}
                    disabled={isDisabled}
                    autoComplete="off"
                    isInvalid={isInvalid}
                 />
                 <Form.Label htmlFor={name}>{label}{ isMandatory && <sup>*</sup>}</Form.Label>
                 <Form.Control.Feedback type="invalid">
                { errors }
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    );
    FormTextarea.defaultProps = {
        rows: "2",
        className: ""
    }
export default FormTextarea;