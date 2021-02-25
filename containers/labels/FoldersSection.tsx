import React from 'react';
import { c } from 'ttag';

import { Loader, Button } from '../../components';
import { useFolders, useModals } from '../../hooks';

import { SettingsSection, SettingsParagraph } from '../account';

import FolderTreeViewList from './FolderTreeViewList';
import EditLabelModal from './modals/EditLabelModal';

function LabelsSection() {
    const [folders = [], loadingFolders] = useFolders();
    const { createModal } = useModals();

    if (loadingFolders) {
        return (
            <SettingsSection>
                <Loader />
            </SettingsSection>
        );
    }

    return (
        <SettingsSection>
            <SettingsParagraph
                className="mt1 mb1"
                learnMoreUrl="https://protonmail.com/support/knowledge-base/creating-folders/"
            >
                {c('LabelSettings').t`A message can only be filed in a single Folder at a time.`}
            </SettingsParagraph>
            <div className="mb1">
                <Button color="norm" onClick={() => createModal(<EditLabelModal type="folder" />)}>
                    {c('Action').t`Add folder`}
                </Button>
            </div>
            {folders.length ? (
                <FolderTreeViewList items={folders} />
            ) : (
                <SettingsParagraph>{c('LabelSettings').t`No folders available`}</SettingsParagraph>
            )}
        </SettingsSection>
    );
}

export default LabelsSection;
