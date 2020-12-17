import React, { useRef, useEffect } from 'react';
import Icon from '../icon/Icon';
import { classnames } from '../../helpers';
import SidebarListItem from './SidebarListItem';
import { HotkeyTuple, useHotkeys } from '../../hooks';

interface Props {
    toggle: boolean;
    onToggle: (display: boolean) => void;
    hasCaret?: boolean;
    right?: React.ReactNode;
    text: string;
    title?: string;
    onFocus: () => void;
    isFocused: boolean;
}

const SimpleSidebarListItemHeader = ({
    toggle,
    onToggle,
    hasCaret = true,
    right,
    text,
    title,
    onFocus,
    isFocused,
}: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const handlersRef = useRef<HotkeyTuple[]>([]);

    handlersRef.current = [
        [
            'ArrowRight',
            (e) => {
                e.stopPropagation();
                onToggle(true);
            },
        ],
        [
            'ArrowLeft',
            () => {
                onToggle(false);
            },
        ],
    ];

    useHotkeys(buttonRef, handlersRef.current);

    useEffect(() => {
        if (isFocused) {
            buttonRef.current?.focus();
            buttonRef.current?.scrollIntoView({ block: 'nearest' });
        }
    }, [isFocused]);

    return (
        <SidebarListItem className="navigation__link--groupHeader">
            <div className="flex flex-nowrap">
                <button
                    ref={buttonRef}
                    className="uppercase flex-item-fluid alignleft navigation__link--groupHeader-link"
                    type="button"
                    onClick={() => onToggle(!toggle)}
                    title={title}
                    aria-expanded={toggle}
                    onFocus={onFocus}
                >
                    <span className="mr0-5 small">{text}</span>
                    {hasCaret && (
                        <Icon
                            name="caret"
                            className={classnames(['navigation__icon--expand', toggle && 'rotateX-180'])}
                        />
                    )}
                </button>
                {right}
            </div>
        </SidebarListItem>
    );
};

export default SimpleSidebarListItemHeader;
