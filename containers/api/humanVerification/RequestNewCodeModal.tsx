import React from 'react';
import { c } from 'ttag';

import { FormModal, PrimaryButton, Button, ResetButton } from '../../../components';

interface Props {
    email?: string;
    phone?: string;
    onEdit: () => void;
    onResend: () => void;
    [key: string]: any;
}

const RequestNewCodeModal = ({ email, phone, onEdit, onResend, ...rest }: Props) => {
    const strongEmail = <strong key="email">{email}</strong>;
    const strongPhone = <strong key="phone">{phone}</strong>;
    return (
        <FormModal
            title={c('Title').t`Request new verification code`}
            small
            footer={
                <>
                    <PrimaryButton
                        className="button--large"
                        onClick={() => {
                            rest.onClose();
                            onResend();
                        }}
                    >{c('Action').t`Request new code`}</PrimaryButton>
                    <Button
                        className="button--link"
                        onClick={() => {
                            rest.onClose();
                            onEdit();
                        }}
                    >
                        {email ? c('Action').t`Edit email address` : c('Action').t`Edit phone number`}
                    </Button>
                    <ResetButton className="button--link">{c('Action').t`Cancel`}</ResetButton>
                </>
            }
            {...rest}
        >
            {email ? (
                <p>{c('Info')
                    .jt`Click "Request new code" to have a new verification code sent to ${strongEmail}. If this email address is incorrect, click "Edit" to correct it.`}</p>
            ) : null}
            {phone ? (
                <p>{c('Info')
                    .jt`Click "Request new code" to have a new verification code sent to ${strongPhone}. If this phone number is incorrect, click "Edit" to correct it.`}</p>
            ) : null}
        </FormModal>
    );
};

export default RequestNewCodeModal;
