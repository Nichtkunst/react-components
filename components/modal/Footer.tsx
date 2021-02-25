import React from 'react';
import { classnames } from '../../helpers';

interface Props extends React.ComponentPropsWithoutRef<'footer'> {
    children?: React.ReactNode;
    hasConfirmFirst?: boolean;
}

const Footer = ({
    children,
    hasConfirmFirst,
    className = classnames([
        'flex flex-nowrap',
        hasConfirmFirst ? 'flex-column' : 'flex-justify-space-between flex-align-items-center',
    ]),
    ...rest
}: Props) => {
    return (
        <footer className={classnames(['modal-footer', className])} {...rest}>
            {children}
        </footer>
    );
};

export default Footer;
