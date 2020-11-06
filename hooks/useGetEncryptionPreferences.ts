import { ADDRESS_STATUS, MINUTE, RECIPIENT_TYPES } from 'proton-shared/lib/constants';
import { normalizeInternalEmail } from 'proton-shared/lib/helpers/email';
import { useCallback } from 'react';
import getPublicKeysVcardHelper from 'proton-shared/lib/api/helpers/getPublicKeysVcardHelper';
import { getContactPublicKeyModel } from 'proton-shared/lib/keys/publicKeys';
import extractEncryptionPreferences, { EncryptionPreferences } from 'proton-shared/lib/mail/encryptionPreferences';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import useApi from './useApi';
import { useGetAddresses } from './useAddresses';
import { useGetAddressKeys } from './useGetAddressKeys';
import { useGetMailSettings } from './useMailSettings';
import { useGetUserKeys } from './useUserKeys';
import useGetPublicKeys from './useGetPublicKeys';
import { getPromiseValue } from './useCachedModelResult';
import useCache from './useCache';

export const CACHE_KEY = 'ENCRYPTION_PREFERENCES';

const DEFAULT_LIFETIME = 5 * MINUTE;

// Implement the logic in the document 'Send preferences for outgoing email'
/**
 * Given an email address and the user mail settings, return the encryption preferences for sending to that email.
 * The API entry point is also needed. The logic for how those preferences are determined is laid out in the
 * Confluence document 'Encryption preferences for outgoing email'
 */
const useGetEncryptionPreferences = () => {
    const api = useApi();
    const cache = useCache();
    const getAddresses = useGetAddresses();
    const getUserKeys = useGetUserKeys();
    const getAddressKeys = useGetAddressKeys();
    const getPublicKeys = useGetPublicKeys();
    const getMailSettings = useGetMailSettings();

    const getEncryptionPreferences = useCallback(
        async (emailAddress: string, lifetime?: number) => {
            const [addresses, mailSettings] = await Promise.all([getAddresses(), getMailSettings()]);
            const selfAddress = addresses.find(
                ({ Email, Status }) =>
                    normalizeInternalEmail(Email) === normalizeInternalEmail(emailAddress) &&
                    Status === ADDRESS_STATUS.STATUS_ENABLED
            );
            let selfSend;
            let apiKeysConfig;
            let pinnedKeysConfig;
            if (selfAddress) {
                // we do not trust the public keys in ownAddress (they will be deprecated in the API response soon anyway)
                const selfPublicKey = (await getAddressKeys(selfAddress.ID))[0]?.publicKey;
                selfSend = { address: selfAddress, publicKey: selfPublicKey };
                // For own addresses, we use the decrypted keys in selfSend and do not fetch any data from the API
                apiKeysConfig = { Keys: [], publicKeys: [], RecipientType: RECIPIENT_TYPES.TYPE_INTERNAL };
                pinnedKeysConfig = { pinnedKeys: [], isContact: false };
            } else {
                const { publicKeys } = splitKeys(await getUserKeys());
                apiKeysConfig = await getPublicKeys(emailAddress, lifetime);
                const isInternal = apiKeysConfig.RecipientType === RECIPIENT_TYPES.TYPE_INTERNAL;
                pinnedKeysConfig = await getPublicKeysVcardHelper(api, emailAddress, publicKeys, isInternal);
            }
            const publicKeyModel = await getContactPublicKeyModel({
                emailAddress,
                apiKeysConfig,
                pinnedKeysConfig,
            });
            return extractEncryptionPreferences(publicKeyModel, mailSettings, selfSend);
        },
        [api, getAddressKeys, getAddresses, getPublicKeys, getMailSettings]
    );

    return useCallback<(email: string, lifetime?: number) => Promise<EncryptionPreferences>>(
        (email: string, lifetime = DEFAULT_LIFETIME) => {
            if (!cache.has(CACHE_KEY)) {
                cache.set(CACHE_KEY, new Map());
            }
            const subCache = cache.get(CACHE_KEY);
            const miss = () => getEncryptionPreferences(email, lifetime);
            return getPromiseValue(subCache, email, miss, lifetime);
        },
        [cache, getEncryptionPreferences]
    );
};

export default useGetEncryptionPreferences;
