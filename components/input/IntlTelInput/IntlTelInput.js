import React from 'react';
import PropTypes from 'prop-types';
import ReactIntlTelInput from 'react-intl-tel-input';
import './styles/_intlTelInput.scss';
import { classnames } from '../../../helpers';

const IntlTelInput = ({ containerClassName, inputClassName, useNewFormStyle, ...rest }) => (
    <ReactIntlTelInput
        containerClassName={classnames(['intl-tel-input', containerClassName])}
        inputClassName={classnames([useNewFormStyle ? 'inputform-field' : 'field', inputClassName])}
        {...rest}
    />
);

IntlTelInput.propTypes = {
    containerClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    useNewFormStyle: PropTypes?.bool,
};

export default IntlTelInput;
