import { PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';

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

export interface PaymentMethodResult {
    ID: string;
    Order: number;
    Type: PAYMENT_METHOD_TYPES;
    Details: TokenPaymentDetails | CardPaymentDetails;
}

export interface Payment {
    Type: PAYMENT_METHOD_TYPES;
    Details: TokenPaymentDetails | CardPaymentDetails;
}

export interface PaymentParameters {
    PaymentMethodID?: string;
    Payment?: Payment;
}

export interface Params extends PaymentParameters {
    Amount: number;
    Currency: string;
}

export interface CardModel {
    fullname: string;
    number: string;
    month: string;
    year: string;
    cvc: string;
    zip: string;
    country: string;
}

export type Currency = 'EUR' | 'CHF' | 'USD';
