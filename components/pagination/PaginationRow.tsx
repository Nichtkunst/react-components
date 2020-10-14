import React from 'react';
import { c } from 'ttag';
import { range } from 'proton-shared/lib/helpers/array';

import { Group, ButtonGroup } from '../button';
import { Icon } from '../icon';
import { classnames } from '../../helpers';

interface Props {
    onStart: () => void;
    onEnd: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onPage: (pageNumber: number) => void;
    page: number;
    total: number;
    disabled?: boolean;
    step?: number;
    className?: string;
}

const PaginationRow = ({
    onStart,
    onEnd,
    onPrevious,
    onNext,
    onPage,
    page,
    disabled,
    total,
    step = 1,
    className,
}: Props) => {
    const pages = range(page - step, page + step).filter((pageNumber) => pageNumber > 0 && pageNumber <= total);
    const goToPageTitle = c('Action').t`Go to page ${page}`;
    const disablePrevious = page === 1;
    const disableNext = page === total;
    return (
        <Group className={className}>
            <ButtonGroup
                className="pm-button--for-icon"
                disabled={disabled || disablePrevious}
                onClick={() => onStart()}
                title={c('Action').t`Go to first page`}
            >
                <Icon name="caret-double-left" />
            </ButtonGroup>
            <ButtonGroup
                className="pm-button--for-icon"
                disabled={disabled || disablePrevious}
                onClick={() => onPrevious()}
                title={c('Action').t`Go to previous page`}
            >
                <Icon name="caret rotateZ-270" />
            </ButtonGroup>
            {pages.map((pageNumber) => {
                const isActive = pageNumber === page;
                return (
                    <ButtonGroup
                        disabled={disabled || isActive}
                        className={classnames(['pm-button--for-icon', isActive && 'is-active'])}
                        key={pageNumber}
                        title={goToPageTitle}
                        onClick={() => onPage(pageNumber)}
                    >
                        {pageNumber}
                    </ButtonGroup>
                );
            })}
            <ButtonGroup
                className="pm-button--for-icon"
                disabled={disabled || disableNext}
                onClick={() => onNext()}
                title={c('Action').t`Go to next page`}
            >
                <Icon name="caret rotateZ-90" />
            </ButtonGroup>
            <ButtonGroup
                className="pm-button--for-icon"
                disabled={disabled || disableNext}
                onClick={() => onEnd()}
                title={c('Action').t`Go to last page`}
            >
                <Icon name="caret-double-left mirror" />
            </ButtonGroup>
        </Group>
    );
};

export default PaginationRow;