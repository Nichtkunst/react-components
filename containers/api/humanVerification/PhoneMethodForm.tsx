import { c } from 'ttag';
import React, { useState } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';
import { Api } from 'proton-shared/lib/interfaces';
import { validatePhone } from 'proton-shared/lib/api/core/validate';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { requiredValidator } from 'proton-shared/lib/helpers/formValidators';
import { FormField, Button, useFormErrors, IntlTelInput } from '../../../components';
import { useLoading } from '../../../hooks';

interface Props {
    onSubmit: (phone: string) => Promise<void>;
    defaultPhone?: string;
    defaultCountry?: string;
    api: Api;
}

const EmailMethodForm = ({ api, onSubmit, defaultPhone = '', defaultCountry }: Props) => {
    const [phone, setPhone] = useState(defaultPhone);
    const [loading, withLoading] = useLoading();

    const { errors, setters, setError, onFormSubmit } = useFormErrors(
        () => ({
            phone: [requiredValidator(phone)],
        }),
        {
            phone: setPhone,
        },
        loading
    );

    const handleSubmit = async () => {
        if (loading || !onFormSubmit()) {
            return;
        }

        try {
            await api(validatePhone(phone));
        } catch (error) {
            setError('phone', getApiErrorMessage(error) || c('Error').t`Can't validate phone, try again later`);
            throw error;
        }

        await onSubmit(phone);
    };

    return (
        <>
            <FormField id="phone" bigger label={c('Label').t`Phone number`} error={errors.phone}>
                <IntlTelInput
                    containerClassName="w100"
                    inputClassName="w100 inputfield-field"
                    dropdownContainer="body"
                    useNewFormStyle
                    defaultCountry={defaultCountry}
                    autoFocus
                    onPhoneNumberChange={(status: any, value: any, countryData: any, number: string) =>
                        setters.phone?.(number)
                    }
                    onKeyDown={(event: any) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            withLoading(handleSubmit()).catch(noop);
                        }
                    }}
                    defaultValue={defaultPhone}
                />
            </FormField>
            <Button
                size="large"
                color="norm"
                type="button"
                className="w100"
                loading={loading}
                onClick={() => withLoading(handleSubmit()).catch(noop)}
            >
                {c('Action').t`Get verification code`}
            </Button>
        </>
    );
};

export default EmailMethodForm;
