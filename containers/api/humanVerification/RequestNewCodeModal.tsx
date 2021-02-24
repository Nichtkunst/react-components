import React from 'react';
import { c } from 'ttag';

import { FormModal, Button } from '../../../components';
import { useLoading } from '../../../hooks';
import { VerificationModel } from './interface';

interface Props {
    verificationModel: VerificationModel;
    onEdit: () => void;
    onResend: () => Promise<void>;

    [key: string]: any;
}

const RequestNewCodeModal = ({ verificationModel, onEdit, onResend, ...rest }: Props) => {
    const strong = <strong key="email">{verificationModel.value}</strong>;
    const [loading, withLoading] = useLoading();
    return (
        <FormModal
            title={c('Title').t`Request new verification code`}
            small
            hasConfirmFirst
            submit={
                <Button
                    size="large"
                    color="norm"
                    type="button"
                    className="w100"
                    loading={loading}
                    onClick={async () => {
                        await withLoading(onResend());
                        rest.onClose?.();
                    }}
                >{c('Action').t`Request new code`}</Button>
            }
            close={
                <Button
                    size="large"
                    color="weak"
                    type="button"
                    onClick={() => {
                        rest.onClose?.();
                        onEdit();
                    }}
                >
                    {verificationModel.method === 'email'
                        ? c('Action').t`Edit email address`
                        : c('Action').t`Edit phone number`}
                </Button>
            }
            {...rest}
        >
            {verificationModel.method === 'email'
                ? c('Info')
                      .jt`Click "Request new code" to have a new verification code sent to ${strong}. If this email address is incorrect, click "Edit" to correct it.`
                : c('Info')
                      .jt`Click "Request new code" to have a new verification code sent to ${strong}. If this phone number is incorrect, click "Edit" to correct it.`}
        </FormModal>
    );
};

export default RequestNewCodeModal;
