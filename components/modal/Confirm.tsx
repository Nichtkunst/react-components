import React, { ReactNode } from 'react';
import { c } from 'ttag';
import FormModal from './FormModal';

export interface ConfirmModalProps {
    onClose?: () => void;
    onConfirm?: () => void;
    title?: string;
    children?: ReactNode;
    cancel?: ReactNode;
    confirm?: ReactNode;
    loading?: boolean;
    small?: boolean;
    tiny?: boolean;
    mode?: 'alert';
}
const Confirm = ({
    onClose,
    onConfirm,
    children,
    title = c('Action').t`Confirm`,
    cancel = c('Action').t`Cancel`,
    confirm = c('Action').t`Confirm`,
    small = false,
    tiny = true,
    ...rest
}: ConfirmModalProps) => {
    return (
        <FormModal
            onClose={onClose}
            onSubmit={() => {
                onConfirm?.();
                onClose?.();
            }}
            title={title}
            close={cancel}
            submit={confirm}
            small={small}
            tiny={tiny}
            {...rest}
        >
            {children}
        </FormModal>
    );
};

export default Confirm;
