import React from 'react';

import Icon from '../../icon/Icon';
import Input, { InputTwoProps } from '../input/Input';
import { classnames, generateUID } from '../../../helpers';
import { useInstance } from '../../../hooks';

interface InputFieldProps extends InputTwoProps {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    assistiveText?: React.ReactNode;
    disabled?: boolean;
}

const InputField = (props: InputFieldProps) => {
    const { label, hint, assistiveText, disabled, error, id: idProp, ...rest } = props;

    const id = useInstance(() => idProp || generateUID());

    const classes = {
        root: classnames([
            'inputform-container w100 mb1',
            disabled && 'inputform-container--disabled',
            Boolean(error) && 'inputform-container--invalid',
        ]),
        labelContainer: 'flex inputform-label flex-justify-space-between flex-nowrap flex-align-items-end',
        inputContainer: 'inputform-field-container relative',
    };

    const hintElement = hint && <div className="inputform-label-hint flex-item-noshrink">{hint}</div>;

    const errorElement = error && (
        <div className="inputform-assist">
            {/* TODO: clear up inconsistency between design spacing & code unit system spacing */}
            {/* TODO: find out about missing "vertical-align-top" helper */}
            <Icon name="exclamation-circle-filled" style={{ verticalAlign: 'top', marginRight: '5px' }} />
            <span>{error}</span>
        </div>
    );

    const assitiveTextElement = assistiveText && <div className="inputform-assist">{assistiveText}</div>;

    return (
        <label className={classes.root} htmlFor={id}>
            <div className={classes.labelContainer}>
                <span className="inputform-label-text">{label}</span>

                {hintElement}
            </div>
            <div className={classes.inputContainer}>
                <Input className="w100" id={id} disabled={disabled} {...rest} />
            </div>

            {error ? errorElement : assitiveTextElement}
        </label>
    );
};

export default InputField;
