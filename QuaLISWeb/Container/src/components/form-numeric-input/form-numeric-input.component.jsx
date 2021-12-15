import React from 'react';
import NumericInput from 'react-numeric-input';
import { Form } from 'react-bootstrap';
const FormNumericInput = ({
    name,
    type,
    placeholder,
    onChange,
    onKeyUp,
    className,
    value,
    isMandatory,
    children,
    label,
    // isInvalid,
    onBlur,
    errors,
    strict,
    step,
    min,
    max,
    noStyle,
    maxLength,
    precision,
    snap,
    isDisabled,
    required,
    ...props
}) => (
    <React.Fragment>
        <Form.Group className="floating-label form-numeric-input">
            <NumericInput
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                min={min}
                max={max}
                step={step}
                precision={precision}
                strict={strict}
                maxLength={maxLength}
                onChange={onChange}
                onKeyUp={onKeyUp}
                // isInvalid={isInvalid}
                onBlur={onBlur}
                snap={snap}
                noStyle={noStyle}
                className={className}
                disabled={isDisabled}
                required={required}
                autoComplete="off"
                onPaste={(e) => {
                    e.preventDefault()
                    return false;
                }}
            />
            <Form.Label htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>

            {/* <Form.Control.Feedback type="invalid">
                { errors }
                </Form.Control.Feedback> */}
        </Form.Group>
    </React.Fragment>
);
FormNumericInput.defaultProps = {
    type: "number",
    className: ""
}
export default FormNumericInput;