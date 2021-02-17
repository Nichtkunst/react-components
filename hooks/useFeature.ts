import { useContext, useEffect } from 'react';

import { FeatureCode, FeaturesContext } from '../containers';

const useFeature = (code: FeatureCode) => {
    const { features, get, put } = useContext(FeaturesContext);

    useEffect(() => {
        get(code);
    }, []);

    return {
        get: <V = any>() => get<V>(code),
        update: <V = any>(value: V) => put<V>(code, value),
        feature: features[code],
    };
};

export default useFeature;
