import React, { useRef, useState } from 'react';
import { getFeature, updateFeatureValue } from 'proton-shared/lib/api/features';

import { useApi } from '../../hooks';
import FeaturesContext, { Feature, FeatureCode } from './FeaturesContext';

interface Props {
    children: React.ReactNode;
}

const FeaturesProvider = ({ children }: Props) => {
    const api = useApi();

    const [features, setFeatures] = useState<{ [key: string]: Feature }>({});

    const featureGetPromiseRef = useRef<null | Promise<Feature>>(null);

    const addFeature = (code: FeatureCode, feature: Feature) => {
        setFeatures((features) => ({ ...features, [code]: feature }));
    };

    const updateFeature = addFeature;

    const get = async (code: FeatureCode) => {
        if (features[code]) {
            return Promise.resolve(features[code]);
        }

        const createFeatureGetPromise = async () => {
            const { Feature } = await api<{ Feature: Feature }>(getFeature(code));

            addFeature(code, Feature);

            return Feature;
        };

        if (!featureGetPromiseRef.current) {
            featureGetPromiseRef.current = createFeatureGetPromise();
        }

        return featureGetPromiseRef.current;
    };

    const put = async (code: FeatureCode, value: any) => {
        const { Feature } = await api<{ Feature: Feature }>(updateFeatureValue(code, value));

        updateFeature(code, Feature);

        return Feature;
    };

    const context = { features, get, put };

    return <FeaturesContext.Provider value={context}>{children}</FeaturesContext.Provider>;
};

export default FeaturesProvider;
