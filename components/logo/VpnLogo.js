import React from 'react';
import PropTypes from 'prop-types';

const VpnLogo = ({ planName = '', className = 'logo center' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby="logo__title plan"
            width="148"
            height="36"
        >
            <g>
                <path d="M22.8 8.8C22.8 7.2 21.5 6 20 6c-1.5 0-2.8 1.2-2.8 2.8v.1L5.1 12.8c-.9-1.3-2.6-1.6-3.9-.7S-.4 14.7.5 16c.5.8 1.4 1.2 2.4 1.2.3 0 .6-.1.8-.1l8 10.1c-.6 1.4.1 3 1.5 3.7 1.4.6 3-.1 3.7-1.5.5-1.1.2-2.4-.7-3.2l4.2-14.5c1.3-.3 2.4-1.5 2.4-2.9zm-8.6 16.5c-.4 0-.9.1-1.2.3l-7.8-9.9c.2-.4.4-.7.4-1.2l12.4-4 .4.4-4.2 14.4zM40.7 11c1.2 1 1.9 2.5 1.8 4 .1 1.6-.6 3.2-1.8 4.2-1.4 1-3.2 1.5-4.9 1.4h-2.2V27h-2.4V9.6h4.6c1.7-.1 3.4.4 4.9 1.4zm-1.9 6.9c.8-.7 1.2-1.8 1.1-2.9.1-1-.3-2-1.1-2.7-.9-.6-2-.9-3.1-.8h-2.1v7.2h2.1c1 .1 2.2-.2 3.1-.8zM52.2 13.6l-.4 2.3c-.4-.1-.8-.1-1.2-.1-.8 0-1.5.3-2 .9-.6.8-1 1.8-1.2 2.8V27h-2.3V13.7h2l.2 2.7c.3-.8.8-1.6 1.4-2.2.6-.5 1.3-.8 2.1-.8.5 0 1 .1 1.4.2zM63.5 15.3c1.1 1.5 1.7 3.3 1.6 5.1 0 1.3-.2 2.5-.7 3.7-.4 1-1.1 1.9-2 2.5-.9.6-2.1.9-3.2.9-1.7.1-3.3-.6-4.4-1.9-1.1-1.5-1.7-3.3-1.6-5.2 0-1.3.2-2.5.7-3.7.4-1 1.1-1.9 2-2.5 1-.6 2.1-.9 3.2-.9 1.7 0 3.3.7 4.4 2zm-7.8 5.1c0 3.4 1.1 5.1 3.4 5.1s3.4-1.7 3.4-5.1c0-3.4-1.1-5.1-3.4-5.1s-3.4 1.7-3.4 5.1zM75.5 26.4c-.9.6-1.9.9-3 .9-1 .1-1.9-.3-2.6-1-.7-.8-1-1.8-.9-2.8v-8h-2.3v-1.8H69v-3l2.3-.3v3.3h3.2l-.2 1.8h-3v7.9c0 .5.1 1.1.4 1.5.3.3.8.5 1.2.5.6 0 1.2-.2 1.8-.5l.8 1.5zM86.9 15.3c1.1 1.5 1.7 3.3 1.6 5.1 0 1.3-.2 2.5-.7 3.7-.4 1-1.1 1.9-2 2.5-.9.6-2.1.9-3.2.9-1.7.1-3.3-.6-4.4-1.9-1.1-1.5-1.7-3.3-1.6-5.2 0-1.3.2-2.5.7-3.7.4-1 1.1-1.9 2-2.5 1-.6 2.1-.9 3.2-.9 1.7 0 3.3.7 4.4 2zm-7.8 5.1c0 3.4 1.1 5.1 3.4 5.1s3.4-1.7 3.4-5.1-1.1-5.1-3.4-5.1-3.4 1.7-3.4 5.1zM101.3 14.5c.7.8 1.1 1.9 1 3V27H100v-9.2c.1-.7-.1-1.4-.5-2-.4-.4-1-.6-1.6-.6-.7 0-1.3.2-1.9.6-.6.5-1.1 1.1-1.5 1.7V27h-2.4V13.7h2l.2 2c.4-.7 1-1.3 1.7-1.7.7-.4 1.5-.6 2.3-.6 1.3 0 2.3.4 3 1.1zM118.5 9.6L113 27h-2.6l-5.6-17.4h2.6l4.4 14.8 4.4-14.8h2.3zM130.7 11c1.2 1 1.9 2.5 1.8 4 .1 1.6-.6 3.2-1.8 4.2-1.4 1-3.2 1.5-4.9 1.4h-2.2V27h-2.4V9.6h4.6c1.7-.1 3.5.4 4.9 1.4zm-1.8 6.9c.8-.7 1.2-1.8 1.1-2.9.1-1-.3-2-1.1-2.7-.9-.6-2-.9-3.1-.8h-2.1v7.2h2.1c1 .1 2.1-.2 3.1-.8zM148 27h-3.2l-7.1-14.8c.1 1.2.2 2.2.2 3.2.1 1 .1 2.2.1 3.6v8h-2.2V9.6h3.1l7.1 14.8c0-.4-.1-1.2-.2-2.3-.1-1.1-.1-2.1-.1-3V9.6h2.2L148 27z" />
            </g>
            <title id="logo__title">ProtonVPN</title>
            {planName ? (
                <text
                    textAnchor="end"
                    className={`plan fill-${planName} uppercase bold`}
                    x="147"
                    y="42"
                    id="plan"
                    focusable={false}
                >
                    {planName}
                </text>
            ) : null}
        </svg>
    );
};

VpnLogo.propTypes = {
    planName: PropTypes.string,
    className: PropTypes.string
};

export default VpnLogo;
