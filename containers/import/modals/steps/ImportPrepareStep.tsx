import React, { useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { c, msgid } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';
import { LABEL_COLORS, LABEL_TYPE } from 'proton-shared/lib/constants';
import { randomIntFromInterval } from 'proton-shared/lib/helpers/function';

import { useFolders, useModals } from '../../../../hooks';
import { Icon, LabelStack, Button, Alert, Href, Loader } from '../../../../components';

import { ImportModalModel, MailImportFolder } from '../../interfaces';
import { timeUnitLabels, TIME_UNIT } from '../../constants';

import CustomizedImportModal from '../CustomizedImportModal';

interface Props {
    modalModel: ImportModalModel;
    updateModalModel: (newModel: ImportModalModel) => void;
    address: Address;
}

const ImportPrepareStep = ({ modalModel, updateModalModel, address }: Props) => {
    const { createModal } = useModals();
    const { providerFolders, password } = modalModel;
    const [folders = [], foldersLoading] = useFolders();

    const providerFoldersNum = useMemo(() => providerFolders.length, [providerFolders]);
    const providerMessageNum = useMemo(() => providerFolders.reduce((acc, { Total }) => acc + Total, 0), [
        providerFolders,
    ]);
    const selectedFolders = useMemo(
        () =>
            modalModel.payload.Mapping.filter((m) => m.Destinations.FolderName).map(
                (mappedFolder) =>
                    providerFolders.find((p) => p.Name === mappedFolder.Source) || ({} as MailImportFolder)
            ),
        [modalModel.payload.Mapping, providerFolders]
    );
    const selectedFoldersMessageCount = useMemo(() => selectedFolders.reduce((acc, { Total = 0 }) => acc + Total, 0), [
        modalModel.payload.Mapping,
        providerFolders,
    ]);

    /*  @todo Missing Size in folders */
    // const importSize = useMemo(() => providerFolders.reduce((acc, { Size = 0 }) => acc + Size, 0), [providerFolders]);

    const onClickCustomize = () => {
        createModal(
            <CustomizedImportModal
                folders={folders}
                address={address}
                modalModel={modalModel}
                updateModalModel={updateModalModel}
            />
        );
    };

    useEffect(() => {
        const Mapping = providerFolders.map((folder) => ({
            Source: folder.Name,
            Destinations: {
                FolderName: folder.DestinationFolder || folder.Name,
            },
        }));

        updateModalModel({
            ...modalModel,
            payload: {
                AddressID: address.ID,
                Code: password,
                Mapping,
                ImportLabel: {
                    Name: `${modalModel.email.split('@')[1]} - export ${format(new Date(), 'yyyy-MM-dd')}`,
                    Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
                    Type: LABEL_TYPE.MESSAGE_LABEL,
                    Order: 0,
                },
            },
        });
    }, []);

    return foldersLoading ? (
        <Loader />
    ) : (
        <>
            {/*

            @todo: add warning if size exceeds capacity

            <Alert type="warning" className="mt1 mb1">
                <div className="mb0-5">
                    {c('Warning')
                        .t`Required storage space for this import possibly exceeds your available Proton storage capacity.`}
                </div>
                <div className="mb0-5">
                    {c('Warning')
                        .t`The import will transfer as much as possible, starting with the most recent messages.`}
                </div>
                <Href url="https://protonmail.com/support/knowledge-base/">{c('Info').t`Learn more`}</Href>
            </Alert>
            */}

            {selectedFolders.length + folders.length >= 500 && (
                <Alert type="error" className="mt1 mb1">
                    <div>
                        {c('Error')
                            .t`The found number of folders exceeds the maximum limit for a single ProtonMail account. Please decrease the number of imported folders by customizing the import.`}
                    </div>
                </Alert>
            )}

            <div className="flex pb1 mb1 border-bottom">
                <div className="flex-item-fluid ellipsis mr0-5">
                    <span>{c('Label').t`From`}</span>
                    {`: `}
                    <strong>{modalModel.email}</strong>
                </div>
                <div className="flex-item-fluid ellipsis ml0-5 alignright">
                    <span>{c('Label').t`To`}</span>
                    {`: `}
                    <strong>{address.Email}</strong>
                </div>
            </div>

            <div className="pb1 mb1 border-bottom">
                <div className="mb1 flex flex-items-center">
                    <Icon className="mr0-5" name="mailbox" />
                    {c('Info').t`Import mailbox`}
                </div>

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="all-emails" />
                    {c('Info').ngettext(
                        msgid`${providerMessageNum} message has been found`,
                        `${providerMessageNum} messages have been found`,
                        providerMessageNum
                    )}
                </div>

                {selectedFoldersMessageCount !== providerMessageNum && (
                    <div className="mb1 ml2 flex flex-items-center">
                        <Icon className="mr0-5" name="all-emails" />
                        <strong>
                            {c('Info').ngettext(
                                msgid`${selectedFoldersMessageCount} message has been selected`,
                                `${selectedFoldersMessageCount} messages have been selected`,
                                selectedFoldersMessageCount
                            )}
                        </strong>
                    </div>
                )}

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="parent-folder" />
                    {c('Info').ngettext(
                        msgid`${providerFoldersNum} folder has been found`,
                        `${providerFoldersNum} folders have been found`,
                        providerFoldersNum
                    )}
                </div>

                {selectedFolders.length !== providerFoldersNum && (
                    <div className="mb1 ml2 flex flex-items-center">
                        <strong>
                            <Icon className="mr0-5" name="parent-folder" />
                            {c('Info').ngettext(
                                msgid`${selectedFolders.length} folder selected`,
                                `${selectedFolders.length} folders selected`,
                                selectedFolders.length
                            )}
                        </strong>
                    </div>
                )}

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="clock" />
                    {modalModel.selectedPeriod === TIME_UNIT.BIG_BANG
                        ? c('Info').t`Import all messages from ${timeUnitLabels[modalModel.selectedPeriod]}`
                        : c('Info').jt`Import all messages from ${(
                              <strong className="ml0-5">{timeUnitLabels[modalModel.selectedPeriod]}</strong>
                          )}`}
                </div>

                <div className="mb1 ml1 flex flex-items-center">
                    <Icon className="mr0-5" name="label" />
                    {c('Info').t`Label all imported messages as`}

                    {modalModel.payload.ImportLabel && modalModel.payload.ImportLabel.Name && (
                        <span className="ml0-5">
                            <LabelStack
                                labels={[
                                    {
                                        name: modalModel.payload.ImportLabel.Name,
                                        color: modalModel.payload.ImportLabel.Color,
                                        title: modalModel.payload.ImportLabel.Name,
                                    },
                                ]}
                                showDelete={false}
                            />
                        </span>
                    )}
                </div>
                <Button className="mt0-5" onClick={onClickCustomize}>{c('Action').t`Customized Import`}</Button>
            </div>
        </>
    );
};

export default ImportPrepareStep;