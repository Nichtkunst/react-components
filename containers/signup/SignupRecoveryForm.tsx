import React, { useRef, ChangeEvent, FormEvent } from 'react';
import { c } from 'ttag';
import {
    Alert,
    EmailInput,
    LinkButton,
    PrimaryButton,
    IntlTelInput,
    useModals,
    ConfirmModal,
    Challenge,
    Label,
    useLoading
} from 'react-components';

import { SignupModel, SignupErros } from './interfaces';
import { SIGNUP_STEPS } from './constants';
import InlineLinkButton from '../../components/button/InlineLinkButton';

interface Props {
    model: SignupModel;
    onChange: (model: SignupModel) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    errors: SignupErros;
    loading: boolean;
}

const { RECOVERY_EMAIL, RECOVERY_PHONE, PLANS } = SIGNUP_STEPS;

const SignupRecoveryForm = ({ model, onChange, onSubmit, errors, loading }: Props) => {
    const formRef = useRef();
    const { createModal } = useModals();
    const challengeRefRecovery = useRef();
    const [loadingChallenge, withLoadingChallenge] = useLoading();
    const disableSubmit = model.step === RECOVERY_EMAIL ? !!errors.recoveryEmail : !!errors.recoveryPhone;

    const handleChangePhone = (status: any, value: any, countryData: any, number: string) => {
        onChange({ ...model, recoveryPhone: number });
    };

    const handleSkip = async () => {
        await new Promise((resolve, reject) => {
            createModal(
                <ConfirmModal title={c('Title').t`Warning`} onConfirm={resolve} onClose={reject}>
                    <Alert type="warning">{c('Info')
                        .t`You did not set a recovery email so account recovery is impossible if you forget your password. Proceed without recovery email?`}</Alert>
                </ConfirmModal>
            );
        });
        const payload = await challengeRefRecovery.current?.getChallenge();
        onChange({
            ...model,
            step: PLANS,
            payload: payload
                ? {
                      ...model.payload,
                      payload
                  }
                : model.payload
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = await challengeRefRecovery.current?.getChallenge();
        payload &&
            onChange({
                ...model,
                payload: {
                    ...model.payload,
                    payload
                }
            });
        onSubmit(e);
    };

    return (
        <form
            name="recoveryForm"
            className="signup-form"
            onSubmit={(e) => withLoadingChallenge(handleSubmit(e))}
            ref={formRef}
        >
            <p>{c('Info')
                .t`Proton will send you a recovery link to this email address if you forget your password or get locked out of your account.`}</p>
            {model.step === RECOVERY_EMAIL ? (
                <>
                    <div className="flex onmobile-flex-column signup-label-field-container mb1">
                        <Label htmlFor="recovery-email">{c('Label').t`Recovery email`}</Label>
                        <div className="flex-item-fluid">
                            <Challenge challengeRef={challengeRefRecovery} type="1">
                                <div className="mb0-5">
                                    <EmailInput
                                        id="recovery-email"
                                        name="recovery-email"
                                        autoFocus
                                        autoComplete="on"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                        value={model.recoveryEmail}
                                        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                                            onChange({ ...model, recoveryEmail: target.value })
                                        }
                                        onKeyDown={({ keyCode }: React.KeyboardEvent<HTMLInputElement>) =>
                                            keyCode === 13 && formRef.current?.submit()
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <InlineLinkButton
                                        id="recovery-phone-button"
                                        onClick={() => onChange({ ...model, recoveryEmail: '', step: RECOVERY_PHONE })}
                                    >{c('Action').t`Add a recovery phone number instead`}</InlineLinkButton>
                                </div>
                            </Challenge>
                        </div>
                    </div>
                </>
            ) : null}
            {model.step === RECOVERY_PHONE ? (
                <>
                    <div className="flex onmobile-flex-column signup-label-field-container mb1">
                        <Label htmlFor="recovery-phone">{c('Label').t`Recovery phone`}</Label>
                        <div className="flex-item-fluid">
                            <div className="mb0-5">
                                <IntlTelInput
                                    id="recovery-phone"
                                    name="recovery-phone"
                                    containerClassName="w100"
                                    inputClassName="w100"
                                    autoFocus
                                    onPhoneNumberChange={handleChangePhone}
                                    onPhoneNumberBlur={handleChangePhone}
                                    required
                                />
                            </div>
                            <div>
                                <InlineLinkButton
                                    onClick={() => onChange({ ...model, recoveryPhone: '', step: RECOVERY_EMAIL })}
                                >{c('Action').t`Add an email address instead`}</InlineLinkButton>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            <div className="alignright mb1">
                <LinkButton
                    className="mr2 pm-button--large nodecoration"
                    disabled={loading || loadingChallenge}
                    onClick={handleSkip}
                >{c('Action').t`Skip`}</LinkButton>
                <PrimaryButton
                    className="pm-button--large"
                    loading={loading || loadingChallenge}
                    disabled={disableSubmit}
                    type="submit"
                >{c('Action').t`Next`}</PrimaryButton>
            </div>
        </form>
    );
};

export default SignupRecoveryForm;