import React from 'react';
import { c } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';
import { PlanIDs, Cycle, Currency, Subscription, Plan } from 'proton-shared/lib/interfaces';
import { isProductPayer } from 'proton-shared/lib/helpers/blackfriday';

import { useModals, useConfig, useCyberMondayPeriod } from '../../hooks';
import { Icon } from '../../components';
import NewSubscriptionModal from '../payments/subscription/NewSubscriptionModal';
import VPNBlackFridayModal from '../payments/subscription/VPNBlackFridayModal';
import MailBlackFridayModal from '../payments/subscription/MailBlackFridayModal';
import { SUBSCRIPTION_STEPS } from '../payments/subscription/constants';

interface Props {
    plans: Plan[];
    subscription: Subscription;
}

const BlackFridayButton = ({ plans, subscription }: Props) => {
    const { APP_NAME } = useConfig();
    const { createModal } = useModals();
    const icon = 'blackfriday';
    const cyberModay = useCyberMondayPeriod();
    const text = isProductPayer(subscription)
        ? c('blackfriday Promo title, need to be short').t`Special offer`
        : cyberModay
        ? 'Cyber Monday'
        : 'Black Friday';

    const onSelect = ({
        planIDs,
        cycle,
        currency,
        couponCode,
    }: {
        planIDs: PlanIDs;
        cycle: Cycle;
        currency: Currency;
        couponCode?: string | null;
    }) => {
        createModal(
            <NewSubscriptionModal
                planIDs={planIDs}
                cycle={cycle}
                currency={currency}
                coupon={couponCode}
                step={SUBSCRIPTION_STEPS.PAYMENT}
            />
        );
    };

    // span is required because TopNavbarItem erase className prop
    return (
        <span>
            <button
                type="button"
                className="TODO"
                onClick={() => {
                    if (APP_NAME === APPS.PROTONVPN_SETTINGS) {
                        createModal(
                            <VPNBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />
                        );
                        return;
                    }
                    createModal(<MailBlackFridayModal plans={plans} subscription={subscription} onSelect={onSelect} />);
                }}
            >
                <Icon className="topnav-icon mr0-5 flex-item-centered-vert" name={icon} />
                <span className="navigation-title topnav-linkText">{text}</span>
            </button>
        </span>
    );
};

export default BlackFridayButton;
