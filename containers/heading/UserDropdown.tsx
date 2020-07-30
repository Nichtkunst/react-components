import React, { useState } from 'react';
import { c } from 'ttag';
import { APPS, isSSOMode, SSO_PATHS } from 'proton-shared/lib/constants';
import { getAccountSettingsApp, getAppHref } from 'proton-shared/lib/apps/helper';
import { requestFork } from 'proton-shared/lib/authentication/sessionForking';
import { FORK_TYPE } from 'proton-shared/lib/authentication/ForkInterface';
import { useAuthentication, useConfig, useModals, useUser, useLoading } from '../../hooks';
import { usePopperAnchor, Dropdown, Icon, Toggle, PrimaryButton } from '../../components';
import { ToggleState } from '../../components/toggle/Toggle';
import UserDropdownButton from './UserDropdownButton';
import AppLink from '../../components/link/AppLink';
import { generateUID } from '../../helpers';
import { DonateModal } from '../payments';

enum Theme {
    Normal,
    Dark,
}

const UserDropdown = ({ ...rest }) => {
    const { APP_NAME } = useConfig();
    const [user] = useUser();
    const { logout } = useAuthentication();
    const { createModal } = useModals();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();
    const [theme, setTheme] = useState(Theme.Normal);
    const [loading, withLoading] = useLoading();

    const handleSupportUsClick = () => {
        createModal(<DonateModal />);
        close();
    };

    const handleSwitchAccount = () => {
        if (APP_NAME === APPS.PROTONACCOUNT) {
            const href = getAppHref(SSO_PATHS.SWITCH, APPS.PROTONACCOUNT);
            return document.location.assign(href);
        }
        return requestFork(APP_NAME, undefined, FORK_TYPE.SWITCH);
    };

    const handleLogout = () => {
        logout();
        close();
    };

    const handleThemeToggle = async () => {
        const newTheme = theme === Theme.Normal ? Theme.Dark : Theme.Normal;
        // TODO Add API call
        setTheme(newTheme);
    };

    return (
        <div className="flex" data-cy-header="userDropdown">
            <UserDropdownButton {...rest} user={user} buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} />
            <Dropdown
                id={uid}
                className="userDropdown"
                isOpen={isOpen}
                noMaxSize
                anchorRef={anchorRef}
                autoClose={false}
                onClose={close}
                originalPlacement="bottom-right"
            >
                <ul className="unstyled mt0 mb0">
                    {APP_NAME === APPS.PROTONVPN_SETTINGS || APP_NAME === APPS.PROTONACCOUNT ? null : (
                        <li className="dropDown-item">
                            <AppLink
                                className="w100 flex flex-nowrap dropDown-item-link nodecoration pl1 pr1 pt0-5 pb0-5"
                                to="/"
                                toApp={getAccountSettingsApp()}
                            >
                                <Icon className="mt0-25 mr0-5" name="settings-master" />
                                {c('Action').t`Account settings`}
                            </AppLink>
                        </li>
                    )}
                    <li>
                        <a
                            className="w100 flex flex-nowrap dropDown-item-link nodecoration pl1 pr1 pt0-5 pb0-5"
                            href="https://shop.protonmail.com"
                            // eslint-disable-next-line react/jsx-no-target-blank
                            target="_blank"
                        >
                            <Icon className="mt0-25 mr0-5" name="shop" />
                            {c('Action').t`Proton shop`}
                        </a>
                    </li>
                    <li className="dropDown-item">
                        <button
                            type="button"
                            className="w100 flex underline-hover dropDown-item-link pl1 pr1 pt0-5 pb0-5 alignleft"
                            onClick={handleSupportUsClick}
                        >
                            <Icon className="mt0-25 mr0-5" name="donate" />
                            {c('Action').t`Support us`}
                        </button>
                    </li>
                    {isSSOMode ? (
                        <li className="dropDown-item">
                            <button
                                type="button"
                                className="w100 flex underline-hover dropDown-item-link pl1 pr1 pt0-5 pb0-5 alignleft"
                                onClick={handleSwitchAccount}
                            >
                                <Icon className="mt0-25 mr0-5" name="organization-users" />
                                {c('Action').t`Switch account`}
                            </button>
                        </li>
                    ) : null}
                    <li className="dropDown-item">
                        <div className="pl1 pr1 pt0-5 pb0-5 w100 flex flex-nowrap flex-spacebetween flex-items-center">
                            <label htmlFor="theme-toggle" className="mr1">{c('Action').t`Display mode`}</label>
                            <Toggle
                                id="theme-toggle"
                                checked={theme === Theme.Dark}
                                loading={loading}
                                onChange={() => withLoading(handleThemeToggle())}
                                label={(key: ToggleState) => {
                                    const alt =
                                        key === ToggleState.on
                                            ? c('Toggle button').t`Normal`
                                            : c('Toggle button').t`Dark`;
                                    return (
                                        <span className="pm-toggle-label-text">
                                            <Icon
                                                name={key === ToggleState.on ? 'crescent-moon' : 'half-moon'}
                                                alt={alt}
                                                className="pm-toggle-label-img"
                                            />
                                        </span>
                                    );
                                }}
                            />
                        </div>
                    </li>
                    <li className="dropDown-item pt0-5 pb0-5 pl1 pr1 flex">
                        <PrimaryButton
                            className="w100 aligncenter navigationUser-logout"
                            onClick={handleLogout}
                            data-cy-header-user-dropdown="logout"
                        >
                            {c('Action').t`Logout`}
                        </PrimaryButton>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default UserDropdown;
