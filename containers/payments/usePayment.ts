import { useState, useEffect } from 'react';
import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';

import { useCard, usePayPal } from '../../index';
import toDetails from './toDetails';

const { CARD, BITCOIN, CASH, PAYPAL, PAYPAL_CREDIT } = PAYMENT_METHOD_TYPES;

interface Props {
    amount: number;
    currency: string;
    onPay: (data: PaymentParameters) => void;
}

interface TokenPaymentDetails {
    Token: string;
}

interface CardPaymentDetails {
    Name: string;
    Number: string;
    ExpMonth: string;
    ExpYear: string;
    CVC: string;
    ZIP: string;
    Country: string;
}

export interface Payment {
    Type: PAYMENT_METHOD_TYPES;
    Details: TokenPaymentDetails | CardPaymentDetails;
}

export interface PaymentParameters {
    PaymentMethodID?: string;
    Payment?: Payment;
}

const usePayment = ({ amount, currency, onPay }: Props) => {
    const { card, setCard, errors, isValid } = useCard();
    const [method, setMethod] = useState<PAYMENT_METHOD_TYPES | undefined>();
    const [parameters, setParameters] = useState<PaymentParameters>({});
    const isPayPalActive = method === PAYPAL;

    const paypal = usePayPal({
        amount,
        currency,
        type: PAYPAL,
        onPay,
        isActive: isPayPalActive
    });

    const paypalCredit = usePayPal({
        amount,
        currency,
        type: PAYPAL_CREDIT,
        onPay,
        isActive: isPayPalActive
    });

    const hasToken = (): boolean => {
        const { Payment } = parameters;
        const { Details } = Payment || {};
        const { Token = '' } = (Details as any) || {};
        return !!Token;
    };

    const canPay = () => {
        if (!amount) {
            // Amount equals 0
            return true;
        }

        if (!method) {
            return false;
        }

        if ([BITCOIN, CASH].includes(method)) {
            return false;
        }

        if (method === CARD && !isValid) {
            return false;
        }

        if (method === PAYPAL && !hasToken()) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        if (!method) {
            return;
        }

        if (![CARD, PAYPAL, CASH, BITCOIN].includes(method)) {
            setParameters({ PaymentMethodID: method });
        }

        if (method === CARD) {
            setParameters({ Payment: { Type: CARD, Details: toDetails(card) } });
        }

        // Reset parameters when switching methods
        if ([PAYPAL, CASH, BITCOIN].includes(method)) {
            setParameters({});
        }
    }, [method, card]);

    useEffect(() => {
        paypal.clear();
        paypalCredit.clear();
        if (isPayPalActive && amount) {
            paypal.onToken().then(() => paypalCredit.onToken());
        }
    }, [isPayPalActive, amount, currency]);

    return {
        paypal,
        paypalCredit,
        card,
        setCard,
        errors,
        method,
        setMethod,
        parameters,
        setParameters,
        canPay: canPay()
    };
};

export default usePayment;
