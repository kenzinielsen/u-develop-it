const mysql = require('mysql2');

const exp = require('constants');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express middlewate
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //your mysql username
        user: 'root',
        //your mysql password
        password: 'Coko1414.',
        database: 'election'
    },
    console.log('Connected to the election database.')
);
db.query('SELECT * FROM candidates', (err, rows) => {
    console.log(rows);
});

//default response for any other request (not found)
app.use((req,res) => {
    res.status(404).end();
});



app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});