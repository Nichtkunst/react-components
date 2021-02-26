import React from 'react';
import { c } from 'ttag';
import { Currency, Cycle } from 'proton-shared/lib/interfaces';
import { CYCLE } from 'proton-shared/lib/constants';

import { Icon } from '../../components';
import CycleSelector from './CycleSelector';
import CurrencySelector from './CurrencySelector';

interface Props {
    cycle: Cycle;
    currency: Currency;
    onChangeCycle: (newCycle: Cycle) => void;
    onChangeCurrency: (newCurrency: Currency) => void;
    hideCycle?: boolean;
    hideCurrency?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

const Checkout = ({
    cycle,
    currency,
    onChangeCycle,
    onChangeCurrency,
    hideCurrency,
    hideCycle,
    loading,
    children,
}: Props) => {
    return (
        <div className="p2 bg-global-highlight">
            <div className="flex flex-nowrap cycle-currency-selectors mb1">
                {hideCycle ? null : (
                    <CycleSelector
                        cycle={cycle}
                        onSelect={onChangeCycle}
                        className="mr1 flex-item-fluid"
                        disabled={loading}
                        options={[
                            { text: c('Billing cycle option').t`Monthly`, value: CYCLE.MONTHLY },
                            { text: c('Billing cycle option').t`Annually SAVE 20%`, value: CYCLE.YEARLY },
                            { text: c('Billing cycle option').t`Two years SAVE 33%`, value: CYCLE.TWO_YEARS },
                        ]}
                    />
                )}
                {hideCurrency ? null : (
                    <CurrencySelector
                        currency={currency}
                        onSelect={onChangeCurrency}
                        className="flex-item-fluid"
                        disabled={loading}
                    />
                )}
            </div>
            <h2 className="h4 text-bold">{c('Title').t`Plan summary`}</h2>
            <div className={loading ? 'opacity-50' : ''}>{children}</div>
            <p className="text-sm lh-standard flex flex-nowrap opacity-50">
                <span className="flex-item-noshrink mr0-5">
                    <Icon name="security" />
                </span>
                <span className="flex-item-fluid">{c('Info')
                    .t`Payments are protected with TLS encryptionand Swiss privacy laws.`}</span>
            </p>
            <p className="text-sm flex flex-nowrap opacity-50">
                <span className="flex-item-noshrink mr0-5">
                    <Icon name="clock" />
                </span>
                <span className="flex-item-fluid">{c('Info').t`30 days money-back guarantee.`}</span>
            </p>
        </div>
    );
};

export default Checkout;
