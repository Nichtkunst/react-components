import React from 'react';

interface CaseProps {
    children: React.ReactNode;
    // eslint-disable-next-line react/no-unused-prop-types
    value: boolean;
}

export const If = <T,>({ children }: CaseProps) => {
    return <>{children}</>;
};

interface Props {
    children: React.ReactElement<CaseProps>[];
}

export const Conditional = <T,>({ children }: Props) => {
    let element: React.ReactNode = null;
    React.Children.forEach(children, (child) => {
        if (element === null && React.isValidElement<CaseProps>(child) && child.props.value) {
            element = child;
        }
    });
    return <>{element}</>;
};
