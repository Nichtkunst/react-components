import React from 'react';
import { updateAutoresponder } from 'proton-shared/lib/api/mailSettings';
import { c } from 'ttag';

import { useModals, useMailSettings, useLoading, useApi, useEventManager } from '../../hooks';
import { Toggle, Button, Field, Label, Alert, EditableSection } from '../../components';
import AutoReplyModal from './AutoReplyModal';
import AutoReplyTemplate from './AutoReplyTemplate';
import { classnames } from '../../helpers';

const AutoReplySection = () => {
    const { createModal } = useModals();
    const [{ AutoResponder }] = useMailSettings();
    const api = useApi();
    const { call } = useEventManager();
    const [loading, withLoading] = useLoading();

    const handleOpenModal = () => {
        createModal(<AutoReplyModal autoresponder={AutoResponder} />);
    };

    const handleToggle = async (isEnabled) => {
        if (isEnabled) {
            return handleOpenModal();
        }
        await api(updateAutoresponder({ ...AutoResponder, IsEnabled: false }));
        await call();
    };

    return (
        <>
            <Alert className="mt1 mb1" learnMore="https://protonmail.com/support/knowledge-base/autoresponder/">
                {c('Info')
                    .t`Automatic replies can respond automatically to incoming messages (such as when you are on vacation and can't respond).`}
            </Alert>

            <EditableSection className="editableSection-container--sizeTablet">
                <Label htmlFor="autoReplyToggle" className="border-bottom onmobile-pb0 onmobile-no-border">{c('Label')
                    .t`Auto-reply`}</Label>
                <Field className="auto border-bottom onmobile-pb0 onmobile-no-border flex flex-nowrap">
                    <span className="flex-item-noshrink">
                        <Toggle
                            id="autoReplyToggle"
                            loading={loading}
                            checked={AutoResponder.IsEnabled}
                            onChange={({ target: { checked } }) => withLoading(handleToggle(checked))}
                        />
                    </span>
                    <span
                        className={classnames([
                            'onmobile-pb0 onmobile-no-border',
                            AutoResponder.IsEnabled ? 'mlauto' : 'ml2',
                        ])}
                    >
                        <Button className="pm-button--primary mt0-25" onClick={handleOpenModal}>{c('Action')
                            .t`Edit`}</Button>
                    </span>
                </Field>
                {AutoResponder.IsEnabled && (
                    <AutoReplyTemplate autoresponder={AutoResponder} onEdit={handleOpenModal} />
                )}
            </EditableSection>
        </>
    );
};

export default AutoReplySection;
