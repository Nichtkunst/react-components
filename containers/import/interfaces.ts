import { LABEL_TYPE } from 'proton-shared/lib/constants';

export enum DestinationFolder {
    INBOX = 'Inbox',
    ALL_DRAFTS = 'All Drafts',
    ALL_SENT = 'All Sent',
    TRASH = 'Trash',
    SPAM = 'Spam',
    ALL_MAIL = 'All Mail',
    STARRED = 'Starred',
    ARCHIVE = 'Archive',
    SENT = 'Sent',
    DRAFTS = 'Drafts',
}

export enum IMPORT_ERROR {
    AUTH_IMAP = 2000,
    AUTH_CREDENTIALS = 2902,
    ALREADY_EXISTS = 2500,
}

export interface ImportedFolder {
    SourceFolder: string;
    DestinationFolder?: DestinationFolder;
    Processed: number;
    Total: number;
}

export interface MailImportFolder {
    Source: string;
    Separator: string;
    Total: number;
    Flags: string[];
    DestinationFolder?: DestinationFolder;
    Size: number;
}

export enum Step {
    START,
    PREPARE,
    STARTED,
    INSTRUCTIONS,
}

export interface ImportModalModel {
    providerFolders: MailImportFolder[];
    step: Step;
    needIMAPDetails: boolean;
    importID: string;
    email: string;
    password: string;
    port: string;
    imap: string;
    errorCode: number;
    errorLabel: string;
    selectedPeriod: TIME_UNIT;
    payload: ImportPayloadModel;
    isPayloadInvalid: boolean;
}

export interface FolderMapping {
    Source: string;
    Destinations: {
        FolderPath: string;
    };
    checked: boolean;
}

export interface ImportPayloadModel {
    AddressID?: string;
    Code?: string;
    ImportLabel?: {
        Name: string;
        Color: string;
        Type: LABEL_TYPE;
        Order: number;
    };
    StartTime?: Date;
    EndTime?: Date;
    Mapping: FolderMapping[];
    CustomFields?: number;
}

export enum ImportMailStatus {
    QUEUED = 0,
    RUNNING = 1,
    DONE = 2,
    FAILED = 3,
    PAUSED = 4,
    CANCELED = 5,
    DELAYED = 6,
}

export enum ImportMailError {
    ERROR_CODE_IMAP_CONNECTION = 1,
    ERROR_CODE_QUOTA_LIMIT = 2,
}

export interface Importer {
    ID: string;
    Email: string;
    ImapHost?: string;
    ImapPort?: string;
    Active?: {
        CreateTime: number;
        AddressID: string;
        State: ImportMailStatus;
        FilterStartDate: string;
        FilterEndDate: string;
        Mapping: ImportedFolder[];
        ErrorCode?: ImportMailError;
    };
}

export enum ImportMailReportStatus {
    QUEUED = 0,
    RUNNING = 1,
    DONE = 2,
    FAILED = 3,
    PAUSED = 4,
    CANCELED = 5,
    DELAYED = 6,
}

export interface ImportHistory {
    ID: string;
    Email: string;
    CreateTime: number;
    EndTime: number;
    NumMessages: number;
    State: ImportMailReportStatus;
    TotalSize: number;
}

export interface CheckedFoldersMap {
    [key: string]: boolean;
}

export interface DisabledFoldersMap {
    [key: string]: boolean;
}

export interface FolderRelationshipsMap {
    [key: string]: string[];
}

export interface FolderNamesMap {
    [key: string]: string;
}

export interface EditModeMap {
    [key: string]: boolean;
}

export interface FolderPathsMap {
    [key: string]: string;
}

export enum TIME_UNIT {
    BIG_BANG = 'big_bang',
    LAST_YEAR = 'last_year',
    LAST_3_MONTHS = 'last_3_months',
    LAST_MONTH = 'last_month',
}

export enum PROVIDER_INSTRUCTIONS {
    GMAIL = 'gmail',
    YAHOO = 'yahoo',
}

export enum OAUTH_PROVIDER {
    GMAIL = 'GMAIL',
}

export enum GMAIL_INSTRUCTIONS {
    IMAP = 1,
    LABELS = 2,
    TWO_STEPS = 3,
}
