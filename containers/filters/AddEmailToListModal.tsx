import React, { useState } from 'react';
import { c } from 'ttag';
import { addIncomingDefault, updateIncomingDefault } from 'proton-shared/lib/api/incomingDefaults';
import { noop } from 'proton-shared/lib/helpers/function';
import { WHITELIST_LOCATION, BLACKLIST_LOCATION } from 'proton-shared/lib/constants';
import { IncomingDefault } from 'proton-shared/lib/interfaces/IncomingDefault';
import { FormModal, Radio, Row, Label, Field } from '../../components';
import { useNotifications, useApi, useLoading } from '../../hooks';

import AddEmailToList from './spamlist/AddEmailToList';
import AddDomainToList from './spamlist/AddDomainToList';

const EMAIL_MODE = 'email';
const DOMAIN_MODE = 'domain';

type WHITE_OR_BLACK_LOCATION = typeof WHITELIST_LOCATION | typeof BLACKLIST_LOCATION;

interface Props {
    type: WHITE_OR_BLACK_LOCATION;
    incomingDefault?: IncomingDefault;
    onClose: () => void;
    onAdd: (incomingDefault: IncomingDefault) => void;
}

function AddEmailToListModal({ type, incomingDefault, onAdd = noop, onClose, ...rest }: Props) {
    const I18N = {
        ADD: {
            [BLACKLIST_LOCATION]: c('Title').t`Add to block list`,
            [WHITELIST_LOCATION]: c('Title').t`Add to allow list`,
        },
        EDIT: {
            [BLACKLIST_LOCATION]: c('Title').t`Edit block list`,
            [WHITELIST_LOCATION]: c('Title').t`Edit allow list`,
        },
    };

    const { ID, Domain, Email } = incomingDefault || {};
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();
    const api = useApi();
    const [mode, setMode] = useState(Domain ? DOMAIN_MODE : EMAIL_MODE);
    const [email, setEmail] = useState(Email || '');
    const [domain, setDomain] = useState(Domain || '');

    const handleSubmit = async () => {
        const parameters = {
            Location: type,
            ...(mode === EMAIL_MODE ? { Email: email } : { Domain: domain }),
        };
        const { IncomingDefault: data } = ID
            ? await api(updateIncomingDefault(ID, parameters))
            : await api(addIncomingDefault(parameters));
        const value = mode === EMAIL_MODE ? email : domain;
        createNotification({
            text: ID ? c('Spam notification').t`${value} updated` : c('Spam notification').t`${value} added`,
        });
        onAdd(data);
        onClose();
    };

    return (
        <FormModal
            onSubmit={() => withLoading(handleSubmit())}
            loading={loading}
            title={ID ? I18N.EDIT[type] : I18N.ADD[type]}
            submit={c('Action').t`Save`}
            onClose={onClose}
            {...rest}
        >
            <Row>
                <Label>{c('Label').t`Want to add`}</Label>
                <Field>
                    <Radio
                        id="email-mode"
                        checked={mode === EMAIL_MODE}
                        onChange={() => setMode(EMAIL_MODE)}
                        className="mr1"
                        name="filterMode"
                    >
                        {c('Label').t`Email`}
                    </Radio>
                    <Radio
                        id="domain-mode"
                        checked={mode === DOMAIN_MODE}
                        onChange={() => setMode(DOMAIN_MODE)}
                        name="filterMode"
                    >
                        {c('Label').t`Domain`}
                    </Radio>
                </Field>
            </Row>
            {mode === EMAIL_MODE ? <AddEmailToList email={email} onChange={setEmail} /> : null}
            {mode === DOMAIN_MODE ? <AddDomainToList domain={domain} onChange={setDomain} /> : null}
        </FormModal>
    );
}

export default AddEmailToListModal;
