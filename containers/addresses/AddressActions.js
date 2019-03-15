import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Dropdown,
    DropdownMenu,
    useApiWithoutResult,
    useModal,
    useNotifications,
    useEventManager
} from 'react-components';
import { ADDRESS_TYPE, ADDRESS_STATUS, MEMBER_PRIVATE } from 'proton-shared/lib/constants';
import { deleteAddress, enableAddress, disableAddress } from 'proton-shared/lib/api/addresses';

import EditAddressModal from './EditAddressModal';

const { TYPE_ORIGINAL, TYPE_CUSTOM_DOMAIN, TYPE_PREMIUM } = ADDRESS_TYPE;
const { STATUS_DISABLED, STATUS_ENABLED } = ADDRESS_STATUS;
const { READABLE, UNREADABLE } = MEMBER_PRIVATE;

const AddressActions = ({ address, user, member }) => {
    const { Status, Type, ID } = address;
    const { call } = useEventManager();
    const { request: requestDelete } = useApiWithoutResult(deleteAddress);
    const { request: requestEnable } = useApiWithoutResult(enableAddress);
    const { request: requestDisable } = useApiWithoutResult(disableAddress);
    const { isOpen, open, close } = useModal();
    const { createNotification } = useNotifications();
    const canDelete = Type === TYPE_CUSTOM_DOMAIN;
    const canEnable = user.isAdmin && Status === STATUS_DISABLED && Type !== TYPE_ORIGINAL && Type !== TYPE_PREMIUM;
    const canDisable = user.isAdmin && Status === STATUS_ENABLED && Type !== TYPE_ORIGINAL && Type !== TYPE_PREMIUM;
    const canGenerate =
        ((user.isAdmin && member.Private === READABLE) || (member.Private === UNREADABLE && member.Self)) &&
        !address.HasKeys;

    const handleDelete = async () => {
        await requestDelete(ID);
        await call();
        createNotification({ text: c('Success notification').t`Address deleted` });
    };

    const handleEnable = async () => {
        await requestEnable(ID);
        await call();
        createNotification({ text: c('Success notification').t`Address enabled` });
    };

    const handleDisable = async () => {
        await requestDisable(ID);
        await call();
        createNotification({ text: c('Success notification').t`Address disabled` });
    };

    const handleGenerate = async () => {
        // TODO generate missing keys
        await call();
        createNotification({ text: c('Success notification').t`Keys generated` });
    };

    const list = [
        {
            text: c('Address action').t`Edit`,
            type: 'button',
            onClick: open
        }
    ];

    if (canEnable) {
        list.push({
            text: c('Address action').t`Enable`,
            type: 'button',
            onClick: handleEnable
        });
    }

    if (canDisable) {
        list.push({
            text: c('Address action').t`Disable`,
            type: 'button',
            onClick: handleDisable
        });
    }

    if (canGenerate) {
        list.push({
            text: c('Address action').t`Generate missing keus`,
            type: 'button',
            onClick: handleGenerate
        });
    }

    if (canDelete) {
        list.push({
            text: c('Address action').t`Delete`,
            type: 'button',
            onClick: handleDelete
        });
    }

    return (
        <>
            <Dropdown className="pm-button pm-button--small" content={c('Action').t`Options`}>
                <DropdownMenu list={list} />
            </Dropdown>
            <EditAddressModal show={isOpen} onClose={close} address={address} />
        </>
    );
};

AddressActions.propTypes = {
    address: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    member: PropTypes.object.isRequired
};

const mapStateToProps = ({ user: { data } }) => ({ user: data });

export default connect(mapStateToProps)(AddressActions);
