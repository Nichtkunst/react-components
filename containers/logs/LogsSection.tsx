import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { fromUnixTime } from 'date-fns';
import { clearLogs } from 'proton-shared/lib/api/logs';
import { updateLogAuth } from 'proton-shared/lib/api/settings';
import downloadFile from 'proton-shared/lib/helpers/downloadFile';
import { ELEMENTS_PER_PAGE } from 'proton-shared/lib/constants';
import { SETTINGS_LOG_AUTH_STATE } from 'proton-shared/lib/interfaces';
import { wait } from 'proton-shared/lib/helpers/promise';
import { AuthLog } from './interface';
import { Alert, Block, Button, ButtonGroup, ConfirmModal, Group, Pagination, usePagination } from '../../components';
import { useApi, useLoading, useModals, useUserSettings } from '../../hooks';

import LogsTable from './LogsTable';
import WipeLogsButton from './WipeLogsButton';
import { getAllAuthenticationLogs, getEventsI18N } from './helper';

const INITIAL_STATE = {
    logs: [],
    total: 0,
};

const LogsSection = () => {
    const i18n = getEventsI18N();
    const [settings] = useUserSettings();
    const { createModal } = useModals();
    const [logAuth, setLogAuth] = useState(settings.LogAuth);
    const api = useApi();
    const [state, setState] = useState<{ logs: AuthLog[]; total: number }>(INITIAL_STATE);
    const { page, list, onNext, onPrevious, onSelect } = usePagination(state.logs);
    const [loading, withLoading] = useLoading();
    const [loadingRefresh, withLoadingRefresh] = useLoading();
    const [loadingDownload, withLoadingDownload] = useLoading();

    const handleWipe = async () => {
        await api(clearLogs());
        setState(INITIAL_STATE);
    };

    const handleDownload = async () => {
        const Logs = await getAllAuthenticationLogs(api);

        const data = Logs.reduce(
            (acc, { Event, Time, IP }) => {
                acc.push(`${i18n[Event]},${fromUnixTime(Time).toISOString()},${IP}`);
                return acc;
            },
            [['Event', 'Time', 'IP'].join(',')]
        );

        const filename = 'logs.csv';
        const csvString = data.join('\r\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        downloadFile(blob, filename);
    };

    const confirmDisable = () => {
        return new Promise<void>((resolve, reject) => {
            createModal(
                <ConfirmModal title={c('Title').t`Clear`} onConfirm={resolve} onClose={reject}>
                    <Alert type="warning">{c('Warning')
                        .t`By disabling the logs, you will also clear your entire logs history. Are you sure you want to disable the logs?`}</Alert>
                </ConfirmModal>
            );
        });
    };

    const handleLogAuth = (newLogAuthState: SETTINGS_LOG_AUTH_STATE) => async () => {
        if (state.total > 0 && newLogAuthState === SETTINGS_LOG_AUTH_STATE.DISABLE) {
            await confirmDisable();
        }
        await api(updateLogAuth(newLogAuthState));
        setLogAuth(newLogAuthState);
        if (newLogAuthState === SETTINGS_LOG_AUTH_STATE.DISABLE) {
            setState(INITIAL_STATE);
        }
    };

    // Handle updates from the event manager
    useEffect(() => {
        setLogAuth(settings.LogAuth);
    }, [settings.LogAuth]);

    const fetchAndSetState = async () => {
        const Logs = await getAllAuthenticationLogs(api);
        setState({ logs: Logs.sort((a, b) => b.Time - a.Time), total: Logs.length });
    };

    useEffect(() => {
        withLoading(fetchAndSetState());
    }, []);

    return (
        <>
            <Alert>{c('Info')
                .t`Logs includes authentication attempts for all Proton services that use your Proton credentials.`}</Alert>
            <Block className="flex flex-spacebetween flex-items-center">
                <div className="flex flex-items-center">
                    <Group className="mr1 mb0-5">
                        <ButtonGroup
                            className={logAuth === SETTINGS_LOG_AUTH_STATE.DISABLE ? 'is-active' : ''}
                            onClick={handleLogAuth(SETTINGS_LOG_AUTH_STATE.DISABLE)}
                        >{c('Log preference').t`Disabled`}</ButtonGroup>
                        <ButtonGroup
                            className={logAuth === SETTINGS_LOG_AUTH_STATE.BASIC ? 'is-active' : ''}
                            onClick={handleLogAuth(SETTINGS_LOG_AUTH_STATE.BASIC)}
                        >{c('Log preference').t`Basic`}</ButtonGroup>
                        <ButtonGroup
                            className={logAuth === SETTINGS_LOG_AUTH_STATE.ADVANCED ? 'is-active' : ''}
                            onClick={handleLogAuth(SETTINGS_LOG_AUTH_STATE.ADVANCED)}
                        >{c('Log preference').t`Advanced`}</ButtonGroup>
                    </Group>
                    <span className="flex-item-noshrink">
                        <Button
                            icon="reload"
                            className="mr1 mb0-5"
                            loading={loadingRefresh}
                            onClick={() => withLoadingRefresh(wait(1000).then(fetchAndSetState))}
                            title={c('Action').t`Refresh`}
                        />
                        {state.logs.length ? <WipeLogsButton className="mr1 mb0-5" onWipe={handleWipe} /> : null}
                        {state.logs.length ? (
                            <Button
                                className="mb0-5 mr1"
                                onClick={() => withLoadingDownload(handleDownload())}
                                loading={loadingDownload}
                            >{c('Action').t`Download`}</Button>
                        ) : null}
                    </span>
                </div>
                <div className="mb0-5">
                    <Pagination
                        onNext={onNext}
                        onPrevious={onPrevious}
                        onSelect={onSelect}
                        total={state.total}
                        page={page}
                        limit={ELEMENTS_PER_PAGE}
                    />
                </div>
            </Block>
            <LogsTable logs={list} logAuth={logAuth} loading={loading} />
        </>
    );
};

export default LogsSection;
