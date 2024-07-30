const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { createPool } = require('mysql2');

const dir = '../../public/signatures';

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

if (!fs.existsSync(dir)){
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
    pool.query(SQLquery, (err, results)=>{
        if(err){
            console.error("ERROR", err)
            return res.status(500).send({message: 'Failed to execute database query'});
        }else{
            return res.status(200).send({results})
        }
    })
});

router.post('/save-signature', upload.single('signature'), (req, res) => {
    const { id, idNumber, signature } = req.body;
  
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(dir, `${id}.png`);
  
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      // Save file location to database
      const SQLquery = 'UPDATE  members SET signature = ? WHERE id = ?;'
      pool.query(SQLquery, [filePath, id], (err, results)=>{
        if (err){
            console.error("ERROR ADDING SIGNATURE", err)
            return res.status(500).send({message: 'Failed to execute database query'});
        }
      })
        console.log(`Saved signature for ID: ${id} with ${idNumber} at ${filePath}`);
        res.status(200).send('Signature saved successfully');
    });
  });

router.post('/clear-signature', (req, res)=>{
        const {id, idNumber} = req.body;
        const SQLquery = 'UPDATE members SET signature = NULL WHERE id = ?;'
        pool.query(SQLquery, [id], (err, results)=>{
            if (err){
                console.error(`ERROR CLEARING SIGNATURE FOR USER ${id}`, err)
                return res.status(500).send({message: 'Failed to execute database query'});
            }
        })
        const filePath = path.join(dir, `${id}.png`);

        // Remove the signature file
        fs.unlink(filePath, (err) => {
          if (err) {
              console.error(`ERROR REMOVING SIGNATURE FILE FOR USER ${idNumber}`, err);
              return res.status(500).send({ message: 'Failed to remove signature file' });
          }
        
            console.log(`Cleared signature for ID ${id}`);
            res.status(200).send('Signature cleared successfully');
        });
});

router.get('/search', (req, res) => {
    const searchTerm = req.query.searchTerm;
    // Construct the SQL query with the LIKE operator
    const SQLquery = 'SELECT * FROM members WHERE name LIKE ? OR id_number LIKE ? LIMIT 10'; 

    // Prepare the values for the LIKE operator 
    const searchValue = `%${searchTerm}%`;

    // Execute the query
    pool.query(SQLquery, [searchValue, searchValue], (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).send({ message: 'Failed to execute database query' });
        }

        // Send the results back as a response
        res.status(200).send(results);
    });
});

router.post('/claim', (req, res) => {
    const id = req.body.id;
    console.log(req.body)

    const SQLquery = 'UPDATE members SET claimed = 1 WHERE id = ?;'; 
    // Execute the query
    pool.query(SQLquery, [id], (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).send({ message: 'Failed to execute database query' });
        }

        // Send the results back as a response
        res.status(200).send({message: "Successful!"});
    });
});

router.post('/unclaim', (req, res) => {
    const id = req.body.id;
    console.log(req.body)

    const SQLquery = 'UPDATE members SET claimed = 0 WHERE id = ?;'; 
    // Execute the query
    pool.query(SQLquery, [id], (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).send({ message: 'Failed to execute database query' });
        }

        // Send the results back as a response
        res.status(200).send({message: "Successful!"});
    });
});


// Route to update timeIn based on id
router.post('/update-timein', (req, res) => {
    const { id } = req.body; // Assuming id is sent in the request body
    const currentTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(); // Get current time

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
        SET timeIn = NULL
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
    const currentTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(); // Get current time

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

router.post('/update-remarks',(req, res)=>{
    const { id, remarks } = req.body;
    

    const query = `UPDATE members SET remarks = ? WHERE id = ?`;

    pool.query(query, [remarks, id], (err, result)=>{
        if(err){
            console.error('Error updating remarks', err);
            res.status(500).json({ error: 'Error updating remarks' });
        }else{
            res.status(200).json({ message: 'Remarks updated successfully' });
        }
    })
})

router.post('/add', (req, res)=>{
    const { name, id_number, email, program, additional, remarks, orgname, position} = req.body;
    console.log(req.body)

    const query = `INSERT INTO members (name, id_number, email, program, additional, remarks, orgname, position)
    VALUES (?,?,?,?,?,?,?,?);
    `

    pool.query(query, [name, id_number, email, program, additional, remarks, orgname, position], (err, result)=>{
        if(err){
            console.error("Error Adding Record!", err);
            res.status(400).json({error: 'Bad Request'});
        }else{
            res.status(200).json({message: 'Added Record'});
        }
    })
})

router.get('/status', (req, res)=>{
    const query = `SELECT 
    COUNT(*) AS total_records,
    COUNT(timeIn) AS timed_in,
    COUNT(*) - COUNT(timeIn) AS not_timed_in
FROM 
    members;
`

    pool.query(query, (err, result)=>{
        if(err){
            console.error("Error Retrieving Status")
            res.status(200).json({
                present: "Error connecting to server",
                absent: "Err",
                total: "Err"
            });
        }else{
            //console.log(result[0].total_records)
            res.status(200).json({
                present: result[0].timed_in,
                absent: result[0].not_timed_in,
                total: result[0].total_records
            })
        }
    })
})
module.exports = router;
