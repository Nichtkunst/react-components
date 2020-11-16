import React, { useState, useMemo, useEffect } from 'react';
import { c } from 'ttag';

import { Address } from 'proton-shared/lib/interfaces';

import {
    ImportModalModel,
    ImportPayloadModel,
    FolderMapping,
    MailImportFolder,
    CheckedFoldersMap,
    DisabledFoldersMap,
    FolderRelationshipsMap,
    FolderNamesMap,
    FolderPathsMap,
    EditModeMap,
} from '../interfaces';

import { escapeSlashes, splitEscaped } from '../helpers';

import { Alert } from '../../../components';

import ImportManageFoldersRow from './ImportManageFoldersRow';

interface Props {
    modalModel: ImportModalModel;
    address: Address;
    payload: ImportPayloadModel;
    onChangePayload: (newPayload: ImportPayloadModel) => void;
    toggleEditing: (editing: boolean) => void;
}

const ImportManageFolders = ({ modalModel, address, payload, toggleEditing, onChangePayload }: Props) => {
    const { providerFolders } = modalModel;

    const getLevel = (name: string, separator: string) => {
        const split = splitEscaped(name, separator);
        let level = 0;
        while (split.length) {
            split.pop();
            if (providerFolders.find((f) => f.Source === split.join(separator))) {
                level += 1;
            }
        }

        return level;
    };

    const folderRelationshipsMap = providerFolders.reduce((acc: FolderRelationshipsMap, folder) => {
        const currentLevel = getLevel(folder.Source, folder.Separator);

        acc[folder.Source] = providerFolders
            .filter((f) => {
                const level = getLevel(f.Source, f.Separator);
                return currentLevel + 1 === level && f.Source.startsWith(folder.Source);
            })
            .map((f) => f.Source);

        return acc;
    }, {});

    const [checkedFoldersMap, setCheckedFoldersMap] = useState(
        providerFolders.reduce<CheckedFoldersMap>((acc, folder) => {
            const found = payload.Mapping.find((m) => m.Source === folder.Source);
            acc[folder.Source] = !!found;
            return acc;
        }, {})
    );

    const getParent = (folderName: string) => {
        const [parentName] =
            Object.entries(folderRelationshipsMap).find(([, children]) => {
                return children.includes(folderName);
            }) || [];
        return parentName;
    };

    const getNameValue = (destinationPath: string) => {
        const [firstLevel, secondLevel, ...restOfTheTree] = splitEscaped(destinationPath);

        // for level 3 or more
        if (restOfTheTree.length) {
            return restOfTheTree.join('/');
        }
        return secondLevel || firstLevel;
    };

    const [folderNamesMap, setFoldersNameMap] = useState(
        providerFolders.reduce<FolderNamesMap>((acc, folder) => {
            const found = payload.Mapping.find((m) => m.Source === folder.Source);
            acc[folder.Source] = getNameValue(
                found?.Destinations.FolderPath || folder.DestinationFolder || folder.Source
            );
            return acc;
        }, {})
    );

    const forgeNewPath = (folder: MailImportFolder) => {
        let sourceParentPath = getParent(folder.Source);
        const ancestors = [];

        while (sourceParentPath) {
            ancestors.unshift(folderNamesMap[sourceParentPath]);
            sourceParentPath = getParent(sourceParentPath);
        }

        const [firstLevel, secondLevel] = ancestors;

        return [firstLevel, secondLevel, folderNamesMap[folder.Source]].filter((value) => !!value).join('/');
    };

    const folderPathsMap = useMemo(
        () =>
            providerFolders.reduce<FolderPathsMap>((acc, folder) => {
                acc[folder.Source] = forgeNewPath(folder);
                return acc;
            }, {}),
        [folderNamesMap, checkedFoldersMap]
    );

    const disabledFoldersMap = useMemo(() => {
        return providerFolders.reduce<DisabledFoldersMap>((acc, folder) => {
            const sourceParentName = getParent(folder.Source);
            acc[folder.Source] = sourceParentName
                ? acc[sourceParentName] || !checkedFoldersMap[sourceParentName]
                : false;
            return acc;
        }, {});
    }, [checkedFoldersMap]);

    const getDescendants = (children: string[]) => {
        const grandChildren: string[] = children.reduce<string[]>((acc, childName) => {
            const children = folderRelationshipsMap[childName];

            return [...acc, ...getDescendants(children)];
        }, []);

        return [...children, ...grandChildren];
    };

    const handleToggleCheck = (source: string, checked: boolean) => {
        const newCheckedFoldersMap = {
            ...checkedFoldersMap,
            [source]: checked,
        };

        const children = folderRelationshipsMap[source];
        const descendants = children ? getDescendants(children) : [];

        descendants.forEach((folderName) => {
            newCheckedFoldersMap[folderName] = checked;
        });

        setCheckedFoldersMap(newCheckedFoldersMap);
    };

    const handleRename = (source: string, newName: string) => {
        const newFoldersNameMap = { ...folderNamesMap };
        newFoldersNameMap[source] = escapeSlashes(newName);
        setFoldersNameMap(newFoldersNameMap);
    };

    const [editModeMap, setEditModeMap] = useState(
        providerFolders.reduce<EditModeMap>((acc, folder) => {
            acc[folder.Source] = false;
            return acc;
        }, {})
    );

    const updateEditModeMapping = (key: string, editMode: boolean) => {
        const newEditModeMap = { ...editModeMap };
        newEditModeMap[key] = editMode;
        setEditModeMap(newEditModeMap);
    };

    useEffect(() => {
        const isEditing = Object.values(editModeMap).filter(Boolean).length > 0;
        toggleEditing(isEditing);
    }, [editModeMap]);

    useEffect(() => {
        const Mapping = providerFolders.reduce<FolderMapping[]>((acc, folder) => {
            if (checkedFoldersMap[folder.Source]) {
                acc.push({
                    Source: folder.Source,
                    Destinations: {
                        FolderPath: forgeNewPath(folder),
                    },
                    checked: true,
                });
            }

            return acc;
        }, []);

        onChangePayload({
            ...payload,
            Mapping,
        });
    }, [checkedFoldersMap, folderNamesMap]);

    return (
        <>
            <Alert className="mt2 mb1">{c('Info').t`Please select the folders you would like to import:`}</Alert>

            <div className="flex">
                <div className="w40 ellipsis pt1">
                    <strong>{c('Label').t`From: ${modalModel.email}`}</strong>
                </div>

                <div className="w40 ellipsis pt1">
                    <strong>{c('Label').t`To: ${address.Email}`}</strong>
                </div>

                <div className="w20 pt1">
                    <strong>{c('Label').t`Actions`}</strong>
                </div>
            </div>

            <div className="flex mb1">
                <div className="flex-item-fluid pt0-5">
                    <ul className="unstyled m0">
                        {providerFolders
                            .filter((folder) => getLevel(folder.Source, folder.Separator) === 0)
                            .map((item: MailImportFolder) => (
                                <ImportManageFoldersRow
                                    onToggleCheck={handleToggleCheck}
                                    key={item.Source}
                                    folder={item}
                                    level={0}
                                    disabledFoldersMap={disabledFoldersMap}
                                    checkedFoldersMap={checkedFoldersMap}
                                    folderRelationshipsMap={folderRelationshipsMap}
                                    providerFolders={providerFolders}
                                    folderNamesMap={folderNamesMap}
                                    folderPathsMap={folderPathsMap}
                                    onRename={handleRename}
                                    editModeMap={editModeMap}
                                    getParent={getParent}
                                    updateEditModeMapping={updateEditModeMapping}
                                />
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ImportManageFolders;
