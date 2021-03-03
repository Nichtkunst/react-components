import { c } from 'ttag';
import React, { useState } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';
import { isNumber } from 'proton-shared/lib/helpers/validators';
import { numberValidator, requiredValidator } from 'proton-shared/lib/helpers/formValidators';
import { FormField, Button, useFormErrors, InputTwo } from '../../../components';
import { useLoading } from '../../../hooks';
import { VerificationModel } from './interface';
import { getFormattedCode } from './helper';

interface Props {
    onSubmit: (token: string, tokenType: 'email' | 'sms') => void;
    onNoReceive: () => void;
    verification: VerificationModel;
}

const VerifyCodeForm = ({ onSubmit, onNoReceive, verification }: Props) => {
    const [code, setCode] = useState('');
    const [loading, withLoading] = useLoading();

    const { errors, setters, onFormSubmit } = useFormErrors(
        () => ({
            code: [requiredValidator(code), numberValidator(code)],
        }),
        {
            code: setCode,
        },
        loading
    );

    const handleSubmit = async () => {
        if (loading || !onFormSubmit()) {
            return;
        }
        const token = getFormattedCode(verification.value, code);
        return onSubmit(token, verification.method);
    };

    const destinationText = <strong key="destination">{verification.value}</strong>;

    return (
        <>
            <div className="mb2">
                {c('Info').jt`Enter the verification code that was sent to ${destinationText}.`}{' '}
                {verification.method === 'email'
                    ? c('Info').t`If you don't find the email in your inbox, please check your spam folder.`
                    : null}
            </div>
            <FormField
                id="verification"
                bigger
                label={c('Label').t`Verification code`}
                error={errors.code}
                assistiveText={c('Label').t`Enter the 6-digit code`}
            >
                <InputTwo
                    inputMode="numeric"
                    autoFocus
                    value={code}
                    onValue={(value: string) => {
                        if (!value || isNumber(value)) {
                            setters.code?.(value);
                        }
                    }}
                    maxLength={6}
                    placeholder="123456"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            withLoading(handleSubmit()).catch(noop);
                        }
                    }}
                />
            </FormField>
            <div className="mt1">
                <Button
                    size="large"
                    color="norm"
                    type="button"
                    className="w100"
                    loading={loading}
                    onClick={() => {
                        withLoading(handleSubmit()).catch(noop);
                    }}
                >{c('Action').t`Verify`}</Button>
            </div>
            <div className="mt0-25">
                <Button
                    size="large"
                    color="norm"
                    type="button"
                    shape="ghost"
                    className="w100"
                    disabled={loading}
                    onClick={() => {
                        setters.code?.('');
                        onNoReceive();
                    }}
                >{c('Action').t`Did not receive the code?`}</Button>
            </div>
        </>
    );
};

export default VerifyCodeForm;