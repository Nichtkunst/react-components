import { useCallback, useState } from 'react';

const getErrors = <T extends Record<string, string[]>>(result: T) => {
    return Object.keys(result).reduce<{ [K in keyof T]: string }>((acc, akey) => {
        const validations = result[akey as keyof T];
        if (validations) {
            acc[akey as keyof T] = validations.reduce<string>((acc, validation) => acc || validation, '');
        }
        return acc;
    }, {} as { [K in keyof T]: string });
};

const useFormErrors = <
    T extends Record<string, string[]>,
    SetCallback extends Function,
    Setters extends Record<string, SetCallback>
>(
    validators: () => T,
    setters?: Setters,
    loading = false
) => {
    const [errors, setErrors] = useState<Partial<{ [K in keyof T]: string }>>({});

    const setError = useCallback((field: keyof T, value: string) => {
        setErrors((errors) => {
            return { ...errors, [field]: value };
        });
    }, []);

    const onInputChange = useCallback((field: string) => {
        setErrors((errors) => {
            if (!errors[field]) {
                return errors;
            }
            return { ...errors, [field]: '' };
        });
    }, []);

    const onFormSubmit = useCallback(() => {
        const errors = getErrors(validators());
        setErrors(errors);
        const hasError = Object.keys(errors).some((key) => !!errors[key as keyof T]);

        return !hasError;
    }, [validators]);

    const modifiedSetters = () => {
        const result = {} as { [K in keyof Setters]: Setters[K] | undefined };
        if (!setters || loading) {
            return result;
        }
        return Object.keys(setters).reduce((acc, key) => {
            const akey = key as keyof Setters;
            acc[akey] = (((...args: any[]) => {
                onInputChange(key);
                return setters[akey](...args);
                // Ugly but hey
            }) as unknown) as Setters[keyof Setters];
            return acc;
        }, result);
    };

    return {
        errors,
        setError,
        onFormSubmit,
        onInputChange,
        setters: modifiedSetters(),
    };
};

export default useFormErrors;
