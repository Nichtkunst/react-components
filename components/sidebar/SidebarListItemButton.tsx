import React, { useRef } from 'react';
import { classnames } from '../../helpers';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onFocus: () => void;
}

const SidebarListItemButton = ({ children, className, onFocus, ...rest }: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <button
            ref={buttonRef}
            onFocus={onFocus}
            className={classnames(['navigation-link w100 text-left', className])}
            type="button"
            {...rest}
        >
            {children}
        </button>
    );
};

export default SidebarListItemButton;
