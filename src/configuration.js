const config = {
    websiteName: process.env.REACT_APP_WEBSITENAME || 'Registration System',
    year: process.env.REACT_APP_YEAR || 2024,
    subheader: process.env.REACT_APP_SUBHEADER || 'CACI SSC | Aerolympics 2024',
    eventName: process.env.REACT_APP_EVENTNAME || 'Aerolympics 2024',
    database: process.env.REACT_APP_DATABASE || 'attendancesystem',
    password: process.env.REACT_APP_PASSWORD || 'reset123',
    amount_1_name: process.env.REACT_APP_AMOUNT_1_NAME || 'SSC Fee',
    amount_2_name:
        process.env.REACT_APP_AMOUNT_2_NAME || 'Aquaintance Party Fee',
};

export default config;
