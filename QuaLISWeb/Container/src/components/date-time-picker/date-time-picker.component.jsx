import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from 'react-bootstrap';

const DateTimePicker = ({
    name,
    portalId,
    className,
    dateFormat,
    placeholderText,
    timeFormat,
    showTimeSelect,
    selected,
    isMandatory,
    onChange,

    label,
    ...props
}) => (
    <React.Fragment>
        <Form.Group className="floating-label react-date-picker">
            <Form.Label htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>
            <DatePicker
                name={name}
                portalId={portalId}
                selected={selected}
                dateFormat={dateFormat}
                showTimeSelect={showTimeSelect}
                timeFormat={timeFormat}
                timeIntervals={props.timeIntervals}
                className={className}
                placeholderText={placeholderText}
                isClearable={props.isClearable}
                onChange={onChange}
                readOnly={props.readOnly}
                showTimeInput={props.showTimeInput}
                timeInputLabel={props.timeInputLabel}
                maxDate={props.maxDate}
                maxTime={props.maxTime}
                minDate={props.minDate}
                minTime={props.minTime}
                autoComplete="off"
                onSelect={props.onSelect}
                //showYearDropdown={props.showYearDropdown}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                showYearPicker={props.showYearPicker}
                scrollableYearDropdown
                dropdownMode="select"
                disabled={props.isDisabled}
                yearDropdownItemNumber={props.yearDropdownItemNumber}
                popperPlacement="auto"
                popperProps={{
                    positionFixed: true // use this to make the popper position: fixed
                }}
                popperModifiers={{
                    flip: {
                      enabled: false
                    },
                    preventOverflow: {
                      enabled: true,
                      escapeWithReference: false
                    }
                }}
            />
        </Form.Group>
    </React.Fragment>
);

export default DateTimePicker;