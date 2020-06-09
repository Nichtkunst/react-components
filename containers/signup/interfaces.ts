import { SIGNUP_STEPS } from './constants';
import { TOKEN_TYPES } from 'proton-shared/lib/constants';

export interface PlanIDs {
    [planID: string]: number;
}

export interface SubscriptionCheckResult {
    Amount: number;
    AmountDue: number;
    Proration: number;
    Credit: number;
    Currency: string;
    Cycle: number;
    Gift: number;
    CouponDiscount: number;
    Coupon: null | {
        Code: string;
        Description: string;
    };
}

interface Payload {
    [id: string]: string;
}

export interface SignupModel {
    step: SIGNUP_STEPS;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    verifyMethods: string[];
    domains: string[];
    recoveryEmail: string;
    recoveryPhone: string;
    verificationCode: string;
    currency: string;
    cycle: number;
    planIDs: PlanIDs;
    humanVerificationMethods: string[];
    humanVerificationToken: string;
    verificationToken?: string;
    verificationTokenType?: TOKEN_TYPES;
    emailToken?: string;
    payload?: Payload;
    hasPaymentToken: boolean;
}

export interface SignupErros {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    recoveryEmail?: string;
    recoveryPhone?: string;
    verificationCode?: string;
}

export interface SignupPlanPricing {
    [cycle: number]: number;
}

export interface SignupPlan {
    ID: string;
    Name: string;
    Type: number;
    Title: string;
    Currency: string;
    Amount: number;
    Quantity: number;
    Cycle: number;
    Services: number;
    Features: number;
    Pricing: SignupPlanPricing;
}

export interface SignupPayPal {
    isReady: boolean;
    loadingToken: boolean;
    loadingVerification: boolean;
    onToken: () => void;
    onVerification: () => void;
}