import React from 'react';
import { c } from 'ttag';
import { FormModal, Button } from '../../../components';
import { useLoading } from '../../../hooks';

interface Props {
    edit?: string;
    request?: string;
    onEdit: () => void;
    onResend: () => Promise<void>;
    onClose?: () => void;
}

const InvalidVerificationCodeModal = ({
    onEdit,
    onResend,
    edit = c('Action').t`Try another method`,
    request = c('Action').t`Request new code`,
    ...rest
}: Props) => {
    const [loading, withLoading] = useLoading();
    return (
        <FormModal
            loading={loading}
            title={c('Title').t`Invalid verification code`}
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
                >
                    {request}
                </Button>
            }
            close={
                <Button
                    size="large"
                    color="weak"
                    type="button"
                    className="w100"
                    loading={loading}
                    onClick={async () => {
                        rest.onClose?.();
                        onEdit();
                    }}
                >
                    {edit}
                </Button>
            }
            {...rest}
        >
            {c('Info').t`Would you like to receive a new verification code or use an alternative verification method?`}
        </FormModal>
    );
};

export default InvalidVerificationCodeModal;
