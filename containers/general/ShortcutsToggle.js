import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { updateHotkeys } from 'proton-shared/lib/api/mailSettings';
import { useToggle, useEventManager, useApiWithoutResult, useNotifications } from '../../hooks';
import { Toggle } from '../../components';

const ShortcutsToggle = ({ id, hotkeys, onChange, className }) => {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(updateHotkeys);
    const { state, toggle } = useToggle(!!hotkeys);
    const handleChange = async ({ target }) => {
        await request(+target.checked);
        call();
        toggle();
        onChange(+target.checked);
        createNotification({ text: c('Success').t`Keyboard shortcuts preferences updated` });
    };
    return <Toggle id={id} className={className} checked={state} onChange={handleChange} loading={loading} />;
};

ShortcutsToggle.propTypes = {
    id: PropTypes.string,
    hotkeys: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default ShortcutsToggle;
