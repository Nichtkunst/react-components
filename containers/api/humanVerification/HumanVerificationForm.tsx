import React, { useState } from 'react';
import { c } from 'ttag';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { HumanVerificationMethodType } from 'proton-shared/lib/interfaces';

import { Alert, LearnMore, Tabs } from '../../../components';
import Captcha from './Captcha';
import CodeVerification from './CodeVerification';
import RequestInvite from './RequestInvite';

interface Props {
    onSubmit: (token: string, tokenType: HumanVerificationMethodType) => void;
    token: string;
    mode?: 'signup' | undefined;
    methods: HumanVerificationMethodType[];
    defaultEmail?: string;
    defaultPhone?: string;
}

const HumanVerificationForm = ({ defaultEmail, defaultPhone, methods, mode, token, onSubmit }: Props) => {
    const tabs = [
        methods.includes('captcha') && {
            method: 'captcha',
            title: c('Human verification method').t`CAPTCHA`,
            content: (
                <>
                    <p>{c('Info').t`To fight spam and abuse, please verify you are human.`}</p>
                    <Captcha token={token} onSubmit={(token) => onSubmit(token, 'captcha')} />
                </>
            ),
        },
        methods.includes('email') && {
            method: 'email',
            title: c('Human verification method').t`Email`,
            content: (
                <>
                    <p>
                        <span>{c('Info').t`Your email will only be used for this one-time verification.`}</span>
                        <LearnMore url="https://protonmail.com/support/knowledge-base/human-verification/" />
                    </p>
                    <CodeVerification
                        email={defaultEmail}
                        mode={mode}
                        onSubmit={(token) => onSubmit(token, 'email')}
                        method="email"
                    />
                </>
            ),
        },
        methods.includes('sms') && {
            method: 'sms',
            title: c('Human verification method').t`SMS`,
            content: (
                <>
                    <p>
                        <span>{c('Info').t`Your phone number will only be used for this one-time verification.`} </span>
                        <LearnMore url="https://protonmail.com/support/knowledge-base/human-verification/" />
                    </p>

                    <CodeVerification
                        phone={defaultPhone}
                        mode={mode}
                        onSubmit={(token) => onSubmit(token, 'sms')}
                        method="sms"
                    />
                </>
            ),
        },
        methods.includes('invite') && {
            method: 'invite',
            title: c('Human verification method').t`Manual verification`,
            content: <RequestInvite />,
        },
    ].filter(isTruthy);

    const [index, setIndex] = useState(0);

    if (tabs.length === 0) {
        return <Alert type="error">{c('Human verification method').t`No verification method available`}</Alert>;
    }

    return <Tabs tabs={tabs} value={index} onChange={setIndex} />;
};

export default HumanVerificationForm;
