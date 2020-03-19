import React from 'react';
import PropTypes from 'prop-types';

const CalendarLogo = ({ planName = '', className = 'logo center' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby="logo__title plan"
            width="148"
            height="36"
        >
            <g>
                <path d="M21.828 12.13H18.26v13.348h2.245v-4.713h1.344a5.963 5.963 0 003.645-1.026 4.021 4.021 0 001.503-3.386c0-2.722-1.835-4.223-5.17-4.223zm-1.325 1.892h1.306c1.931 0 2.83.747 2.83 2.353a2.316 2.316 0 01-.757 1.977 3.439 3.439 0 01-2.11.5h-1.271l.002-4.83zM33.274 14.925a2.698 2.698 0 00-2.414 1.486l-.108-1.26h-1.93v10.33h2.189v-5.833c.385-1.773 1.002-2.526 2.054-2.526.265-.002.529.035.783.11l.26.066.405-2.18-.231-.06a4.111 4.111 0 00-1.008-.133zM39.6 14.925a4.21 4.21 0 00-3.39 1.524 6.944 6.944 0 00-.008 7.766 4.556 4.556 0 003.385 1.485 4.558 4.558 0 003.368-1.524 6.971 6.971 0 00.015-7.763 4.18 4.18 0 00-3.37-1.488zm-.017 8.885c-1.509 0-2.243-1.14-2.243-3.488a4.834 4.834 0 01.607-2.7 1.861 1.861 0 011.656-.808 1.828 1.828 0 011.628.805c.453.817.659 1.75.594 2.686.005 2.36-.735 3.505-2.242 3.505zM50.782 23.382c-.338.241-.739.377-1.152.391-.571 0-.904-.197-.904-1.196v-5.6h2.077l.254-1.832h-2.331v-2.45l-2.19.265v2.189h-1.687v1.833h1.687v5.669c-.05.825.221 1.637.756 2.26.56.548 1.319.835 2.095.79a3.906 3.906 0 002.306-.716l.189-.131L51 23.243l-.219.14zM56.746 14.925a4.211 4.211 0 00-3.39 1.524 6.946 6.946 0 00-.008 7.766 4.556 4.556 0 003.385 1.485 4.558 4.558 0 003.368-1.524 6.971 6.971 0 00.015-7.763 4.18 4.18 0 00-3.37-1.488zm-.018 8.885c-1.507 0-2.243-1.14-2.243-3.488a4.836 4.836 0 01.607-2.7 1.862 1.862 0 011.656-.808 1.828 1.828 0 011.629.805c.452.817.658 1.75.593 2.686.007 2.36-.734 3.505-2.241 3.505h-.001zM68.373 14.925a3.544 3.544 0 00-1.83.496c-.35.208-.667.47-.937.778l-.108-1.048h-1.925v10.331h2.189v-7.15c.682-1.087 1.344-1.55 2.206-1.55.763 0 1.271.28 1.271 1.648v7.054h2.19v-7.297a3.403 3.403 0 00-.806-2.374 2.944 2.944 0 00-2.25-.888zM81.703 22.67a3.967 3.967 0 01-2.527 1.03 2.705 2.705 0 01-2.278-1.09 6.313 6.313 0 01-.954-3.815c0-3.221 1.126-4.922 3.253-4.922a3.46 3.46 0 012.28.893l.191.158 1.281-1.527-.203-.164a5.206 5.206 0 00-3.66-1.318 5.039 5.039 0 00-3.887 1.778 7.74 7.74 0 00-1.61 5.111 7.87 7.87 0 001.552 5.112 5.017 5.017 0 003.982 1.795c1.417.048 2.79-.5 3.796-1.514l.151-.16-1.165-1.506-.202.138zM91.603 22.93v-4.49a3.512 3.512 0 00-.898-2.58 3.728 3.728 0 00-2.747-.936 9.58 9.58 0 00-3.426.685l-.231.087.581 1.723.237-.079c.811-.3 1.663-.471 2.525-.508 1.271 0 1.764.47 1.764 1.682v.47h-1.233a5.384 5.384 0 00-3.287.879 3.128 3.128 0 00-1.219 2.616c-.03.867.295 1.707.897 2.322.664.613 1.54.935 2.437.897a3.548 3.548 0 002.81-1.214 2.206 2.206 0 001.932 1.208l.203.023.523-1.625-.226-.084c-.359-.13-.642-.294-.642-1.075zm-4.217.975c-.953 0-1.417-.495-1.417-1.514a1.515 1.515 0 01.569-1.303 3.097 3.097 0 011.855-.453h1.014v1.933a2.208 2.208 0 01-2.017 1.337h-.004zM97.548 23.68c-.169.066-.35.098-.53.094-.175 0-.353 0-.353-.526V10.961l-2.19.266v12.056c-.092.629.1 1.266.522 1.735.423.468 1.03.719 1.655.682.534 0 1.06-.124 1.54-.362l.207-.102-.612-1.657-.239.1zM105.148 15.283a4.444 4.444 0 00-1.823-.356 3.79 3.79 0 00-3.144 1.573 6.499 6.499 0 00-1.126 3.917 5.902 5.902 0 001.19 3.844 4.197 4.197 0 003.337 1.437 5.461 5.461 0 003.53-1.284l.19-.153-1.021-1.428-.202.143a3.773 3.773 0 01-2.37.81c-1.35 0-2.133-.887-2.327-2.636h6.116l.02-.235c.016-.171.039-.514.039-.897a5.808 5.808 0 00-1.07-3.708 3.48 3.48 0 00-1.34-1.027zm-3.768 4.096a3.762 3.762 0 01.622-1.951c.326-.424.835-.66 1.364-.632.58-.04 1.143.21 1.508.67.362.568.541 1.235.514 1.91h-4.008v.003zM114.642 14.925a3.546 3.546 0 00-1.83.496c-.351.208-.667.47-.937.778l-.108-1.048h-1.925v10.331h2.19v-7.15c.682-1.087 1.345-1.55 2.205-1.55.764 0 1.272.28 1.272 1.648v7.054h2.19v-7.297a3.403 3.403 0 00-.806-2.374 2.948 2.948 0 00-2.251-.888zM126.383 15.801a3.618 3.618 0 00-5.344.696 6.646 6.646 0 00-1.06 3.864 6.717 6.717 0 00.992 3.835 3.543 3.543 0 002.685 1.5 3.53 3.53 0 002.836-1.178l.116.959h1.96v-14.25l-2.19-.266v4.84h.005zm0 2.115v4.634a2.46 2.46 0 01-2.132 1.28 1.54 1.54 0 01-1.405-.79 5.387 5.387 0 01-.541-2.718c-.06-.94.145-1.88.588-2.707a1.703 1.703 0 011.508-.819c.8.026 1.539.444 1.982 1.12zM138.567 22.93v-4.49a3.509 3.509 0 00-.899-2.58 3.727 3.727 0 00-2.746-.936 9.576 9.576 0 00-3.425.685l-.231.087.581 1.723.237-.079c.811-.3 1.662-.471 2.525-.508 1.271 0 1.764.47 1.764 1.682v.47h-1.234a5.384 5.384 0 00-3.287.879 3.128 3.128 0 00-1.219 2.616c-.03.867.295 1.707.896 2.322.665.613 1.54.935 2.436.897a3.548 3.548 0 002.811-1.214 2.206 2.206 0 001.931 1.208l.205.023.523-1.625-.226-.084c-.358-.13-.642-.294-.642-1.075zm-4.211.975c-.954 0-1.418-.495-1.418-1.514a1.514 1.514 0 01.569-1.303 3.097 3.097 0 011.855-.453h1.014v1.933a2.213 2.213 0 01-2.02 1.337zM146.997 15.045a4.282 4.282 0 00-1.014-.12 2.698 2.698 0 00-2.415 1.486l-.108-1.26h-1.93v10.33h2.189v-5.833c.384-1.773 1.002-2.526 2.054-2.526a2.75 2.75 0 01.783.11l.259.066.405-2.18-.223-.073z" />
                <g>
                    <path d="M1.885 25.272c-.5 0-.98-.194-1.333-.539a1.815 1.815 0 01-.552-1.3V13.197a1.77 1.77 0 01.52-1.277c.34-.342.807-.537 1.295-.544h.934v-.498a.837.837 0 01.313-.57.88.88 0 01.635-.187h.026a.925.925 0 01.648.27c.17.17.263.4.259.638v.346h4.628v-.346c0-.507.422-.919.943-.919.52 0 .942.412.942.92v.345h.998c.977.079 1.76.82 1.87 1.77v10.289c0 1.009-.835 1.83-1.87 1.838H1.885zm-.59-1.888v.017a.498.498 0 00.156.356.524.524 0 00.37.143h10.325a.522.522 0 00.526-.516v-8.692H1.295v8.692zM7.2 19.1c0-1.946.802-2.998 2.277-2.998 1.474 0 2.274 1.052 2.274 2.998 0 1.947-.802 3.054-2.274 3.054-1.473 0-2.28-1.102-2.28-3.054H7.2zm1.54 0c0 1.555.262 2.015.802 2.015.591 0 .802-.461.802-2.015 0-1.553-.262-2.027-.802-2.027-.608 0-.805.468-.805 2.027h.003zm-6.406 2.141l.737-.705c.297.349.732.559 1.197.579a.873.873 0 00.628-.19.83.83 0 00.306-.567v-.089c0-.591-.333-.849-.934-.849h-.474l.145-.908h.332c.54 0 .869-.257.869-.786a.69.69 0 00-.256-.498.727.727 0 00-.548-.156 1.603 1.603 0 00-1.131.528l-.671-.718c.533-.517 1.26-.8 2.011-.782.456-.082.925.027 1.293.3.369.274.601.686.641 1.136a1.334 1.334 0 01-1.13 1.36c.754.024 1.348.637 1.33 1.373v.064c0 .973-.802 1.757-2.277 1.757a2.41 2.41 0 01-2.074-.849h.006z" />
                </g>
            </g>
            <title id="logo__title">ProtonCalendar</title>
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

CalendarLogo.propTypes = {
    planName: PropTypes.string,
    className: PropTypes.string
};

export default CalendarLogo;
