import React from 'react';
import { CURRENCIES, DEFAULT_CURRENCY } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import { Select, Group, ButtonGroup } from '../../components';
import { classnames } from '../../helpers';
import { Currency } from './interface';

const addSymbol = (currency: Currency) => {
    if (currency === 'EUR') {
        return `€ ${currency}`;
    }

    if (currency === 'USD') {
        return `$ ${currency}`;
    }

    return currency;
};

interface Props {
    mode?: 'buttons' | 'select';
    currency: Currency;
    onSelect: (currency: Currency) => void;
}

const CurrencySelector = ({ currency = DEFAULT_CURRENCY, onSelect, mode = 'select', ...rest }: Props) => {
    const options = CURRENCIES.map<{ text: Currency; value: Currency }>((c) => ({ text: c, value: c }));

    if (mode === 'buttons') {
        return (
            <Group {...rest}>
                {options.map(({ text, value }) => {
                    return (
                        <ButtonGroup
                            className={classnames([currency === value && 'is-active'])}
                            key={value}
                            onClick={() => onSelect(value)}
                        >
                            {text}
                        </ButtonGroup>
                    );
                })}
            </Group>
        );
    }

    if (mode === 'select') {
        return (
            <Select
                title={c('Title').t`Currency`}
                value={currency}
                options={options.map((option) => ({ ...option, text: addSymbol(option.text) }))}
                onChange={({ target }) => {
                    onSelect(target.value as Currency);
                }}
                {...rest}
            />
        );
    }

    return null;
};

export default CurrencySelector;
