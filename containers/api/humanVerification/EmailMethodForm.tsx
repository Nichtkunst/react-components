import { c } from 'ttag';
import React, { useState } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';
import { Api } from 'proton-shared/lib/interfaces';
import { validateEmail } from 'proton-shared/lib/api/core/validate';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { requiredValidator } from 'proton-shared/lib/helpers/formValidators';

import { FormField, InputTwo, Button, useFormErrors } from '../../../components';
import { useLoading } from '../../../hooks';

interface Props {
    onSubmit: (email: string) => Promise<void>;
    defaultEmail?: string;
    api: Api;
}

const EmailMethodForm = ({ api, onSubmit, defaultEmail = '' }: Props) => {
    const [email, setEmail] = useState(defaultEmail);
    const [loading, withLoading] = useLoading();

    const { errors, setters, setError, onFormSubmit } = useFormErrors(
        () => ({
            email: [requiredValidator(email)],
        }),
        {
            email: setEmail,
        },
        loading
    );

    const handleSubmit = async () => {
        if (loading || !onFormSubmit()) {
            return;
        }

        try {
            await api(validateEmail(email));
        } catch (error) {
            setError('email', getApiErrorMessage(error) || c('Error').t`Can't validate email, try again later`);
            throw error;
        }

        await onSubmit(email);
    };

    return (
        <>
            <FormField bigger id="email" label={c('Label').t`Email address`} error={errors.email}>
                <InputTwo
                    autoFocus
                    type="email"
                    value={email}
                    onValue={setters.email}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            withLoading(handleSubmit()).catch(noop);
                        }
                    }}
                    required
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
