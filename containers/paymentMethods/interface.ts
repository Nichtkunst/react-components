import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';

export interface PaymentMethodData {
    icon: string;
    value: PAYMENT_METHOD_TYPES | string;
    text: string;
    disabled?: boolean;
}
export type PaymentMethodFlows = 'invoice' | 'signup' | 'human-verification' | 'credit' | 'donation' | 'subscription';
