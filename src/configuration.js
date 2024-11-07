const config = {
    websiteName: 'Registration System',
    year: 2024,
    subheader: 'CACI SSC | Aerolympics 2024',
    eventName: 'Aerolympics 2024',
    database: 'attendancesystem',
    password: 'reset123',
    websiteName: process.env.WEBSITENAME || 'Registration System',
    year: process.env.YEAR || 2024,
    subheader: process.env.SUBHEADER || 'CACI SSC | Aerolympics 2024',
    eventName: process.env.EVENTNAME || 'Aerolympics 2024',
    database: process.env.DATABASE || 'attendancesystem',
    password: process.env.PASSWORD || 'reset123',
    amount_1_name: process.env.AMOUNT_1_NAME || 'SSC Fee',
    amount_2_name: process.env.AMOUNT_2_NAME || 'Aquaintance Party Fee',
    amount_1_name: 'SSC Fee',
    amount_2_name: 'Aquaintance Party Fee',
};

export default config;
