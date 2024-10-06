const { createPool } = require('mysql2');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const BigInt = require('big-integer');
const dir = '../../public/signatures';

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define your routes
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Connected to API' });
});

router.get('/all', (req, res) => {
    const SQLquery = 'SELECT * FROM `members`';
    pool.query(SQLquery, (err, results) => {
        if (err) {
            console.error('ERROR', err);
            return res
                .status(500)
                .send({ message: 'Failed to execute database query' });
        } else {
            return res.status(200).send({ results });
        }
    });
});

router.get('/allFiltered', async (req, res) => {
    const { coursesFilter, yearLevelFilter, onlyPresent, order } = req.query;
    //console.log(req);
    console.log({ coursesFilter, yearLevelFilter, onlyPresent });
    const courseFilters = JSON.parse(coursesFilter);
    const yearFilters = JSON.parse(yearLevelFilter);

    // Parse onlyPresent to a boolean
    const isOnlyPresent = onlyPresent === 'true';
    try {
        const members = await prisma.members.findMany({
            where: {
                AND: [
                    // Year level filters (AND condition)
                    {
                        OR: [
                            yearFilters.Freshman ? { year: 1 } : null,
                            yearFilters.Sophomore ? { year: 2 } : null,
                            yearFilters.Junior ? { year: 3 } : null,
                            yearFilters.Senior ? { year: 4 } : null,
                        ].filter(Boolean),
                    },
                    // Presence filter (if applicable)
                    isOnlyPresent ? { timeIn: { not: null } } : null,
                ].filter(Boolean),
                // Course filters (OR condition)
                OR: [
                    courseFilters.AMT ? { course: 'AMT' } : null,
                    courseFilters.AMGT ? { course: 'AMGT' } : null,
                    courseFilters.AE ? { course: 'AE' } : null,
                ].filter(Boolean),
            },
            orderBy: {
                name:
                    !order || (order !== 'asc' && order !== 'desc')
                        ? 'asc'
                        : order,
            },
        });
        const sanitizedMembers = members.map((member) => ({
            ...member,
            id: member.id.toString(), // Ensure BigInt fields are converted to strings
        }));
        // console.log(sanitizedMembers)

        res.status(200).send({ data: sanitizedMembers });
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).send({
            message: 'Failed to execute database query',
            error: error,
        });
    }
});

router.get('/member', async (req, res) => {
    if (req.query.memberId) {
        return res.status(400).send({ error: 'memberId is required' });
    }
    const id = BigInt(req.query.id); // Directly convert memberId to BigInt
    const member = await prisma.members.findUnique({
        where: { id: id }, // Use the converted BigInt id
    });

    if (!member) {
        return res.status(404).send({ error: 'Member not found' });
    }

    res.status(200).send({ data: { ...member, id: member.id.toString() } });
});

router.put('/editMember', async (req, res) => {
    const {
        id,
        name,
        email,
        course,
        year,
        regular,
        organization,
        remarks,
        timeIn,
        timeOut,
        amount,
        amount_2,
    } = req.body;
    try {
        console.log(req.body);
        const updatedMember = await prisma.members.update({
            where: { id: BigInt(id) },
            data: {
                name,
                email,
                course,
                year,
                regular,
                organization,
                remarks,
                timeIn,
                timeOut,
                amount: !parseInt(amount) ? parseInt(amount) : null,
                amount_2: !parseInt(amount_2) ? parseInt(amount_2) : null,
            },
        });
        console.log('UPDATED MEMBER', updatedMember);

        res.status(200).send({
            message: 'Member updated successfully',
            data: { ...updatedMember, id: updatedMember.id.toString() },
        });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).send({
            message: 'Failed to update member',
            error: error,
        });
    }
});

router.get('/searchFiltered', async (req, res) => {
    const {
        coursesFilter,
        yearLevelFilter,
        onlyPresent,
        orgsFilter,
        searchParams,
        orderName,
        paidFilter,
    } = req.query;

    console.log({
        coursesFilter,
        yearLevelFilter,
        onlyPresent,
        searchParams,
        orgsFilter,
        orderName,
        paidFilter,
    });

    const courseFilters = JSON.parse(coursesFilter);
    const yearFilters = JSON.parse(yearLevelFilter);
    const organizationFilters = JSON.parse(orgsFilter); // Parse orgsFilter
    // Parse onlyPresent to a boolean
    const isOnlyPresent = onlyPresent === 'true';

    try {
        const members = await prisma.members.findMany({
            where: {
                AND: [
                    // Year level filters (AND condition)
                    {
                        OR: [
                            yearFilters.Freshman ? { year: 1 } : null,
                            yearFilters.Sophomore ? { year: 2 } : null,
                            yearFilters.Junior ? { year: 3 } : null,
                            yearFilters.Senior ? { year: 4 } : null,
                        ].filter(Boolean),
                    },
                    // Course filters (OR condition)
                    {
                        OR: [
                            courseFilters.AMT ? { course: 'AMT' } : null,
                            courseFilters.AMGT ? { course: 'AMGT' } : null,
                            courseFilters.AE ? { course: 'AE' } : null,
                        ].filter(Boolean),
                    },
                    // Organization filters (OR condition)
                    {
                        OR: Object.keys(organizationFilters)
                            .filter((org) => organizationFilters[org]) // Only include selected organizations
                            .map((org) => ({ organization: org })),
                    },
                    // Apply search query across relevant fields
                    searchParams
                        ? {
                              OR: [
                                  {
                                      name: {
                                          contains: searchParams.toLowerCase(),
                                      },
                                  }, // Name
                                  {
                                      organization: {
                                          contains: searchParams.toLowerCase(),
                                      },
                                  }, // Organization
                              ],
                          }
                        : null,
                    // Presence filter (if applicable)
                    isOnlyPresent ? { timeIn: { not: null } } : null,
                    // Paid filter logic
                    !paidFilter || paidFilter === 'ALL'
                        ? null
                        : paidFilter === 'UNPAID'
                          ? { paid: false } // Only unpaid
                          : { paid: true }, // Only paid
                ].filter(Boolean),
            },
            orderBy: {
                name:
                    orderName === 'asc' || orderName === 'desc'
                        ? orderName
                        : 'asc',
            },
        });

        // Convert BigInt IDs to strings
        const sanitizedMembers = members.map((member) => ({
            ...member,
            id: member.id.toString(),
        }));

        // Return filtered data
        res.status(200).send({ data: sanitizedMembers });
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).send({
            message: 'Failed to execute database query',
            error,
        });
    }
});

router.get('/committeeMembers', async (req, res) => {
    const {
        coursesFilter,
        yearLevelFilter,
        onlyPresent,
        orgsFilter,
        searchParams,
        orderName,
    } = req.query;

    console.log({
        coursesFilter,
        yearLevelFilter,
        onlyPresent,
        searchParams,
        orgsFilter,
    });

    const courseFilters = JSON.parse(coursesFilter);
    const yearFilters = JSON.parse(yearLevelFilter);
    const organizationFilters = JSON.parse(orgsFilter); // Parse orgsFilter

    // Parse onlyPresent to a boolean
    const isOnlyPresent = onlyPresent === 'true';

    try {
        const committeeMembers = await prisma.members.findMany({
            where: {
                AND: [
                    { isEventCommittee: true }, // Only include event committee members
                    // Year level filters (AND condition)
                    {
                        OR: [
                            yearFilters.Freshman ? { year: 1 } : null,
                            yearFilters.Sophomore ? { year: 2 } : null,
                            yearFilters.Junior ? { year: 3 } : null,
                            yearFilters.Senior ? { year: 4 } : null,
                        ].filter(Boolean),
                    },
                    // Course filters (OR condition)
                    {
                        OR: [
                            courseFilters.AMT ? { course: 'AMT' } : null,
                            courseFilters.AMGT ? { course: 'AMGT' } : null,
                            courseFilters.AE ? { course: 'AE' } : null,
                        ].filter(Boolean),
                    },
                    // Organization filters (OR condition)
                    {
                        OR: Object.keys(organizationFilters)
                            .filter((org) => organizationFilters[org]) // Only include selected organizations
                            .map((org) => ({ organization: org })),
                    },
                    // Apply search query across relevant fields
                    searchParams
                        ? {
                              OR: [
                                  {
                                      name: {
                                          contains: searchParams.toLowerCase(),
                                      },
                                  }, // Name
                                  {
                                      organization: {
                                          contains: searchParams.toLowerCase(),
                                      },
                                  }, // Organization
                              ],
                          }
                        : null,
                    // Presence filter (if applicable)
                    isOnlyPresent ? { timeIn: { not: null } } : null,
                ].filter(Boolean),
            },
            orderBy: {
                name:
                    orderName === 'asc' || orderName === 'desc'
                        ? orderName
                        : 'asc',
            },
        });

        // Convert BigInt IDs to strings
        const sanitizedMembers = committeeMembers.map((member) => ({
            ...member,
            id: member.id.toString(),
        }));

        // Return filtered data
        res.status(200).send({ data: sanitizedMembers });
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).send({
            message: 'Failed to execute database query',
            error,
        });
    }
});

router.post('/resetCommitteeMembers', async (req, res) => {
    const { secret, password } = req.body;
    if (secret !== password) {
        return res.status(403).send({ message: 'Wrong Password' });
    }
    try {
        const updatedMembers = await prisma.members.updateMany({
            where: {
                isEventCommittee: true, // Only target current committee members
            },
            data: {
                isEventCommittee: false, // Set to non-committee members
            },
        });

        res.status(200).send({
            message: `${updatedMembers.count} members have been reset to non-committee members.`,
        });
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).send({
            message: 'Failed to reset committee members',
            error,
        });
    }
});

router.get('/organizations', async (req, res) => {
    try {
        const organizations = await prisma.members.findMany({
            distinct: ['organization'], // Get distinct organizations
            select: {
                organization: true, // Only select the organization field
            },
        });

        res.json(organizations.map((org) => org.organization)); // Send back the list of organizations
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while fetching organizations.',
        });
    }
});

router.get('/get-by-params', (req, res) => {
    const { order, colfilter, filter } = req.body;
    var SQLquery = 'SELECT * FROM `members`';
    if (filter) {
        SQLquery = SQLquery.concat(` WHERE ${colfilter} = ${filter}`);
    }
    if (order) {
        SQLquery = SQLquery.concat(` ORDER BY ${order}`);
    }
    pool.query(SQLquery, (err, results) => {
        if (err) {
            console.error('ERROR', err);
            return res
                .status(500)
                .send({ message: 'Failed to execute database query' });
        } else {
            return res.status(200).send({ results });
        }
    });
});

router.post('/save-signature', upload.single('signature'), (req, res) => {
    const { id, signature } = req.body;

    const base64Data = signature.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(dir, `${id}.png`);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Save file location to database
        const SQLquery = 'UPDATE  members SET signature = ? WHERE id = ?;';
        pool.query(SQLquery, [filePath, id], (err, results) => {
            if (err) {
                console.error('ERROR ADDING SIGNATURE', err);
                return res
                    .status(500)
                    .send({ message: 'Failed to execute database query' });
            }
        });
        console.log(`Saved signature for ID: ${id} at ${filePath}`);
        res.status(200).send('Signature saved successfully');
    });
});

router.post('/clear-signature', (req, res) => {
    const { id, idNumber } = req.body;
    const SQLquery = 'UPDATE members SET signature = NULL WHERE id = ?;';
    pool.query(SQLquery, [id], (err, results) => {
        if (err) {
            console.error(`ERROR CLEARING SIGNATURE FOR USER ${id}`, err);
            return res
                .status(500)
                .send({ message: 'Failed to execute database query' });
        }
    });
    const filePath = path.join(dir, `${id}.png`);

    // Remove the signature file
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(
                `ERROR REMOVING SIGNATURE FILE FOR USER ${idNumber}`,
                err
            );
            return res
                .status(500)
                .send({ message: 'Failed to remove signature file' });
        }

        console.log(`Cleared signature for ID ${id}`);
        res.status(200).send('Signature cleared successfully');
    });
});

router.get('/search', async (req, res) => {
    const searchTerm = req.query.searchTerm;

    try {
        const members = await prisma.members.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchTerm.toLowerCase(),
                        },
                    },
                    {
                        email: {
                            contains: searchTerm.toLowerCase(),
                        },
                    },
                    {
                        organization: {
                            contains: searchTerm.toLowerCase(),
                        },
                    },
                ],
            },
            take: 15, // Limit the results to 15
        });

        // Send the results back as a response
        const sanitizedMembers = members.map((member) => ({
            ...member,
            id: member.id.toString(), // Sanitize BigInt ID to string
        }));
        res.status(200).send(sanitizedMembers);
    } catch (error) {
        console.error('Error executing database query:', error);
        return res
            .status(500)
            .send({ message: 'Failed to execute database query' });
    }
});

router.post('/claim', (req, res) => {
    const id = req.body.id;
    console.log(req.body);

    const SQLquery = 'UPDATE members SET claimed = 1 WHERE id = ?;';
    // Execute the query
    pool.query(SQLquery, [id], (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res
                .status(500)
                .send({ message: 'Failed to execute database query' });
        }

        // Send the results back as a response
        res.status(200).send({ message: 'Successful!' });
    });
});

router.post('/unclaim', (req, res) => {
    const id = req.body.id;
    console.log(req.body);
    const SQLquery = 'UPDATE members SET claimed = 0 WHERE id = ?;';
    // Execute the query
    pool.query(SQLquery, [id], (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res
                .status(500)
                .send({ message: 'Failed to execute database query' });
        }

        // Send the results back as a response
        res.status(200).send({ message: 'Successful!' });
    });
});

// Route to update timeIn based on id
router.post('/update-timein', (req, res) => {
    const { id } = req.body; // Assuming id is sent in the request body
    const currentTime =
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(); // Get current time

    // Create a SQL query to update the timeIn field
    const query = `
        UPDATE members 
        SET timeIn = ?
        WHERE id = ?`;

    // Execute the query with current time and id
    pool.query(query, [currentTime, id], (err, result) => {
        if (err) {
            console.error('Error updating timeIn:', err);
            res.status(500).json({ error: 'Error updating timeIn' });
        } else {
            console.log('TimeIn updated successfully');
            res.status(200).json({ message: 'TimeIn updated successfully' });
        }
    });
});

router.post('/reset-timein', (req, res) => {
    const { id } = req.body; // Assuming id is sent in the request body

    // Create a SQL query to rest the timeIn field
    const query = `
        UPDATE members 
        SET timeIn = null
        WHERE id = ?`;

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error updating timeIn:', err);
            res.status(500).json({ error: 'Error updating timeIn' });
        } else {
            console.log('TimeIn updated successfully');
            res.status(200).json({ message: 'TimeIn updated successfully' });
        }
    });
});

// Route to update timeIn based on id
router.post('/update-timeout', (req, res) => {
    const { id } = req.body; // Assuming id is sent in the request body
    const currentTime =
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(); // Get current time

    // Create a SQL query to update the timeIn field
    const query = `
        UPDATE members 
        SET timeOut = ?
        WHERE id = ?`;

    // Execute the query with current time and id
    pool.query(query, [currentTime, id], (err, result) => {
        if (err) {
            console.error('Error updating timeOut:', err);
            res.status(500).json({ error: 'Error updating timeOut' });
        } else {
            console.log('TimeIn updated successfully');
            res.status(200).json({ message: 'TimeOut updated successfully' });
        }
    });
});

router.post('/togglePaid', async (req, res) => {
    const { id } = req.body;

    try {
        const data = await prisma.members.findUnique({
            where: {
                id: id,
            },
        });
        const isPaid = data.paid;
        const response = await prisma.members.update({
            where: {
                id: id,
            },
            data: {
                paid: isPaid == 0 ? true : false,
            },
        });
        res.status(201).json({ message: 'Updated Payment' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        prisma.$disconnect();
    }
});

router.post('/setPaidAmount', async (req, res) => {
    const { id, paid_amount } = req.body;

    if (!id || paid_amount === undefined) {
        return res.status(400).json({ message: 'Missing id or paid_amount' });
    }

    try {
        const response = await prisma.members.update({
            where: {
                id: id,
            },
            data: {
                paid: paid_amount > 0 ? true : false,
                amount: parseInt(paid_amount) || 0,
            },
        });
        res.status(200).json({
            message: `Updated Payment Amount to ${paid_amount}`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        prisma.$disconnect();
    }
});

router.post('/setPaidAmount2', async (req, res) => {
    const { id, paid_amount } = req.body;

    if (!id || paid_amount === undefined) {
        return res.status(400).json({ message: 'Missing id or paid_amount' });
    }

    try {
        const response = await prisma.members.update({
            where: {
                id: id,
            },
            data: {
                paid_2: paid_amount > 0 ? true : false,
                amount_2: parseInt(paid_amount) || null,
            },
        });
        res.status(200).json({
            message: `Updated Payment Amount to ${paid_amount}`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        prisma.$disconnect();
    }
});

router.get('/paymentTotal', async (req, res) => {
    try {
        const totalPaid = await prisma.members.count({
            where: {
                paid: true,
            },
        });
        const totalAmountPaid = await prisma.members.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                paid: true,
            },
        });
        const totalNotYetPaid = await prisma.members.count({
            where: {
                paid: false,
            },
        });
        res.status(200).json({
            totalPaid: totalPaid,
            totalAmountPaid:
                totalAmountPaid._sum.amount != null
                    ? totalAmountPaid._sum.amount
                    : 0,
            totalNotYetPaid: totalNotYetPaid,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/paymentTotal2', async (req, res) => {
    try {
        const totalPaid = await prisma.members.count({
            where: {
                paid_2: true,
            },
        });
        const totalAmountPaid = await prisma.members.aggregate({
            _sum: {
                amount_2: true,
            },
            where: {
                paid_2: true,
            },
        });
        const totalNotYetPaid = await prisma.members.count({
            where: {
                paid_2: false,
            },
        });
        res.status(200).json({
            totalPaid: totalPaid,
            totalAmountPaid:
                totalAmountPaid._sum.amount_2 != null
                    ? totalAmountPaid._sum.amount_2
                    : 0,
            totalNotYetPaid: totalNotYetPaid,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/reset-timeout', (req, res) => {
    const { id } = req.body; // Assuming id is sent in the request body

    // Create a SQL query to rest the timeOut field
    const query = `
        UPDATE members 
        SET timeOut = NULL
        WHERE id = ?`;

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error updating timeOut:', err);
            res.status(500).json({ error: 'Error updating timeOut' });
        } else {
            console.log('TimeIn updated successfully');
            res.status(200).json({ message: 'TimeOut updated successfully' });
        }
    });
});

router.post('/update-remarks', (req, res) => {
    const { id, remarks } = req.body;

    const query = `UPDATE members SET remarks = ? WHERE id = ?`;

    pool.query(query, [remarks, id], (err, result) => {
        if (err) {
            console.error('Error updating remarks', err);
            res.status(500).json({ error: 'Error updating remarks' });
        } else {
            res.status(200).json({ message: 'Remarks updated successfully' });
        }
    });
});

router.post('/add', (req, res) => {
    const {
        name,
        email,
        year,
        course,
        regular,
        remarks,
        organization,
        timeIn,
        timeOut,
    } = req.body;
    //console.log(req.body)
    const query = `INSERT INTO members (name, email, year, course, regular, remarks, organization, timeIn, timeOut)
    VALUES (?,?,?,?,?,?,?,?, ?);
    `;

    const timeInValue = timeIn || null;
    const timeOutValue = timeOut || null;

    pool.query(
        query,
        [
            name,
            email,
            year,
            course,
            regular,
            remarks,
            organization,
            timeInValue,
            timeOutValue,
        ],
        (err, result) => {
            if (err) {
                console.error('Error Adding Record!', err);
                res.status(400).json({ error: 'Bad Request' });
            } else {
                res.status(200).json({ message: 'Added Record' });
            }
        }
    );
});

router.post('/reset-all-time', (req, res) => {
    const { password, secret } = req.body;
    console.log(password);
    const query = `UPDATE members SET timeIn = NULL, timeOut = NULL, organization = 'NONE'`;
    if (password === secret) {
        pool.query(query, (err, result) => {
            if (err) {
                res.status(200).json({ message: 'DB Error' });
            } else {
                res.status(200).json({ message: 'Database Resetted' });
            }
        });
    } else {
        res.status(200).json({ message: 'Retype Password Correctly.' });
    }
});

router.post('/reset-all-payments', async (req, res) => {
    const { secret, password } = req.body;
    try {
        if (secret !== password) {
            res.status(400).json({ message: 'Incorrect Password!' });
            return;
        }
        await prisma.members.updateMany({
            data: {
                paid: false,
                amount: 0,
            },
        });
        res.status(200).json({ message: 'Resetted Payments' });
    } catch (error) {
        res.status(500).json({ message: `Database Error: ${error.message}` });
    } finally {
        prisma.$disconnect();
    }
});

router.get('/status', (req, res) => {
    const query = `SELECT 
    COUNT(*) AS total_records,
    COUNT(timeIn) AS timed_in,
    COUNT(*) - COUNT(timeIn) AS not_timed_in
FROM 
    members;
`;

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error Retrieving Status');
            res.status(200).json({
                present: 'Error connecting to server',
                absent: 'Err',
                total: 'Err',
            });
        } else {
            //console.log(result[0].total_records)
            res.status(200).json({
                present: result[0].timed_in,
                absent: result[0].not_timed_in,
                total: result[0].total_records,
            });
        }
    });
});
module.exports = router;
