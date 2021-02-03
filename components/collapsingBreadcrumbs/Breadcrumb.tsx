import React, { Ref } from 'react';
import { classnames } from '../../helpers';

interface Props extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
    children: string;
    active?: boolean;
    noShrink?: boolean;
    onClick?: () => void;
}

const Breadcrumb = ({ children, onClick, active, noShrink, className, ...rest }: Props, ref: Ref<HTMLLIElement>) => {
    const textClass = classnames(['pre p0-25 m0 ellipsis no-pointer-events-children', active && 'strong']);
    return (
        <li
            {...rest}
            ref={ref}
            className={classnames([
                'collapsing-breadcrumb',
                active && 'flex-item-fluid-auto',
                noShrink && 'collapsing-breadcrumb--no-shrink',
                className,
            ])}
        >
            {onClick ? (
                <button type="button" title={children} onClick={onClick} className={textClass}>
                    {children}
                </button>
            ) : (
                <span title={children} className={textClass}>
                    {children}
                </span>
            )}
        </li>
    );
};

export default React.forwardRef<HTMLLIElement, Props>(Breadcrumb);
