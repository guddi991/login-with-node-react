const { json } = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const cors = require('cors')
const bodyparser = require('body-parser')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const app = express()
const PORT = process.env.PORT

// middlewares
app.use(cors())
app.use(bodyparser.json())

// DB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

db.connect((err)=>{
    if (err) throw err;
    console.log("DB connected successful.")
})

// 

// SignUp route
app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length > 0) {
            return res.status(400).send('Username already exists');
        }

        try {
            const hashPassword = await bcrypt.hash(password, 10);

            db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashPassword], (err, result) => {
                if (err) {
                    console.error("Error inserting into database:", err);
                    return res.status(500).send('Internal Server Error');
                }
                res.status(201).send('User created successfully');
            });
        } catch (hashError) {
            console.error("Error hashing password:", hashError);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Login route
app.post('/login', (req,res)=>{

    const { username, password } = req.body
    db.query('SELECT * FROM users WHERE username = (?)',[username],async (err,result)=>{
        if(err) throw err
        if(result.length === 0){
            return res.status(401).json({message: 'Invalid Username.'});
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({message: 'Invalid Password'})
        }

        const token  = jwt.sign({userID: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '1hr'})

        res.status(200).json({token});

    });
});

// server connection
app.listen(PORT,()=>{
    console.log("server is running on "+PORT)
})

