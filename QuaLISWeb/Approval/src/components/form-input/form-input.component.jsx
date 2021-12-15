import React from 'react';
import './form-input.styles.jsx';
import { Form } from 'react-bootstrap';

const FormInput = ({
    name,
    type,
    placeholder,
    onChange,
    className,
    value,
    // error,
    isMandatory,
    isDisabled,
    children,
    label,
    defaultValue,
    required,
    onBlur,
    onKeyUp,
    errors,
    isInvalid,
    onKeyPress,
    ...props
}) => (
        <React.Fragment>
            <Form.Group className="floating-label" controlId={name}>
                <Form.Control
                    id={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    isInvalid={isInvalid}
                    className={className}
                    defaultValue={defaultValue}
                    required={required}
                    maxLength={props.maxLength}
                    readOnly={props.readOnly}
                    disabled={isDisabled}
                    onBlur={onBlur}
                    onKeyUp={onKeyUp}
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    autoComplete="off"
                    ref={props.ref}
                />
                <Form.Label htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>
                <Form.Control.Feedback type="invalid">
                { errors }
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    );
FormInput.defaultProps = {
    type: "text",
    className: ""
}
// FormInput.propTypes = {
//     name: PropTypes.string.isRequired,
//     type: PropTypes.string,
//     placeholder: PropTypes.string.isRequired,
//     type: PropTypes.oneOf(['text', 'number', 'password']),
//     className: PropTypes.string,
//     value: PropTypes.any,
//     onChange: PropTypes.func.isRequired
//   }

export default FormInput;