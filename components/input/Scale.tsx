import React from 'react';
import { range } from 'proton-shared/lib/helpers/array';

import InputButton, { InputButtonProps } from './InputButton';

interface ScaleProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    from: number;
    to: number;
    fromLabel: string;
    toLabel: string;
    value?: number;
    InputButtonProps: Partial<InputButtonProps>;
    onChange: (value: number) => void;
}

const Scale = ({ from, to, fromLabel, toLabel, value, InputButtonProps, onChange, ...rest }: ScaleProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    const scale = range(from, to + 1);

    return (
        <div {...rest}>
            <div className="scale-buttons-container">
                {scale.map((n) => (
                    <InputButton
                        key={n}
                        id={`score-${n}`}
                        name="score"
                        type="radio"
                        value={n}
                        title={String(n)}
                        checked={value === n}
                        onChange={handleChange}
                        {...InputButtonProps}
                    >
                        {n}
                    </InputButton>
                ))}
            </div>
            <div className="flex flex-spacebetween mt0-5">
                <span className="small m0">{fromLabel}</span>
                <span className="small m0">{toLabel}</span>
            </div>
        </div>
    );
};

export default Scale;
