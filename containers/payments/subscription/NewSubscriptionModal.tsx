import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    APPS,
    DEFAULT_CURRENCY,
    DEFAULT_CYCLE,
    PAYMENT_METHOD_TYPES,
    PLAN_SERVICES,
} from 'proton-shared/lib/constants';
import { checkSubscription, subscribe, deleteSubscription } from 'proton-shared/lib/api/payments';
import { hasBonuses } from 'proton-shared/lib/helpers/organization';
import { clearPlanIDs, getPlanIDs } from 'proton-shared/lib/helpers/subscription';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { Cycle, Currency, PlanIDs } from 'proton-shared/lib/interfaces';

import { SubscriptionCheckResult } from '../../signup/interfaces';
import { Alert, FormModal } from '../../../components';
import {
    usePlans,
    useApi,
    useLoading,
    useEventManager,
    useUser,
    useNotifications,
    useOrganization,
    useSubscription,
    useModals,
    useConfig,
} from '../../../hooks';
import { classnames } from '../../../helpers';
import LossLoyaltyModal from '../LossLoyaltyModal';
import GenericError from '../../error/GenericError';
import usePayment from '../usePayment';
import Payment from '../Payment';
import PlanSelection from './PlanSelection';
import { SUBSCRIPTION_STEPS } from './constants';
import NewSubscriptionSubmitButton from './NewSubscriptionSubmitButton';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import SubscriptionThanks from './SubscriptionThanks';
import SubscriptionCheckout from './SubscriptionCheckout';
import PaymentGiftCode from '../PaymentGiftCode';
import './NewSubscriptionModal.scss';
import { handlePaymentToken } from '../paymentTokenHelper';
import PlanCustomization from './PlanCustomization';

const hasPlans = (planIDs = {}) => Object.keys(clearPlanIDs(planIDs)).length;

interface Props {
    step?: SUBSCRIPTION_STEPS;
    cycle?: Cycle;
    currency?: Currency;
    planIDs?: PlanIDs;
    onClose?: (e?: any) => void;
    coupon?: string | null;
}

interface Model {
    step: SUBSCRIPTION_STEPS;
    planIDs: PlanIDs;
    currency: Currency;
    cycle: Cycle;
    coupon?: string | null;
    gift?: string;
}

const NewSubscriptionModal = ({
    step = SUBSCRIPTION_STEPS.PLAN_SELECTION,
    cycle = DEFAULT_CYCLE,
    currency = DEFAULT_CURRENCY,
    coupon,
    planIDs = {},
    onClose,
    ...rest
}: Props) => {
    const TITLE = {
        [SUBSCRIPTION_STEPS.NETWORK_ERROR]: c('Title').t`Network error`,
        [SUBSCRIPTION_STEPS.PLAN_SELECTION]: c('Title').t`Select a plan`,
        [SUBSCRIPTION_STEPS.CUSTOMIZATION]: c('Title').t`Customize your plan`,
        [SUBSCRIPTION_STEPS.CHECKOUT]: c('Title').t`Checkout`,
        [SUBSCRIPTION_STEPS.UPGRADE]: <div className="text-center">{c('Title').t`Processing...`}</div>,
        [SUBSCRIPTION_STEPS.THANKS]: <div className="text-center">{c('Title').t`Thank you!`}</div>,
    };

    const api = useApi();
    const { APP_NAME } = useConfig();
    const isVpnApp = APP_NAME === APPS.PROTONVPN_SETTINGS;
    const service = isVpnApp ? PLAN_SERVICES.VPN : PLAN_SERVICES.MAIL;
    const [user] = useUser();
    const [subscription, loadingSubscription] = useSubscription();
    const { call } = useEventManager();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();
    const [plans = [], loadingPlans] = usePlans();
    const [organization, loadingOrganization] = useOrganization();
    const [loading, withLoading] = useLoading();
    const [loadingCheck, withLoadingCheck] = useLoading();
    const [checkResult, setCheckResult] = useState<SubscriptionCheckResult>();
    const { Code: couponCode } = checkResult?.Coupon || {}; // Coupon can be null
    const creditsRemaining = (user.Credit + (checkResult?.Credit || 0)) / 100;
    const [model, setModel] = useState<Model>({
        step,
        cycle,
        currency,
        coupon,
        planIDs,
    });

    const TOTAL_ZERO = {
        Amount: 0,
        AmountDue: 0,
        CouponDiscount: 0,
        Currency: model.currency,
        Cycle: model.cycle,
        Proration: 0,
        Gift: 0,
        Credit: 0,
    } as SubscriptionCheckResult;

    const getCodes = ({ gift, coupon }: Model) => [gift, coupon].filter(isTruthy);

    const handleUnsubscribe = async () => {
        if (hasBonuses(organization)) {
            await new Promise<void>((resolve, reject) => {
                createModal(<LossLoyaltyModal organization={organization} onConfirm={resolve} onClose={reject} />);
            });
        }
        await api(deleteSubscription());
        await call();
        onClose?.();
        createNotification({ text: c('Success').t`You have successfully unsubscribed` });
    };

    const handleSubscribe = async (params = {}) => {
        if (!hasPlans(model.planIDs)) {
            return handleUnsubscribe();
        }

        try {
            setModel({ ...model, step: SUBSCRIPTION_STEPS.UPGRADE });
            await api(
                subscribe({
                    PlanIDs: clearPlanIDs(model.planIDs),
                    Codes: getCodes(model),
                    Cycle: model.cycle,
                    ...params, // Contains Payment, Amount and Currency
                })
            );
            await call();
            setModel({ ...model, step: SUBSCRIPTION_STEPS.THANKS });
        } catch (error) {
            const { Code = 0 } = error.data || {};

            if (Code === API_CUSTOM_ERROR_CODES.PAYMENTS_SUBSCRIPTION_AMOUNT_MISMATCH) {
                await check(); // eslint-disable-line @typescript-eslint/no-use-before-define
                createNotification({ text: c('Error').t`Checkout expired, please try again.`, type: 'error' });
            }
            setModel({ ...model, step: SUBSCRIPTION_STEPS.CHECKOUT });
            throw error;
        }
    };

    const { card, setCard, errors, method, setMethod, parameters, canPay, paypal, paypalCredit } = usePayment({
        amount: model.step === SUBSCRIPTION_STEPS.CHECKOUT ? checkResult?.AmountDue || 0 : 0, // Define amount only in the payment step to generate payment tokens
        currency: checkResult?.Currency || DEFAULT_CURRENCY,
        onPay(params) {
            return withLoading(handleSubscribe(params));
        },
    });

    const check = async (newModel: Model = model, wantToApplyNewGiftCode: boolean = false): Promise<void> => {
        if (!hasPlans(newModel.planIDs)) {
            setCheckResult(TOTAL_ZERO);
            return;
        }

        try {
            const result: SubscriptionCheckResult = await api(
                checkSubscription({
                    PlanIDs: clearPlanIDs(newModel.planIDs),
                    Currency: newModel.currency,
                    Cycle: newModel.cycle,
                    Codes: getCodes(newModel),
                })
            );

            const { Gift = 0 } = result;
            const { Code = '' } = result.Coupon || {}; // Coupon can equal null
            const copyNewModel = { ...newModel };

            if (wantToApplyNewGiftCode && newModel.gift !== Code && !Gift) {
                createNotification({ text: c('Error').t`Invalid code`, type: 'error' });
            }

            copyNewModel.coupon = Code;

            if (!Gift) {
                delete copyNewModel.gift;
            }

            setModel(copyNewModel);
            setCheckResult(result);
        } catch (error) {
            if (error.name === 'OfflineError') {
                setModel({ ...model, step: SUBSCRIPTION_STEPS.NETWORK_ERROR });
            }
            if (model.step === SUBSCRIPTION_STEPS.CUSTOMIZATION) {
                if (newModel.gift && newModel.gift !== model.gift) {
                    return check({ ...model });
                }
                return check({
                    ...model,
                    planIDs: getPlanIDs(subscription),
                });
            }
        }
    };

    const handleCheckout = async () => {
        if (model.step === SUBSCRIPTION_STEPS.CUSTOMIZATION) {
            return setModel({ ...model, step: SUBSCRIPTION_STEPS.CHECKOUT });
        }

        const params = await handlePaymentToken({
            params: {
                Amount: checkResult?.AmountDue || 0,
                Currency: model.currency,
                ...parameters,
            },
            createModal,
            api,
        });

        return handleSubscribe(params);
    };

    const handleClose = (e: any) => {
        debugger;
        if (model.step === SUBSCRIPTION_STEPS.CHECKOUT) {
            setModel({ ...model, step: SUBSCRIPTION_STEPS.CUSTOMIZATION });
            return;
        }

        onClose?.(e);
    };

    const handleGift = (gift = '') => {
        if (!gift) {
            const withoutGift = { ...model };
            delete withoutGift.gift;
            return withLoadingCheck(check(withoutGift));
        }
        void withLoadingCheck(check({ ...model, gift }, true));
    };

    useEffect(() => {
        void withLoadingCheck(check());
    }, [model.cycle, model.currency]);

    return (
        <FormModal
            hasClose={model.step === SUBSCRIPTION_STEPS.CUSTOMIZATION}
            footer={null}
            className={classnames([
                'subscription-modal',
                [
                    SUBSCRIPTION_STEPS.PLAN_SELECTION,
                    SUBSCRIPTION_STEPS.CUSTOMIZATION,
                    SUBSCRIPTION_STEPS.CHECKOUT,
                ].includes(model.step) && 'modal--full',
                user.isFree && 'is-free-user',
            ])}
            title={TITLE[model.step]}
            loading={loading || loadingPlans || loadingOrganization || loadingSubscription}
            onSubmit={() => withLoading(handleCheckout())}
            onClose={handleClose}
            {...rest}
        >
            {model.step === SUBSCRIPTION_STEPS.NETWORK_ERROR && <GenericError />}
            {model.step === SUBSCRIPTION_STEPS.PLAN_SELECTION && (
                <PlanSelection
                    loading={loadingCheck}
                    plans={plans}
                    currency={model.currency}
                    cycle={model.cycle}
                    planIDs={model.planIDs}
                    subscription={subscription}
                    organization={organization}
                    service={service}
                    onChangePlanIDs={(planIDs) =>
                        withLoadingCheck(check({ ...model, planIDs, step: SUBSCRIPTION_STEPS.CUSTOMIZATION }))
                    }
                    onChangeCurrency={(currency) => setModel({ ...model, currency })}
                    onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                />
            )}
            {model.step === SUBSCRIPTION_STEPS.CUSTOMIZATION && (
                <div className="flex flex-justify-space-between on-mobile-flex-column">
                    <div className="w75 on-mobile-w100 pr4 on-tablet-landscape-pr1 on-mobile-pr0">
                        <PlanCustomization
                            plans={plans}
                            loading={loadingCheck}
                            currency={model.currency}
                            cycle={model.cycle}
                            planIDs={model.planIDs}
                            subscription={subscription}
                            organization={organization}
                            service={service}
                            onChangePlanIDs={(planIDs) => withLoadingCheck(check({ ...model, planIDs }))}
                            onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                            onBack={() => setModel({ ...model, step: SUBSCRIPTION_STEPS.PLAN_SELECTION })}
                        />
                    </div>
                    <div className="w25 on-mobile-w100">
                        <div className="subscriptionCheckout-container">
                            <SubscriptionCheckout
                                submit={
                                    <NewSubscriptionSubmitButton
                                        onClose={onClose}
                                        canPay={canPay}
                                        paypal={paypal}
                                        step={model.step}
                                        loading={loadingCheck || loading}
                                        method={method}
                                        checkResult={checkResult}
                                        className="w100"
                                    />
                                }
                                plans={plans}
                                checkResult={checkResult}
                                loading={loadingCheck}
                                currency={model.currency}
                                cycle={model.cycle}
                                planIDs={model.planIDs}
                                gift={model.gift}
                                onChangeCurrency={(currency) => setModel({ ...model, currency })}
                                onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                                onChangeGift={handleGift}
                            />
                        </div>
                    </div>
                </div>
            )}
            {model.step === SUBSCRIPTION_STEPS.CHECKOUT && (
                <div className="flex flex-justify-space-between on-mobile-flex-column">
                    <div className="w75 on-mobile-w100 on-tablet-landscape-pr1 pr4 on-mobile-pr0">
                        <h3>{c('Title').t`Payment method`}</h3>
                        {checkResult?.AmountDue ? (
                            <>
                                <Alert>{c('Info')
                                    .t`You can use any of your saved payment method or add a new one. Please note that depending on the total amount due, some payment options may not be available.`}</Alert>
                                <Payment
                                    type="subscription"
                                    paypal={paypal}
                                    paypalCredit={paypalCredit}
                                    method={method}
                                    amount={checkResult.AmountDue}
                                    currency={checkResult.Currency}
                                    coupon={couponCode}
                                    card={card}
                                    onMethod={setMethod}
                                    onCard={setCard}
                                    errors={errors}
                                />
                                {[PAYMENT_METHOD_TYPES.CASH, PAYMENT_METHOD_TYPES.BITCOIN].includes(
                                    method as PAYMENT_METHOD_TYPES
                                ) ? (
                                    <Alert type="warning">{c('Warning')
                                        .t`Please note that by choosing this payment method, your account cannot be upgraded immediately. We will update your account once the payment is cleared.`}</Alert>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <Alert>{c('Info').t`No payment is required at this time.`}</Alert>
                                {checkResult?.Credit && creditsRemaining ? (
                                    <Alert>{c('Info')
                                        .t`Please note that upon clicking the Confirm button, your account will have ${creditsRemaining} credits remaining.`}</Alert>
                                ) : null}
                            </>
                        )}
                    </div>
                    <div className="w25 on-mobile-w100">
                        <SubscriptionCheckout
                            submit={
                                <NewSubscriptionSubmitButton
                                    onClose={onClose}
                                    canPay={canPay}
                                    paypal={paypal}
                                    step={step}
                                    loading={loadingCheck || loading}
                                    method={method}
                                    checkResult={checkResult}
                                    className="w100"
                                />
                            }
                            plans={plans}
                            checkResult={checkResult}
                            loading={loadingCheck}
                            currency={model.currency}
                            cycle={model.cycle}
                            planIDs={model.planIDs}
                            gift={model.gift}
                            onChangeCurrency={(currency) => setModel({ ...model, currency })}
                            onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                            onChangeGift={handleGift}
                        />
                        {checkResult?.Amount ? (
                            <PaymentGiftCode gift={model.gift} onApply={handleGift} loading={loadingCheck} />
                        ) : null}
                    </div>
                </div>
            )}
            {model.step === SUBSCRIPTION_STEPS.UPGRADE && (
                <div className="text-center">
                    <SubscriptionUpgrade />
                </div>
            )}
            {model.step === SUBSCRIPTION_STEPS.THANKS && <SubscriptionThanks method={method} onClose={onClose} />}
        </FormModal>
    );
};

export default NewSubscriptionModal;
