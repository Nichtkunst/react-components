import React, { useEffect } from 'react';
import { c } from 'ttag';
import {
    PAYMENT_METHOD_TYPES,
    MIN_DONATION_AMOUNT,
    MIN_CREDIT_AMOUNT,
    DEFAULT_CURRENCY,
} from 'proton-shared/lib/constants';

import { Row, Alert, Price, Loader } from '../../components';
import { useMethods } from '../paymentMethods';
import PaymentMethodSelector from '../paymentMethods/PaymentMethodSelector';
import Card from './Card';
import Cash from './Cash';
import Bitcoin from './Bitcoin';
import PayPalView from './PayPalView';
import PaymentMethodDetails from '../paymentMethods/PaymentMethodDetails';
import Alert3DS from './Alert3DS';
import { PaymentMethodFlows } from '../paymentMethods/interface';
import { Currency } from './interface';

interface Props {
    children?: React.ReactNode;
    type: PaymentMethodFlows;
    amount?: number;
    currency?: Currency;
    coupon?: string;
    method: any;
    onMethod: (value: PAYMENT_METHOD_TYPES | string) => void;
    paypal: any;
    paypalCredit: any;
    card: any;
    onCard: (key: string, value: string) => void;
    errors: any;
}

const Payment = ({
    children,
    type,
    amount = 0,
    currency = DEFAULT_CURRENCY,
    coupon = '',
    paypal,
    paypalCredit,
    method,
    onMethod,
    card,
    onCard,
    errors,
}: Props) => {
    const { methods, options, loading } = useMethods({ amount, coupon, type });
    const lastCustomMethod = [...options]
        .reverse()
        .find(
            ({ value }) =>
                ![
                    PAYMENT_METHOD_TYPES.CARD,
                    PAYMENT_METHOD_TYPES.PAYPAL,
                    PAYMENT_METHOD_TYPES.CASH,
                    PAYMENT_METHOD_TYPES.BITCOIN,
                ].includes(value as any)
        );

    useEffect(() => {
        const result = options.find(({ disabled }) => !disabled);
        if (result) {
            onMethod(result.value);
        }
    }, [options.length]);

    if (['donation', 'human-verification'].includes(type) && amount < MIN_DONATION_AMOUNT) {
        const price = (
            <Price key="price" currency={currency}>
                {MIN_DONATION_AMOUNT}
            </Price>
        );
        return <Alert type="error">{c('Error').jt`The minimum amount that can be donated is ${price}`}</Alert>;
    }

    if (type === 'credit' && amount < MIN_CREDIT_AMOUNT) {
        const price = (
            <Price key="price" currency={currency}>
                {MIN_CREDIT_AMOUNT}
            </Price>
        );
        return <Alert type="error">{c('Error').jt`The minimum amount of credit that can be added is ${price}`}</Alert>;
    }

    if (amount <= 0) {
        const price = (
            <Price key="price" currency={currency}>
                {0}
            </Price>
        );
        return <Alert type="error">{c('Error').jt`The minimum payment we accept is ${price}`}</Alert>;
    }

    if (loading) {
        return <Loader />;
    }

    const customPaymentMethod = methods.find(({ ID }) => method === ID);

    return (
        <>
            <Row className="payment-container">
                <div className="label payment-left mr1 on-mobile-mr0">
                    <label className="mb0-5 block">{c('Label').t`Select a method`}</label>
                    <PaymentMethodSelector
                        options={options}
                        method={method}
                        onChange={(value) => onMethod(value)}
                        lastCustomMethod={lastCustomMethod}
                    />
                </div>
                <div className="payment-right mr0-25">
                    <div className="max-w37e on-mobile-max-w100">
                        {method === PAYMENT_METHOD_TYPES.CARD && (
                            <>
                                <Card card={card} errors={errors} onChange={onCard} />
                                <Alert3DS />
                            </>
                        )}
                        {method === PAYMENT_METHOD_TYPES.CASH && <Cash />}
                        {method === PAYMENT_METHOD_TYPES.BITCOIN && (
                            <Bitcoin amount={amount} currency={currency} type={type} />
                        )}
                        {method === PAYMENT_METHOD_TYPES.PAYPAL && (
                            <PayPalView
                                paypal={paypal}
                                paypalCredit={paypalCredit}
                                amount={amount}
                                currency={currency}
                                type={type}
                            />
                        )}
                        {customPaymentMethod && (
                            <>
                                <PaymentMethodDetails
                                    type={customPaymentMethod.Type}
                                    details={customPaymentMethod.Details}
                                />
                                {customPaymentMethod.Type === PAYMENT_METHOD_TYPES.CARD ? <Alert3DS /> : null}
                            </>
                        )}
                        {children}
                    </div>
                </div>
            </Row>
        </>
    );
};

export default Payment;
