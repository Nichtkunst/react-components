import React, { useState } from 'react';
import { c } from 'ttag';
import { getStatus, request, Status, create } from 'proton-shared/lib/helpers/desktopNotification';
import { APP_NAMES, APPS } from 'proton-shared/lib/constants';
import { getAppName } from 'proton-shared/lib/apps/helper';

import TopBanner from './TopBanner';
import { useLocalState, useConfig } from '../../hooks';

const DeskopNotificationTopBanner = () => {
    const [status, setStatus] = useState<Status>(getStatus());
    const [dontAsk, setDontAsk] = useLocalState(false, 'dont-ask-desktop-notification');
    const { APP_NAME } = useConfig();
    const appName = getAppName(APP_NAME);

    if (!([APPS.PROTONMAIL, APPS.PROTONCALENDAR] as APP_NAMES[]).includes(APP_NAME)) {
        return null;
    }

    if (dontAsk) {
        return null;
    }

    if ([Status.GRANTED, Status.DENIED].includes(status)) {
        return null;
    }

    const handleEnable = () => {
        request(
            () => {
                setStatus(getStatus());
                create(c('Info').t`Desktop notification example`, {
                    body: c('Info').t`This is a ${appName} desktop notification`,
                    icon: '/assets/img/notification-badge.gif',
                    onClick() {
                        window.focus();
                    },
                });
            },
            () => setStatus(getStatus())
        );
    };

    const enableDesktopNotifications = (
        <button
            key="enable-desktop-notifications"
            className="link align-baseline text-left color-currentColor"
            type="button"
            onClick={handleEnable}
        >{c('Action').t`enable desktop notifications`}</button>
    );

    return (
        <TopBanner onClose={() => setDontAsk(true)} className="bg-pm-blue">{c('Info')
            .jt`${appName} needs your permission to ${enableDesktopNotifications}.`}</TopBanner>
    );
};

export default DeskopNotificationTopBanner;
