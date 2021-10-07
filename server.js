const mysql = require('mysql2');

const exp = require('constants');
const express = require('express');
const { regExpLiteral } = require('@babel/types');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputChecks');


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
        password: '',
        database: 'election'
    },
    console.log('Connected to the election database.')
);
db.query('SELECT * FROM candidates', (err, rows) => {
    console.log(rows);
});
db.query('SELECT * FROM candidates WHERE ID = 1', (err,row) => {
    if(err) {
        
        console.log(err);
    }
        console.log(row);
});

//delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({error:res.message});
        }else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: regExpLiteral.params.id
            });
        }
    });
});

//creat a candidate
app.post('/api/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors) {
        res.status(400).json({error: errors});
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql,params, (err, result) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// get a single candidat
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,row) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});
//get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM  candidates`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).jsonp({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});