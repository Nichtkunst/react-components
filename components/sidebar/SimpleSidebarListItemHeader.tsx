import { noop } from 'proton-shared/lib/helpers/function';
import React, { useRef } from 'react';
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
    onFocus?: () => void;
    id?: string;
}

const SimpleSidebarListItemHeader = ({
    toggle,
    onToggle,
    hasCaret = true,
    right,
    text,
    id,
    title,
    onFocus = noop,
}: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const shortcutHandlers: HotkeyTuple[] = [
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

    useHotkeys(buttonRef, shortcutHandlers);

    return (
        <SidebarListItem className="navigation-link-header-group">
            <div className="flex flex-nowrap">
                <button
                    ref={buttonRef}
                    className="uppercase flex-item-fluid alignleft navigation-link-header-group-link"
                    type="button"
                    onClick={() => onToggle(!toggle)}
                    title={title}
                    aria-expanded={toggle}
                    onFocus={onFocus}
                    data-shortcut-target={id}
                >
                    <span className="mr0-5 small">{text}</span>
                    {hasCaret && (
                        <Icon
                            name="caret"
                            className={classnames(['navigation-icon--expand', toggle && 'rotateX-180'])}
                        />
                    )}
                </button>
                {right}
            </div>
        </SidebarListItem>
    );
};

export default SimpleSidebarListItemHeader;
